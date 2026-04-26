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

const operatorsData = [
  { 
    name: 'BakuBus', 
    buses: ["1", "2", "3", "5", "6", "8", "9", "13", "14", "17", "18", "21", "22", "28", "30", "32", "35", "38", "49", "52", "53", "61", "65", "79", "88", "125", "135"] 
  },
  { 
    name: 'Çinar Trans', 
    buses: ["7", "10", "24", "36", "41", "46", "54", "60", "81", "85", "12", "15", "20", "27", "39", "44", "55", "70", "77"] 
  },
  { 
    name: 'Xaliq Faiqoğlu', 
    buses: ["11", "16", "19", "26", "37", "50", "62", "67", "90", "96"] 
  }
];

const busStopsMock = ["28 May", "Sahil", "Azneft", "Bayıl", "Koroğlu", "Nərimanov", "Gənclik", "Elmlər Akademiyası", "Nizami", "20 Yanvar"];

const metroRoutes = [
  { "name": "Qırmızı Xətt", "stops": ["İçərişəhər", "Sahil", "28 May", "Gənclik", "Nəriman Nərimanov", "Bakmil", "Ulduz", "Koroğlu", "Qara Qarayev", "Neftçilər", "Xalqlar Dostluğu", "Əhmədli", "Həzi Aslanov"] },
  { "name": "Yaşıl Xətt", "stops": ["Xətai", "28 May", "Nizami", "Elmlər Akademiyası", "İnşaatçılar", "20 Yanvar", "Memar Əcəmi", "Nəsimi", "Azadlıq prospekti", "Dərnəgül"] },
  { "name": "Bənövşəyi Xətt", "stops": ["Xocəsən", "Avtovağzal", "Memar Əcəmi", "8 Noyabr"] }
];

const logs = [
  { level: 'INFO', category: 'Fleet', message: 'BUS-101 bloku Nizami küç. sektoruna çatdı', source: 'GPS-ALPHA' },
  { level: 'WARN', category: 'Sensor', message: 'Giriş #4-də yaxınlıq sensoru sapması aşkar edildi', source: 'NODE-02' },
  { level: 'ERROR', category: 'Auth', message: 'SIM keçidində imza xətası: BK-9904', source: 'AUTH-RELAY' },
  { level: 'SUCCESS', category: 'Payment', message: '1,400 blok üçün ödəniş dövrü başa çatdı', source: 'FIN-NODE' },
  { level: 'INFO', category: 'System', message: 'Kənari qovşaqlara nüvə yeniləməsi göndərildi', source: 'MASTER-RELAY' }
];

