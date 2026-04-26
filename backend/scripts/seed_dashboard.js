import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const logs = [
  { level: 'INFO', category: 'Fleet', message: 'BUS-101 bloku Nizami küç. sektoruna çatdı', source: 'GPS-ALPHA' },
  { level: 'WARN', category: 'Sensor', message: 'Giriş #4-də yaxınlıq sensoru sapması aşkar edildi', source: 'NODE-02' },
  { level: 'ERROR', category: 'Auth', message: 'SIM keçidində imza xətası: BK-9904', source: 'AUTH-RELAY' },
  { level: 'SUCCESS', category: 'Payment', message: '1,400 blok üçün ödəniş dövrü başa çatdı', source: 'FIN-NODE' },
  { level: 'INFO', category: 'System', message: 'Kənari qovşaqlara nüvə yeniləməsi göndərildi', source: 'MASTER-RELAY' },
  { level: 'INFO', category: 'Fleet', message: 'METRO-02 bloku sürət tənzimlənməsi: 60km/saat', source: 'TRAFFIC-CTRL' }
];

const nodes = [
  { id: 'NODE-01', name: 'Bakı Mərkəzi Rele', status: 'onlayn', uptime: '142g 4s', load_percent: 12, type: 'Əsas', ip_address: '192.168.1.1' },
  { id: 'NODE-02', name: 'Nizami Sektor Qovşağı', status: 'onlayn', uptime: '45g 12s', load_percent: 45, type: 'Kənari', ip_address: '192.168.4.12' },
  { id: 'NODE-03', name: 'Xətai Məlumat Qovşağı', status: 'gözləmədə', uptime: '12g 1s', load_percent: 2, type: 'Ehtiyat', ip_address: '10.0.0.5' }
];

const fleet = [
  { id: 'BUS-101', route_number: '#140E', status: 'In Transit', load_percent: 65, current_location: 'Nizami küç.', health_status: 'Optimal' },
  { id: 'BUS-102', route_number: '#5', status: 'Maintenance', load_percent: 0, current_location: 'Depo A', health_status: 'Warning' },
  { id: 'BUS-103', route_number: '#88', status: 'In Transit', load_percent: 40, current_location: 'Xətai', health_status: 'Optimal' }
];

async function seed() {
  try {
    console.log('Connecting to DB...');
    
    // Create ALL core tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          full_name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          tier VARCHAR(20) DEFAULT 'citizen',
          social_category VARCHAR(20) DEFAULT 'standard',
          balance DECIMAL(10,2) DEFAULT 0.00,
          negative_limit DECIMAL(10,2) DEFAULT -2.00,
          created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS cards (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          card_number VARCHAR(20) UNIQUE NOT NULL,
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS trips (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          card_id INTEGER REFERENCES cards(id),
          route_id INTEGER,
          status VARCHAR(20) DEFAULT 'active',
          distance_km DECIMAL(5,2),
          fare DECIMAL(5,2),
          start_time TIMESTAMPTZ DEFAULT NOW(),
          end_time TIMESTAMPTZ
      );
      CREATE TABLE IF NOT EXISTS transactions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          card_id INTEGER REFERENCES cards(id),
          amount DECIMAL(10,2) NOT NULL,
          type VARCHAR(20) NOT NULL,
          description TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS system_logs (
          id SERIAL PRIMARY KEY,
          level VARCHAR(20) NOT NULL,
          category VARCHAR(50) NOT NULL,
          message TEXT NOT NULL,
          source VARCHAR(50),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS nodes (
          id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'onlayn',
          uptime VARCHAR(50),
          load_percent INTEGER DEFAULT 0,
          type VARCHAR(50) NOT NULL,
          ip_address VARCHAR(45),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS fleet_units (
          id VARCHAR(50) PRIMARY KEY,
          route_number VARCHAR(20) NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'In Transit',
          load_percent INTEGER DEFAULT 0,
          current_location VARCHAR(255),
          health_status VARCHAR(20) NOT NULL DEFAULT 'Optimal',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    console.log('Tables ready. Seeding Users & Cards...');
    const userRes = await pool.query(`
      INSERT INTO users (full_name, email, balance, social_category) 
      VALUES ('Əli Vəliyev', 'ali@baku.az', 15.50, 'standard') 
      ON CONFLICT (email) DO UPDATE SET balance = EXCLUDED.balance 
      RETURNING id
    `);
    const userId = userRes.rows[0].id;

    const cardRes = await pool.query(`
      INSERT INTO cards (user_id, card_number) 
      VALUES ($1, '9904001234567890') 
      ON CONFLICT (card_number) DO NOTHING 
      RETURNING id
    `, [userId]);
    const cardId = cardRes.rows[0]?.id || 1;

    console.log('Seeding Transactions & Stats...');
    await pool.query(`
      INSERT INTO transactions (user_id, card_id, amount, type, description) VALUES 
      ($1, $2, -0.40, 'fare', 'Trip #140E'),
      ($1, $2, -0.60, 'fare', 'Trip #5'),
      ($1, $2, -0.40, 'fare', 'Metro Trip')
    `, [userId, cardId]);

    await pool.query(`
      INSERT INTO trips (user_id, card_id, status, distance_km, fare) VALUES 
      ($1, $2, 'completed', 3.5, 0.40),
      ($1, $2, 'active', 1.2, 0.00)
    `, [userId, cardId]);

    console.log('Seeding logs...');
    for (const log of logs) {
      await pool.query(`INSERT INTO system_logs (level, category, message, source) VALUES ($1, $2, $3, $4)`, 
        [log.level, log.category, log.message, log.source]);
    }

    console.log('Seeding nodes...');
    for (const node of nodes) {
      await pool.query(`INSERT INTO nodes (id, name, status, uptime, load_percent, type, ip_address) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`, 
        [node.id, node.name, node.status, node.uptime, node.load_percent, node.type, node.ip_address]);
    }

    console.log('Seeding fleet units...');
    for (const unit of fleet) {
      await pool.query(`INSERT INTO fleet_units (id, route_number, status, load_percent, current_location, health_status) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`, 
        [unit.id, unit.route_number, unit.status, unit.load_percent, unit.current_location, unit.health_status]);
    }

    console.log('Seed completed successfully! Dashboard data is now live.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    pool.end();
  }
}

seed();
