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

async function fill() {
  try {
    console.log('Connecting to DB to fill Overview data...');

    // 1. Add System Logs
    console.log('Adding System Logs...');
    const logs = [
      ['INFO', 'Fleet', 'BUS-101 bloku Nizami küç. sektoruna çatdı', 'GPS-ALPHA'],
      ['WARN', 'Sensor', 'Giriş #4-də yaxınlıq sensoru sapması aşkar edildi', 'NODE-02'],
      ['ERROR', 'Auth', 'SIM keçidində imza xətası: BK-9904', 'AUTH-RELAY'],
      ['SUCCESS', 'Payment', '1,400 blok üçün ödəniş dövrü başa çatdı', 'FIN-NODE'],
      ['INFO', 'System', 'Kənari qovşaqlara nüvə yeniləməsi göndərildi', 'MASTER-RELAY'],
      ['INFO', 'Fleet', 'METRO-02 bloku sürət tənzimlənməsi: 60km/saat', 'TRAFFIC-CTRL'],
      ['WARN', 'Network', 'NODE-05 bağlantısı zəifləyir (Latency: 450ms)', 'SYS-MONITOR'],
      ['SUCCESS', 'Database', 'Gecəlik ehtiyat nüsxə yaradıldı', 'DB-SYNC'],
      ['INFO', 'Security', 'Yeni administrator girişi qeydə alındı', 'AUTH-SEC'],
      ['ERROR', 'Fleet', 'BUS-204 mühərrik temperaturu kritik: 105°C', 'OBD-II']
    ];
    for (const l of logs) {
      await pool.query(`INSERT INTO system_logs (level, category, message, source) VALUES ($1, $2, $3, $4)`, l);
    }

    // 2. Add Nodes
    console.log('Adding Nodes...');
    const nodes = [
      ['NODE-01', 'Mərkəzi Rele', 'onlayn', '142g 4s', 12, 'Əsas', '192.168.1.1'],
      ['NODE-02', 'Nizami Sektor', 'onlayn', '45g 12s', 45, 'Kənari', '192.168.4.12'],
      ['NODE-03', 'Xətai Məlumat', 'onlayn', '12g 1s', 2, 'Ehtiyat', '10.0.0.5'],
      ['NODE-04', 'Yasamal Qovşağı', 'onlayn', '89g 5s', 33, 'Kənari', '192.168.5.101'],
      ['NODE-05', 'Sabunçu Rele', 'gözləmədə', '5g 22s', 5, 'Kənari', '192.168.8.20'],
      ['NODE-06', 'Binəqədi Sektoru', 'onlayn', '210g 2s', 68, 'Əsas', '192.168.2.55']
    ];
    for (const n of nodes) {
      await pool.query(`INSERT INTO nodes (id, name, status, uptime, load_percent, type, ip_address) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`, n);
    }

    // 3. Add Fleet Units
    console.log('Adding Fleet Units...');
    const units = [
      ['BUS-101', '1', 'In Transit', 65, 'Nizami küç.', 'Optimal'],
      ['BUS-102', '5', 'Maintenance', 0, 'Depo A', 'Warning'],
      ['BUS-103', '88', 'In Transit', 40, 'Xətai', 'Optimal'],
      ['BUS-204', '11', 'Delayed', 85, '20 Yanvar', 'Critical'],
      ['BUS-305', '7', 'In Transit', 22, 'Gənclik', 'Optimal'],
      ['BUS-108', '125', 'In Transit', 95, '28 May', 'Optimal'],
      ['BUS-402', '37', 'In Transit', 50, 'Koroğlu', 'Warning']
    ];
    for (const u of units) {
      await pool.query(`INSERT INTO fleet_units (id, route_number, status, load_percent, current_location, health_status) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`, u);
    }

    // 4. Add some transactions for Stats (Revenue/Passengers)
    console.log('Adding Transaction Stats...');
    const userRes = await pool.query('SELECT id FROM users LIMIT 1');
    if (userRes.rows.length > 0) {
      const uId = userRes.rows[0].id;
      const cardRes = await pool.query('SELECT id FROM cards WHERE user_id = $1 LIMIT 1', [uId]);
      const cardId = cardRes.rows[0]?.id || 1;
      
      for (let i = 0; i < 20; i++) {
        await pool.query(`INSERT INTO transactions (user_id, amount, type) VALUES ($1, $2, 'fare')`, [uId, -0.40]);
        await pool.query(`INSERT INTO trips (user_id, card_id, status, fare) VALUES ($1, $2, 'completed', 0.40)`, [uId, cardId]);
      }
    }

    console.log('Overview data filled successfully! No structure changes made.');
  } catch (error) {
    console.error('Error filling overview data:', error);
  } finally {
    pool.end();
  }
}

fill();
