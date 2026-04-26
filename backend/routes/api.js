const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const authMiddleware = require('../middleware/authMiddleware');

// ─── PROTECTED ROUTES ────────────────────────────────────────────────────────
router.use('/dashboard', authMiddleware);
router.use('/users', authMiddleware);
router.use('/trips', authMiddleware);

// ─── USERS ────────────────────────────────────────────────────────────────────

// GET all users
router.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, full_name, email, tier, social_category, balance FROM users ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single user
router.get('/users/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST top-up balance
router.post('/users/:id/topup', async (req, res) => {
  const { amount } = req.body;
  if (!amount || isNaN(amount) || amount <= 0)
    return res.status(400).json({ error: 'Invalid amount' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      'UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *',
      [amount, req.params.id]
    );
    if (!rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'User not found' }); }

    // Log transaction
    await client.query(
      "INSERT INTO transactions (user_id, amount, type, description) VALUES ($1, $2, 'topup', 'Balance top-up')",
      [req.params.id, amount]
    );

    // Recover any active negative balance debt
    if (rows[0].balance < 0) {
      await client.query(
        "INSERT INTO transactions (user_id, amount, type, description) VALUES ($1, $2, 'debt_recovery', 'Auto debt recovery')",
        [req.params.id, rows[0].balance]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Top-up successful', user: rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ─── TRANSIT: TAP IN ──────────────────────────────────────────────────────────

// POST /transit/tap-in
router.post('/transit/tap-in', async (req, res) => {
  const { card_number, route_id, start_stop_id, signal_type } = req.body;

  try {
    // Find the card and user
    const cardRes = await pool.query(
      'SELECT c.*, u.tier, u.balance, u.negative_limit FROM cards c JOIN users u ON c.user_id = u.id WHERE c.card_number = $1',
      [card_number]
    );
    if (!cardRes.rows.length) return res.status(404).json({ error: 'Card not found' });

    const card = cardRes.rows[0];

    // Tourist check: zero balance = deny
    if (card.tier === 'tourist' && parseFloat(card.balance) <= 0) {
      return res.status(403).json({ error: 'Tourist card has zero balance. Please top up.' });
    }

    // Citizen: negative limit check
    if (card.tier === 'citizen' && parseFloat(card.balance) <= parseFloat(card.negative_limit)) {
      return res.status(403).json({ error: 'Negative balance limit reached. Please top up.' });
    }

    // Create active trip
    const tripRes = await pool.query(
      `INSERT INTO trips (user_id, card_id, route_id, start_stop_id, signal_type, status)
       VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *`,
      [card.user_id, card.id, route_id, start_stop_id, signal_type || 'GPS']
    );

    res.json({ message: 'Tap-in successful', trip: tripRes.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── TRANSIT: TAP OUT ─────────────────────────────────────────────────────────

// Fare calculation based on distance
function calculateFare(distance_km, social_category) {
  const BASE_FARE = 0.20;
  const PER_KM_RATE = 0.10;
  const MIN_FARE = 0.20;
  const MAX_FARE = 1.50;

  const discounts = {
    student: 0.50,
    veteran: 0.75,
    senior: 0.50,
    standard: 0.00,
  };

  let fare = BASE_FARE + (distance_km * PER_KM_RATE);
  fare = Math.min(Math.max(fare, MIN_FARE), MAX_FARE);
  fare = fare - (fare * (discounts[social_category] || 0));
  return parseFloat(fare.toFixed(2));
}

// POST /transit/tap-out
router.post('/transit/tap-out', async (req, res) => {
  const { trip_id, end_stop_id, distance_km, signal_type } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get trip + user info
    const tripRes = await client.query(
      `SELECT t.*, u.social_category, u.tier, u.balance, u.negative_limit, u.id as user_id_real
       FROM trips t JOIN users u ON t.user_id = u.id
       WHERE t.id = $1 AND t.status = 'active'`,
      [trip_id]
    );
    if (!tripRes.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Active trip not found' }); }

    const trip = tripRes.rows[0];
    const fare = calculateFare(distance_km || 3, trip.social_category);

    // Deduct fare
    const userRes = await client.query(
      'UPDATE users SET balance = balance - $1 WHERE id = $2 RETURNING balance',
      [fare, trip.user_id]
    );

    const newBalance = parseFloat(userRes.rows[0].balance);

    // Update trip record
    await client.query(
      `UPDATE trips SET end_stop_id=$1, end_time=NOW(), distance_km=$2, fare=$3, signal_type=$4, status='completed' WHERE id=$5`,
      [end_stop_id, distance_km || 3, fare, signal_type || trip.signal_type, trip_id]
    );

    // Log transaction
    await client.query(
      "INSERT INTO transactions (user_id, card_id, amount, type, description) VALUES ($1, $2, $3, 'fare', 'Trip fare deduction')",
      [trip.user_id, trip.card_id, -fare]
    );

    // Voucher logic: reward frequent short-distance riders
    if ((distance_km || 3) <= 3) {
      const recentTrips = await client.query(
        `SELECT COUNT(*) FROM trips WHERE user_id=$1 AND distance_km <= 3 AND status='completed' AND end_time > NOW() - INTERVAL '7 days'`,
        [trip.user_id]
      );
      if (parseInt(recentTrips.rows[0].count) % 5 === 0) {
        await client.query(
          "INSERT INTO vouchers (user_id, type, expires_at) VALUES ($1, 'next_ride_free', NOW() + INTERVAL '30 days')",
          [trip.user_id]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ message: 'Tap-out successful', fare, new_balance: newBalance });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

// GET global stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const revenue = await pool.query(
      "SELECT COALESCE(SUM(ABS(amount)), 0) as daily_revenue FROM transactions WHERE type='fare' AND created_at > NOW() - INTERVAL '24 hours'"
    );
    const passengers = await pool.query(
      "SELECT COUNT(*) as total FROM trips WHERE start_time > NOW() - INTERVAL '24 hours'"
    );
    const activeTrips = await pool.query(
      "SELECT COUNT(*) as active FROM trips WHERE status='active'"
    );
    const totalUsers = await pool.query('SELECT COUNT(*) as total FROM users');

    // Mock peak hours data for chart
    const peakHours = Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, '0')}:00`,
      passengers: Math.floor(Math.random() * 400) + (i >= 7 && i <= 9 ? 800 : i >= 17 && i <= 19 ? 700 : 50),
    }));

    res.json({
      daily_revenue: parseFloat(revenue.rows[0].daily_revenue),
      daily_passengers: parseInt(passengers.rows[0].total),
      active_trips: parseInt(activeTrips.rows[0].active),
      total_users: parseInt(totalUsers.rows[0].total),
      peak_hours: peakHours,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET routes by operator
router.get('/routes', async (req, res) => {
  try {
    const { operator } = req.query;
    let query = `SELECT r.*, o.name as operator_name FROM routes r JOIN operators o ON r.operator_id = o.id`;
    const params = [];
    if (operator) {
      query += ` WHERE o.name ILIKE $1`;
      params.push(`%${operator}%`);
    }
    query += ' ORDER BY o.name, r.route_number';
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET operators
router.get('/operators', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM operators ORDER BY name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET trips (recent)
router.get('/trips', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.*, u.full_name, u.tier, r.route_number, o.name as operator_name
       FROM trips t
       JOIN users u ON t.user_id = u.id
       LEFT JOIN routes r ON t.route_id = r.id
       LEFT JOIN operators o ON r.operator_id = o.id
       ORDER BY t.created_at DESC LIMIT 50`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET metro lines and stations
router.get('/metro/lines', async (req, res) => {
  try {
    const query = `
      SELECT 
        r.id as route_id, 
        r.route_number, 
        r.path_coordinates->>'name' as line_name,
        r.path_coordinates->>'color' as line_color,
        s.id as stop_id,
        s.name as stop_name,
        rs.stop_order
      FROM routes r
      JOIN route_stops rs ON r.id = rs.route_id
      JOIN stops s ON rs.stop_id = s.id
      WHERE r.route_type = 'metro'
      ORDER BY r.id, rs.stop_order
    `;
    const { rows } = await pool.query(query);
    
    // Group by line
    const lines = rows.reduce((acc, row) => {
      let line = acc.find(l => l.id === row.route_id);
      if (!line) {
        line = {
          id: row.route_id,
          number: row.route_number,
          name: row.line_name,
          color: row.line_color,
          stations: []
        };
        acc.push(line);
      }
      line.stations.push({
        id: row.stop_id,
        name: row.stop_name,
        order: row.stop_order
      });
      return acc;
    }, []);

    res.json(lines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET metro stops
router.get('/stops/metro', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM stops WHERE is_metro = TRUE ORDER BY name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET transactions for user
router.get('/users/:id/transactions', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── LOGS ─────────────────────────────────────────────────────────────────────
router.get('/logs', async (req, res) => {
  try {
    const { level, search } = req.query;
    let query = 'SELECT * FROM system_logs';
    const params = [];
    let conditions = [];

    if (level && level !== 'Hamısı') {
      params.push(level);
      conditions.push(`level = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(message ILIKE $${params.length} OR category ILIKE $${params.length} OR source ILIKE $${params.length})`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY created_at DESC LIMIT 100';

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── NODES ────────────────────────────────────────────────────────────────────
router.get('/nodes', async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM nodes';
    const params = [];
    if (search) {
      params.push(`%${search}%`);
      query += ` WHERE id ILIKE $1 OR name ILIKE $1 OR ip_address ILIKE $1`;
    }
    query += ' ORDER BY id';
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/nodes', async (req, res) => {
  try {
    const { id, name, type, ip_address } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO nodes (id, name, type, ip_address) VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, name, type, ip_address]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── FLEET ────────────────────────────────────────────────────────────────────
router.get('/fleet', async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM fleet_units';
    const params = [];
    if (search) {
      params.push(`%${search}%`);
      query += ` WHERE id ILIKE $1 OR route_number ILIKE $1`;
    }
    query += ' ORDER BY id';
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/fleet', async (req, res) => {
  try {
    const { id, route_number, current_location } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO fleet_units (id, route_number, current_location) VALUES ($1, $2, $3) RETURNING *`,
      [id, route_number, current_location]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
router.get('/settings', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM system_settings');
    const settingsObj = {};
    rows.forEach(r => {
      settingsObj[r.key] = r.value;
    });
    res.json(settingsObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const settings = req.body; // Expecting { key1: value1, key2: value2 }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const [key, value] of Object.entries(settings)) {
        await client.query(
          `INSERT INTO system_settings ("key", "value") VALUES ($1, $2) ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", updated_at = NOW()`,
          [key, JSON.stringify(value)]
        );
      }
      await client.query('COMMIT');
      res.json({ message: 'Settings updated successfully' });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('PUT /settings Error:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
