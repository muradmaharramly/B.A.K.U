require('dotenv').config();
const pool = require('./db/pool');

(async () => {
  try {
    console.log('Connecting...');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        'INSERT INTO system_settings ("key", "value") VALUES ($1, $2) ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", updated_at = NOW()',
        ['test_key', JSON.stringify({a:1})]
      );
      await client.query('COMMIT');
      console.log('Success!');
    } catch (e) {
      console.error('Query Error:', e.message);
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Connection Error:', err.message);
  } finally {
    pool.end();
  }
})();
