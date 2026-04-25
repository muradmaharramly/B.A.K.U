require('dotenv').config();
const pool = require('../db/pool');

const busData = {
  'Baku Bus': ['1', '2', '3', '5', '6', '8', '9', '13', '14', '17', '18', '21', '22', '28', '30', '32', '35', '38', '49', '52', '53', '61', '65', '79', '88', '125', '135'],
  'Xaliq Faiqoğlu': ['11', '16', '19', '26', '37', '50', '62', '67', '90', '96'],
  'Çinar Trans': ['7', '10', '24', '36', '41', '46', '54', '60', '81', '85', '12', '15', '20', '27', '39', '44', '55', '70', '77']
};

async function seedBuses() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Clear existing bus routes to prevent duplicates during testing
    // await client.query("DELETE FROM routes WHERE route_type = 'bus'");

    for (const [operatorName, routes] of Object.entries(busData)) {
      // 2. Get or Create Operator
      let opRes = await client.query("SELECT id FROM operators WHERE name = $1", [operatorName]);
      let operatorId;
      if (opRes.rows.length === 0) {
        opRes = await client.query("INSERT INTO operators (name) VALUES ($1) RETURNING id", [operatorName]);
        operatorId = opRes.rows[0].id;
      } else {
        operatorId = opRes.rows[0].id;
      }

      console.log(`Processing Operator: ${operatorName} (ID: ${operatorId})`);

      // 3. Insert Routes
      for (const routeNum of routes) {
        await client.query(
          "INSERT INTO routes (operator_id, route_number, route_type) VALUES ($1, $2, 'bus') ON CONFLICT DO NOTHING",
          [operatorId, routeNum]
        );
      }
    }

    await client.query('COMMIT');
    console.log('✅ Bus routes seeded successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding bus data:', err);
  } finally {
    client.release();
    process.exit();
  }
}

seedBuses();
