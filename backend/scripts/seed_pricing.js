require('dotenv').config();
const pool = require('../db/pool');

const pricingData = {
  standard: {
    name: "Standart Hesab",
    description: "Fərdi istifadəçilər üçün çevik məsafə əsaslı ödəniş.",
    base_fare: 0.20,
    per_station: 0.05,
    min_fare: 0.40,
    benefits: ["Limitsiz keçid imkanı", "Real-vaxt izləmə", "Rəqəmsal pul kisəsi"]
  },
  family: {
    name: "Ailə Hesabı",
    description: "Ailə üzvləri üçün ortaq balans və xüsusi endirimli tariflər.",
    base_fare: 0.15,
    per_station: 0.04,
    min_fare: 0.40,
    benefits: ["5 nəfərə qədər üzv", "20% endirimli gediş", "Vahid ailə balansı"]
  }
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
