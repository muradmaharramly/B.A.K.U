require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../db/pool');

async function initDb() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is missing in .env');
    return;
  }

  const schemaPath = path.join(__dirname, '../db/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  try {
    console.log('⏳ Initializing Database...');
    await pool.query(schema);
    console.log('✅ Database Schema Implemented Successfully.');
    
    // Create admin if not exists
    const hash = '$2b$10$auTyixOhItVpY5RpeknBfusWJpX3Ooe9xbpDrPI0V8UA36z2CEv02'; // admin123
    await pool.query('INSERT INTO admins (username, password_hash, full_name) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING', ['admin', hash, 'System Administrator']);
    console.log('✅ Default Admin Verified.');
    
  } catch (err) {
    console.error('❌ Initialization Error:', err.message);
  } finally {
    process.exit();
  }
}

initDb();
