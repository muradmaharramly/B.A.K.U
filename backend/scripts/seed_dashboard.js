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
  { id: 'NODE-03', name: 'Xətai Məlumat Qovşağı', status: 'gözləmədə', uptime: '12g 1s', load_percent: 2, type: 'Ehtiyat', ip_address: '10.0.0.5' },
  { id: 'NODE-04', name: 'Sumqayıt Bağlantısı', status: 'onlayn', uptime: '88g 19s', load_percent: 68, type: 'Kənari', ip_address: '172.16.0.44' },
  { id: 'NODE-05', name: 'Gəncə Giriş Qapısı', status: 'oflayn', uptime: '0g 0s', load_percent: 0, type: 'Kənari', ip_address: '192.168.10.1' }
];

const fleet = [
  { id: 'BUS-101', route_number: 'R78', status: 'In Transit', load_percent: 65, current_location: 'Nizami küç.', health_status: 'Optimal' },
  { id: 'BUS-102', route_number: 'R140', status: 'Maintenance', load_percent: 0, current_location: 'Depo A', health_status: 'Warning' },
  { id: 'BUS-103', route_number: 'M2', status: 'In Transit', load_percent: 40, current_location: 'Xətai', health_status: 'Optimal' },
  { id: 'BUS-104', route_number: 'R78', status: 'Delayed', load_percent: 85, current_location: 'Azneft meyd.', health_status: 'Critical' },
  { id: 'BUS-105', route_number: 'R140', status: 'In Transit', load_percent: 20, current_location: '8km', health_status: 'Optimal' }
];

const defaultSettings = [
  { key: 'currency', value: JSON.stringify({ code: 'azn', symbol: '₼', label: 'Azərbaycan Manatı' }) },
  { key: 'language', value: JSON.stringify({ code: 'az', label: 'Azərbaycan dili' }) },
  { key: 'logRetention', value: JSON.stringify({ days: 90 }) }
];

async function seed() {
  try {
    console.log('Connecting to DB...');
    
    // Create tables if they don't exist
    await pool.query(`
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
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS system_settings (
          key VARCHAR(50) PRIMARY KEY,
          value JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    console.log('Tables created. Seeding logs...');
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

    console.log('Seeding settings...');
    for (const s of defaultSettings) {
      await pool.query(`INSERT INTO system_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`, 
        [s.key, s.value]);
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    pool.end();
  }
}

seed();
