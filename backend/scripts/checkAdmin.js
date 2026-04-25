require('dotenv').config();
const pool = require('../db/pool');

async function checkAdmin() {
  try {
    console.log('Connecting to database...');
    const res = await pool.query('SELECT * FROM admins WHERE username = $1', ['admin']);
    if (res.rows.length > 0) {
      console.log('✅ Admin user found:', res.rows[0].username);
      console.log('Password Hash in DB:', res.rows[0].password_hash);
    } else {
      console.log('❌ Admin user NOT found in database.');
      console.log('Attempting to create admin user...');
      const hash = '$2b$10$auTyixOhItVpY5RpeknBfusWJpX3Ooe9xbpDrPI0V8UA36z2CEv02'; // admin123
      await pool.query('INSERT INTO admins (username, password_hash, full_name) VALUES ($1, $2, $3)', ['admin', hash, 'System Administrator']);
      console.log('✅ Admin user created successfully.');
    }
  } catch (err) {
    console.error('❌ Database Error:', err.message);
    if (err.message.includes('relation "admins" does not exist')) {
      console.log('💡 Hint: The "admins" table is missing. Run schema.sql or use the initialization script.');
    }
  } finally {
    process.exit();
  }
}

checkAdmin();
