require('dotenv').config();
const pool = require('../db/pool');

const busData = {
  "routes": [
    { "bus": "1", "stops": ["28 May", "Sahil", "Azneft", "Bayraq Meydanı", "20-ci Sahə"] },
    { "bus": "2", "stops": ["Avtovağzal", "Biləcəri", "20 Yanvar", "28 May", "Dərnəgül"] },
    { "bus": "3", "stops": ["Dərnəgül", "Nərimanov", "Gənclik", "Sahil", "Badamdar"] },
    { "bus": "5", "stops": ["Nərimanov", "Gənclik", "28 May", "Sahil", "20-ci Sahə"] },
    { "bus": "6", "stops": ["Əhmədli", "Xalqlar Dostluğu", "Neftçilər", "Qara Qarayev", "Koroğlu"] },
    { "bus": "7A", "stops": ["Azadlıq prospekti", "Gənclik", "28 May", "Sahil", "İçərişəhər"] },
    { "bus": "8", "stops": ["Həzi Aslanov", "Əhmədli", "Xalqlar Dostluğu", "Neftçilər", "Koroğlu"] },
    { "bus": "9", "stops": ["Nərimanov", "Gənclik", "28 May", "Sahil", "Bayıl"] },
    { "bus": "10", "stops": ["Nərimanov", "Gənclik", "Elmlər Akademiyası", "Yasamal", "Yeni Yasamal"] },
    { "bus": "11", "stops": ["28 May", "Nərimanov", "Koroğlu", "Neftçilər", "Həzi Aslanov"] },
    { "bus": "13", "stops": ["Dərnəgül", "Azadlıq prospekti", "Gənclik", "28 May", "Sahil"] },
    { "bus": "14", "stops": ["Xətai", "28 May", "Nizami", "Elmlər Akademiyası", "İnşaatçılar"] },
    { "bus": "15", "stops": ["Neftçilər", "Qara Qarayev", "Koroğlu", "Nərimanov", "Gənclik"] },
    { "bus": "16", "stops": ["Həzi Aslanov", "Əhmədli", "Xalqlar Dostluğu", "Neftçilər", "Koroğlu"] },
    { "bus": "17", "stops": ["Yeni Yasamal", "Elmlər Akademiyası", "Nizami", "28 May", "Nərimanov"] },
    { "bus": "18", "stops": ["Sahil", "İçərişəhər", "Bayıl", "Badamdar", "20-ci Sahə"] },
    { "bus": "19", "stops": ["Nərimanov", "Gənclik", "28 May", "Nizami", "Elmlər Akademiyası"] },
    { "bus": "20", "stops": ["Nizami", "28 May", "Gənclik", "Nərimanov", "Koroğlu"] },
    { "bus": "21", "stops": ["Dərnəgül", "Nərimanov", "Gənclik", "28 May", "Sahil"] },
    { "bus": "22", "stops": ["Xətai", "28 May", "Nizami", "Elmlər Akademiyası", "20 Yanvar"] },
    { "bus": "24", "stops": ["Əhmədli", "Xalqlar Dostluğu", "Neftçilər", "Qara Qarayev", "Koroğlu"] },
    { "bus": "26", "stops": ["Nərimanov", "Gənclik", "28 May", "Sahil", "Bayıl"] },
    { "bus": "28", "stops": ["Dərnəgül", "Azadlıq prospekti", "Gənclik", "28 May", "Sahil"] },
    { "bus": "30", "stops": ["Avtovağzal", "20 Yanvar", "Nizami", "28 May", "Nərimanov"] },
    { "bus": "32", "stops": ["Həzi Aslanov", "Əhmədli", "Xalqlar Dostluğu", "Neftçilər", "Koroğlu"] },
    { "bus": "35", "stops": ["Nərimanov", "Gənclik", "28 May", "Sahil", "İçərişəhər"] },
    { "bus": "36", "stops": ["Elmlər Akademiyası", "İnşaatçılar", "20 Yanvar", "Memar Əcəmi", "Nəsimi"] },
    { "bus": "37", "stops": ["Nərimanov", "Koroğlu", "Qara Qarayev", "Neftçilər", "Xalqlar Dostluğu"] },
    { "bus": "38", "stops": ["Xətai", "28 May", "Gənclik", "Nərimanov", "Koroğlu"] },
    { "bus": "41", "stops": ["Yeni Yasamal", "Elmlər Akademiyası", "Nizami", "28 May", "Gənclik"] },
    { "bus": "44", "stops": ["Neftçilər", "Qara Qarayev", "Koroğlu", "Nərimanov", "Gənclik"] },
    { "bus": "49", "stops": ["Dərnəgül", "Azadlıq prospekti", "Gənclik", "28 May", "Sahil"] },
    { "bus": "50", "stops": ["Nərimanov", "Gənclik", "28 May", "Sahil", "Bayıl"] },
    { "bus": "52", "stops": ["Əhmədli", "Xalqlar Dostluğu", "Neftçilər", "Qara Qarayev", "Koroğlu"] },
    { "bus": "53", "stops": ["Xətai", "28 May", "Nizami", "Elmlər Akademiyası", "İnşaatçılar"] },
    { "bus": "60", "stops": ["Memar Əcəmi", "Nəsimi", "Azadlıq prospekti", "Dərnəgül", "Nərimanov"] },
    { "bus": "61", "stops": ["Nərimanov", "Gənclik", "28 May", "Sahil", "İçərişəhər"] },
    { "bus": "65", "stops": ["Dərnəgül", "Azadlıq prospekti", "Gənclik", "28 May", "Sahil"] },
    { "bus": "67", "stops": ["Həzi Aslanov", "Əhmədli", "Xalqlar Dostluğu", "Neftçilər", "Qara Qarayev"] },
    { "bus": "70", "stops": ["Nizami", "28 May", "Gənclik", "Nərimanov", "Koroğlu"] },
    { "bus": "79", "stops": ["Dərnəgül", "Nərimanov", "Gənclik", "28 May", "Sahil"] },
    { "bus": "81", "stops": ["Elmlər Akademiyası", "İnşaatçılar", "20 Yanvar", "Memar Əcəmi", "Nəsimi"] },
    { "bus": "85", "stops": ["Nərimanov", "Gənclik", "28 May", "Sahil", "Bayıl"] },
    { "bus": "88", "stops": ["Dərnəgül", "Azadlıq prospekti", "28 May", "Sahil", "20-ci Sahə"] },
    { "bus": "90", "stops": ["Həzi Aslanov", "Əhmədli", "Xalqlar Dostluğu", "Neftçilər", "Qara Qarayev"] },
    { "bus": "96", "stops": ["Nərimanov", "Koroğlu", "Qara Qarayev", "Neftçilər", "Xalqlar Dostluğu"] },
    { "bus": "125", "stops": ["Binəqədi", "Dərnəgül", "Azadlıq prospekti", "Gənclik", "28 May"] },
    { "bus": "135", "stops": ["Avtovağzal", "20 Yanvar", "Memar Əcəmi", "Nəsimi", "Azadlıq prospekti"] }
  ]
};

