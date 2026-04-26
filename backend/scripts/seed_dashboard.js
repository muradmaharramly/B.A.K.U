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
  { name: 'BakuBus', buses: ["1", "2", "3", "5", "6", "8", "9", "13", "14", "17", "18", "21", "22", "28", "30", "32", "35", "38", "49", "52", "53", "61", "65", "79", "88", "125", "135"] },
  { name: 'Çinar Trans', buses: ["7", "10", "24", "36", "41", "46", "54", "60", "81", "85", "12", "15", "20", "27", "39", "44", "55", "70", "77"] },
  { name: 'Xaliq Faiqoğlu', buses: ["11", "16", "19", "26", "37", "50", "62", "67", "90", "96"] }
];

const busStopsMock = ["28 May", "Sahil", "Azneft", "Bayıl", "Koroğlu", "Nərimanov", "Gənclik", "Elmlər Akademiyası", "Nizami", "20 Yanvar", "İnşaatçılar", "Əhmədli", "Xalqlar Dostluğu", "Neftçilər", "Qara Qarayev", "Ulduz", "Bakmil", "Həzi Aslanov"];

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
  { level: 'INFO', category: 'System', message: 'Kənari qovşaqlara nüvə yeniləməsi göndərildi', source: 'MASTER-RELAY' },
  { level: 'INFO', category: 'Fleet', message: 'METRO-02 bloku sürət tənzimlənməsi: 60km/saat', source: 'TRAFFIC-CTRL' },
  { level: 'WARN', category: 'Network', message: 'NODE-05 bağlantısı zəifləyir (Latency: 450ms)', source: 'SYS-MONITOR' },
  { level: 'SUCCESS', category: 'Database', message: 'Gecəlik ehtiyat nüsxə yaradıldı', source: 'DB-SYNC' },
  { level: 'INFO', category: 'Security', message: 'Yeni administrator girişi qeydə alındı', source: 'AUTH-SEC' },
  { level: 'ERROR', category: 'Fleet', message: 'BUS-204 mühərrik temperaturu kritik: 105°C', source: 'OBD-II' }
];

const nodes = [
  { id: 'NODE-01', name: 'Mərkəzi Rele', status: 'onlayn', uptime: '142g 4s', load_percent: 12, type: 'Əsas', ip_address: '192.168.1.1' },
  { id: 'NODE-02', name: 'Nizami Sektor', status: 'onlayn', uptime: '45g 12s', load_percent: 45, type: 'Kənari', ip_address: '192.168.4.12' },
  { id: 'NODE-03', name: 'Xətai Məlumat', status: 'onlayn', uptime: '12g 1s', load_percent: 2, type: 'Ehtiyat', ip_address: '10.0.0.5' },
  { id: 'NODE-04', name: 'Yasamal Qovşağı', status: 'onlayn', uptime: '89g 5s', load_percent: 33, type: 'Kənari', ip_address: '192.168.5.101' },
  { id: 'NODE-05', name: 'Sabunçu Rele', status: 'gözləmədə', uptime: '5g 22s', load_percent: 5, type: 'Kənari', ip_address: '192.168.8.20' },
  { id: 'NODE-06', name: 'Binəqədi Sektoru', status: 'onlayn', uptime: '210g 2s', load_percent: 68, type: 'Əsas', ip_address: '192.168.2.55' }
];

const fleet = [
  { id: 'BUS-101', route_number: '1', status: 'In Transit', load_percent: 65, current_location: 'Nizami küç.', health_status: 'Optimal' },
  { id: 'BUS-102', route_number: '5', status: 'Maintenance', load_percent: 0, current_location: 'Depo A', health_status: 'Warning' },
  { id: 'BUS-103', route_number: '88', status: 'In Transit', load_percent: 40, current_location: 'Xətai', health_status: 'Optimal' },
  { id: 'BUS-204', route_number: '11', status: 'Delayed', load_percent: 85, current_location: '20 Yanvar', health_status: 'Critical' },
  { id: 'BUS-305', route_number: '7', status: 'In Transit', load_percent: 22, current_location: 'Gənclik', health_status: 'Optimal' },
  { id: 'BUS-108', route_number: '125', status: 'In Transit', load_percent: 95, current_location: '28 May', health_status: 'Optimal' },
  { id: 'BUS-402', route_number: '37', status: 'In Transit', load_percent: 50, current_location: 'Koroğlu', health_status: 'Warning' }
];

