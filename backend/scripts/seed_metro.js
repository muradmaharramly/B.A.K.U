require('dotenv').config();
const pool = require('../db/pool');

const metroData = [
  {
    lineName: 'Qırmızı Xətt',
    lineNumber: '1',
    color: '#ff0000',
    stations: [
      'İçərişəhər', 'Sahil', '28 May', 'Gənclik', 'Nəriman Nərimanov', 
      'Bakmil', 'Ulduz', 'Koroğlu', 'Qara Qarayev', 'Neftçilər', 
      'Xalqlar Dostluğu', 'Əhmədli', 'Həzi Aslanov'
    ]
  },
  {
    lineName: 'Yaşıl Xətt',
    lineNumber: '2',
    color: '#00ff00',
    stations: [
      'Xətai', 'Cəfər Cabbarlı', 'Nizami', 'Elmlər Akademiyası', 
      'İnşaatçılar', '20 Yanvar', 'Memar Əcəmi', 'Nəsimi', 
      'Azadlıq prospekti', 'Dərnəgül'
    ]
  },
  {
    lineName: 'Bənövşəyi Xətt',
    lineNumber: '3',
    color: '#a000a0',
    stations: [
      'Avtovağzal', 'Memar Əcəmi-2', '8 Noyabr', 'Xocasən'
    ]
  }
];

async function seedMetro() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Get or Create Baku Metro operator
    let opRes = await client.query("SELECT id FROM operators WHERE name = 'Baku Metro'");
    let operatorId;
    if (opRes.rows.length === 0) {
      opRes = await client.query("INSERT INTO operators (name) VALUES ('Baku Metro') RETURNING id");
      operatorId = opRes.rows[0].id;
    } else {
      operatorId = opRes.rows[0].id;
    }

    console.log(`Using Operator ID: ${operatorId}`);

    for (const line of metroData) {
      // 2. Insert Route (Line)
      const routeRes = await client.query(
        "INSERT INTO routes (operator_id, route_number, route_type, path_coordinates) VALUES ($1, $2, 'metro', $3) ON CONFLICT DO NOTHING RETURNING id",
        [operatorId, line.lineNumber, JSON.stringify({ color: line.color, name: line.lineName })]
      );
      
      let routeId;
      if (routeRes.rows.length > 0) {
        routeId = routeRes.rows[0].id;
      } else {
        const existingRoute = await client.query("SELECT id FROM routes WHERE route_number = $1 AND route_type = 'metro'", [line.lineNumber]);
        routeId = existingRoute.rows[0].id;
      }

      console.log(`Processing Line: ${line.lineName} (Route ID: ${routeId})`);

      // 3. Insert Stations and Link to Route
      for (let i = 0; i < line.stations.length; i++) {
        const stationName = line.stations[i];
        
        // Check if stop exists
        let stopRes = await client.query("SELECT id FROM stops WHERE name = $1 AND is_metro = TRUE", [stationName]);
        let stopId;
        
        if (stopRes.rows.length === 0) {
          stopRes = await client.query(
            "INSERT INTO stops (name, latitude, longitude, is_metro) VALUES ($1, $2, $3, TRUE) RETURNING id",
            [stationName, 40.4 + (Math.random() * 0.1), 49.8 + (Math.random() * 0.1)] // Rough random coords for Baku
          );
          stopId = stopRes.rows[0].id;
        } else {
          stopId = stopRes.rows[0].id;
        }

        // Link to route_stops
        await client.query(
          "INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
          [routeId, stopId, i + 1]
        );
      }
    }

    await client.query('COMMIT');
    console.log('✅ Metro data seeded successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding metro data:', err);
  } finally {
    client.release();
    process.exit();
  }
}

seedMetro();