async function seed() {
  try {
    console.log('Connecting to DB...');
    
    await pool.query(`
      DROP TABLE IF EXISTS route_stops CASCADE;
      DROP TABLE IF EXISTS trips CASCADE;
      DROP TABLE IF EXISTS transactions CASCADE;
      DROP TABLE IF EXISTS routes CASCADE;
      DROP TABLE IF EXISTS stops CASCADE;
      DROP TABLE IF EXISTS operators CASCADE;
      DROP TABLE IF EXISTS cards CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS system_logs CASCADE;
      DROP TABLE IF EXISTS nodes CASCADE;
      DROP TABLE IF EXISTS fleet_units CASCADE;
    `);

    await pool.query(`
      CREATE TABLE operators (id SERIAL PRIMARY KEY, name VARCHAR(100) UNIQUE NOT NULL, type VARCHAR(20) DEFAULT 'bus');
      CREATE TABLE routes (id SERIAL PRIMARY KEY, operator_id INTEGER REFERENCES operators(id), route_number VARCHAR(20) UNIQUE NOT NULL, route_type VARCHAR(20) NOT NULL, path_coordinates JSONB);
      CREATE TABLE stops (id SERIAL PRIMARY KEY, name VARCHAR(100) UNIQUE NOT NULL, is_metro BOOLEAN DEFAULT FALSE);
      CREATE TABLE route_stops (route_id INTEGER REFERENCES routes(id), stop_id INTEGER REFERENCES stops(id), stop_order INTEGER, PRIMARY KEY (route_id, stop_id));
      CREATE TABLE users (id SERIAL PRIMARY KEY, full_name VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, balance DECIMAL(10,2) DEFAULT 0.00);
      CREATE TABLE cards (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), card_number VARCHAR(20) UNIQUE NOT NULL);
      CREATE TABLE trips (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), card_id INTEGER REFERENCES cards(id), route_id INTEGER REFERENCES routes(id), status VARCHAR(20) DEFAULT 'completed', distance_km DECIMAL(5,2), fare DECIMAL(5,2), created_at TIMESTAMPTZ DEFAULT NOW());
      CREATE TABLE transactions (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), amount DECIMAL(10,2) NOT NULL, type VARCHAR(20), created_at TIMESTAMPTZ DEFAULT NOW());
      CREATE TABLE system_logs (id SERIAL PRIMARY KEY, level VARCHAR(20), category VARCHAR(50), message TEXT, source VARCHAR(50), created_at TIMESTAMPTZ DEFAULT NOW());
      CREATE TABLE nodes (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), status VARCHAR(20), uptime VARCHAR(50), load_percent INTEGER, type VARCHAR(50), ip_address VARCHAR(45));
      CREATE TABLE fleet_units (id VARCHAR(50) PRIMARY KEY, route_number VARCHAR(20), status VARCHAR(50), load_percent INTEGER, current_location VARCHAR(255), health_status VARCHAR(20));
    `);

    console.log('Seeding Operators & Bus Routes...');
    for (const op of operatorsData) {
      const opRes = await pool.query(`INSERT INTO operators (name, type) VALUES ($1, 'bus') RETURNING id`, [op.name]);
      const opId = opRes.rows[0].id;
      
      for (const busNum of op.buses) {
        await pool.query(`INSERT INTO routes (operator_id, route_number, route_type) VALUES ($1, $2, 'bus')`, [opId, busNum]);
      }
    }

    console.log('Seeding Metro...');
    const metroOpRes = await pool.query(`INSERT INTO operators (name, type) VALUES ('Bakı Metropoliteni', 'metro') RETURNING id`);
    const metroOpId = metroOpRes.rows[0].id;

    for (const m of metroRoutes) {
      const routeRes = await pool.query(`INSERT INTO routes (operator_id, route_number, route_type, path_coordinates) VALUES ($1, $2, 'metro', $3) RETURNING id`, 
        [metroOpId, m.name, JSON.stringify({ color: m.name.includes('Qırmızı') ? '#ef4444' : m.name.includes('Yaşıl') ? '#10b981' : '#8b5cf6' })]);
      
      const rId = routeRes.rows[0].id;
      for (let i = 0; i < m.stops.length; i++) {
        const stopRes = await pool.query(`INSERT INTO stops (name, is_metro) VALUES ($1, TRUE) ON CONFLICT (name) DO UPDATE SET is_metro = TRUE RETURNING id`, [m.stops[i]]);
        await pool.query(`INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`, [rId, stopRes.rows[0].id, i]);
      }
    }

    console.log('Seeding Mock Data...');
    const uRes = await pool.query(`INSERT INTO users (full_name, email, balance) VALUES ('Əli Vəliyev', 'ali@baku.az', 20.00) RETURNING id`);
    const uId = uRes.rows[0].id;
    const cRes = await pool.query(`INSERT INTO cards (user_id, card_number) VALUES ($1, '9904001234567890') RETURNING id`, [uId]);
    
    await pool.query(`INSERT INTO system_logs (level, category, message, source) VALUES ($1, $2, $3, $4)`, ['INFO', 'System', 'Baza yeniləndi', 'Master']);
    await pool.query(`INSERT INTO nodes (id, name, status, uptime, load_percent, type, ip_address) VALUES ('NODE-01', 'Mərkəzi Rele', 'onlayn', '12g', 15, 'Əsas', '192.168.1.1')`);
    await pool.query(`INSERT INTO fleet_units (id, route_number, status, load_percent, current_location, health_status) VALUES ('BUS-101', '1', 'In Transit', 60, '28 May', 'Optimal')`);

    console.log('Seed completed with operators grouping!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    pool.end();
  }
}

seed();