async function seed() {
  try {
    console.log('Connecting to DB and cleaning old tables...');
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

    console.log('Creating tables...');
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

    console.log('Seeding Operators, Stops & Bus Routes...');
    for (const stopName of busStopsMock) {
      await pool.query(`INSERT INTO stops (name, is_metro) VALUES ($1, FALSE) ON CONFLICT (name) DO NOTHING`, [stopName]);
    }

    for (const op of operatorsData) {
      const opRes = await pool.query(`INSERT INTO operators (name, type) VALUES ($1, 'bus') RETURNING id`, [op.name]);
      const opId = opRes.rows[0].id;
      
      for (const busNum of op.buses) {
        const routeRes = await pool.query(`INSERT INTO routes (operator_id, route_number, route_type) VALUES ($1, $2, 'bus') RETURNING id`, [opId, busNum]);
        const routeId = routeRes.rows[0].id;
        
        // Quick assign 4 stops to each bus for calculator
        const stops = [...busStopsMock].sort(() => 0.5 - Math.random()).slice(0, 4);
        for (let i = 0; i < stops.length; i++) {
          const sRes = await pool.query(`SELECT id FROM stops WHERE name = $1`, [stops[i]]);
          await pool.query(`INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES ($1, $2, $3)`, [routeId, sRes.rows[0].id, i]);
        }
      }
    }

    console.log('Seeding Metro network...');
    const metroOpRes = await pool.query(`INSERT INTO operators (name, type) VALUES ('Bakı Metropoliteni', 'metro') RETURNING id`);
    const metroOpId = metroOpRes.rows[0].id;
    for (const m of metroRoutes) {
      const rRes = await pool.query(`INSERT INTO routes (operator_id, route_number, route_type, path_coordinates) VALUES ($1, $2, 'metro', $3) RETURNING id`, 
        [metroOpId, m.name, JSON.stringify({ color: m.name.includes('Qırmızı') ? '#ef4444' : m.name.includes('Yaşıl') ? '#10b981' : '#8b5cf6' })]);
      const rId = rRes.rows[0].id;
      for (let i = 0; i < m.stops.length; i++) {
        const sRes = await pool.query(`INSERT INTO stops (name, is_metro) VALUES ($1, TRUE) ON CONFLICT (name) DO UPDATE SET is_metro = TRUE RETURNING id`, [m.stops[i]]);
        await pool.query(`INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`, [rId, sRes.rows[0].id, i]);
      }
    }

    console.log('Filling Dashboard data (Nodes, Fleet, Logs, Users)...');
    for (const node of nodes) {
      await pool.query(`INSERT INTO nodes (id, name, status, uptime, load_percent, type, ip_address) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [node.id, node.name, node.status, node.uptime, node.load_percent, node.type, node.ip_address]);
    }
    for (const unit of fleet) {
      await pool.query(`INSERT INTO fleet_units (id, route_number, status, load_percent, current_location, health_status) VALUES ($1, $2, $3, $4, $5, $6)`, [unit.id, unit.route_number, unit.status, unit.load_percent, unit.current_location, unit.health_status]);
    }
    for (const log of logs) {
      await pool.query(`INSERT INTO system_logs (level, category, message, source) VALUES ($1, $2, $3, $4)`, [log.level, log.category, log.message, log.source]);
    }

    const uRes = await pool.query(`INSERT INTO users (full_name, email, balance) VALUES ('Əli Vəliyev', 'ali@baku.az', 25.50), ('Leyla Məmmədova', 'leyla@baku.az', 10.00), ('Kamran Əliyev', 'kamran@baku.az', 5.20) RETURNING id`);
    const cId = await pool.query(`INSERT INTO cards (user_id, card_number) VALUES ($1, '9904001234567890'), ($2, '9904001234567891')`, [uRes.rows[0].id, uRes.rows[1].id]);

    console.log('Seed completed! B.A.K.U Dashboard is now fully populated.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    pool.end();
  }
}
seed();
