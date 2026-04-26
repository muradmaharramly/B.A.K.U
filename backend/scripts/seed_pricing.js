require('dotenv').config();
const pool = require('../db/pool');

const pricingData = {
  plans: {
    standard: { label: 'Standart', multiplier: 1.0, description: "Fərdi istifadəçilər üçün çevik məsafə əsaslı ödəniş." },
    family: { label: 'Ailə', multiplier: 0.8, description: "Ailə üzvləri üçün 20% endirimli vahid balans." },
    tourist: { label: 'Turist', multiplier: 0.9, description: "Turistlər üçün özəl 10% endirimli tariflər." }
  },
  metro_tiers: [
    { count: 1, fare: 0.40 },
    { count: 2, fare: 0.45 },
    { count: 3, fare: 0.50 },
    { count: 4, fare: 0.55 },
    { count: 5, fare: 0.60 },
    { range: [6, 7], fare: 0.65 },
    { range: [8, 9], fare: 0.70 },
    { min: 10, fare: 0.75 }
  ],
  bus_tiers: [
    { range: [0, 3], fare: 0.40 },
    { range: [4, 6], fare: 0.50 },
    { range: [7, 10], fare: 0.60 },
    { range: [11, 15], fare: 0.70 },
    { min: 16, fare: 0.80 }
  ]
};

async function seedPricing() {
  try {
    console.log('🚀 Seeding pricing information to database...');

    await pool.query(`
      INSERT INTO system_settings (key, value, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `, ['pricing_plans', JSON.stringify(pricingData)]);

    console.log('✅ Pricing information saved successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to seed pricing:', err);
    process.exit(1);
  }
}

seedPricing();
