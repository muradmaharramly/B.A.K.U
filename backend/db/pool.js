const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('❌ CRITICAL: DATABASE_URL is not defined in .env file');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
