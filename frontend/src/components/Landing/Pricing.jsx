import { FaCheckCircle, FaTag, FaStar, FaGlobe } from 'react-icons/fa';
import styles from './Pricing.module.scss';

const tiers = [
  {
    name: 'Standard',
    minFare: '₼0.20',
    maxFare: '₼1.50',
    rate: '₼0.10 / km',
    discount: '0%',
    color: '#627d98',
    featured: true,
    features: ['GPS & SIM tracking', 'Digital card access', 'Negative balance allowed', 'Family linking'],
  },
  {
    name: 'Senior',
    minFare: '₼0.10',
    maxFare: '₼0.75',
    rate: '₼0.05 / km',
    discount: '50%',
    features: ['50% discount on all rides', 'Priority support', 'Negative balance allowed', 'Physical card free'],
  },
];

export default function Pricing() {
  return (
    <section className={styles.pricing} id="pricing">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}><FaTag /> Pricing</span>
          <h2 className={styles.title}>
            Transparent, <span className={styles.highlight}>Distance-Based</span> Fares
          </h2>
          <p className={styles.subtitle}>
            No hidden fees. Pay based on how far you travel, with special discounts 
            for seniors and frequent riders.
          </p>
        </div>

        <div className={styles.grid}>
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`${styles.card} ${tier.featured ? styles.featured : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {tier.featured && <div className={styles.popularTag}><FaStar /> Most Popular</div>}
              <h3 className={styles.tierName} style={tier.color ? { color: tier.color } : {}}>{tier.name}</h3>
              <div className={styles.rate}>{tier.rate}</div>
              <div className={styles.fareRange}>
                <span>Min: <strong>{tier.minFare}</strong></span>
                <span>Max: <strong>{tier.maxFare}</strong></span>
              </div>
              <div className={styles.discountBadge}>{tier.discount} discount</div>
              <ul className={styles.featureList}>
                {tier.features.map((f, j) => (
                  <li key={j}><FaCheckCircle /> {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.touristNote}>
          <div className={styles.noteIcon}><FaGlobe /></div>
          <div>
            <strong>Tourist Card</strong> — Pre-paid only. Zero balance = entry denied. 
            Available at all metro stations and airport kiosks. Standard rates apply.
          </div>
        </div>
      </div>
    </section>
  );
}