const metroRoutes = [
  { "route": "Red Line", "stops": ["İçərişəhər", "Sahil", "28 May", "Gənclik", "Nəriman Nərimanov", "Ulduz", "Koroğlu", "Qara Qarayev", "Neftçilər", "Xalqlar Dostluğu", "Əhmədli", "Həzi Aslanov"] },
  { "route": "Green Line", "stops": ["Dərnəgül", "Azadlıq prospekti", "Nəsimi", "Memar Əcəmi", "20 Yanvar", "İnşaatçılar", "Elmlər Akademiyası", "Nizami", "28 May", "Xətai"] }
];

async function migrate() {
  try {
    console.log('🚀 Starting route migration...');

    // 1. Create table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transport_routes (
          id SERIAL PRIMARY KEY,
          type VARCHAR(20) NOT NULL,
          route_name VARCHAR(50) NOT NULL,
          stops TEXT[] NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_route_type ON transport_routes(type);
    `);
    console.log('✅ Table transport_routes created.');

    // 2. Clear existing
    await pool.query('DELETE FROM transport_routes');

    // 3. Insert Buses
    for (const r of busData.routes) {
      await pool.query(
        'INSERT INTO transport_routes (type, route_name, stops) VALUES ($1, $2, $3)',
        ['bus', r.bus, r.stops]
      );
    }
    console.log(`✅ ${busData.routes.length} Bus routes inserted.`);

    // 4. Insert Metro
    for (const r of metroRoutes) {
      await pool.query(
        'INSERT INTO transport_routes (type, route_name, stops) VALUES ($1, $2, $3)',
        ['metro', r.route, r.stops]
      );
    }
    console.log(`✅ ${metroRoutes.length} Metro routes inserted.`);

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrate();
