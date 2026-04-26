import { FiCheckCircle, FiTag, FiStar, FiGlobe } from 'react-icons/fi';
import styles from './Pricing.module.scss';

const tiers = [
  {
    name: 'Standart',
    minFare: '₼0.40',
    maxFare: '₼0.80',
    rate: '₼0.05 / km',
    discount: '0%',
    color: '#627d98',
    featured: true,
    features: ['GPS və SIM izləmə', 'Rəqəmsal karta giriş', 'Transfer endirimi (₼0.10)', '24/7 Dəstək xidməti'],
  },
  {
    name: 'Ailə Hesabı',
    minFare: '₼0.40',
    maxFare: '₼0.65',
    rate: '₼0.04 / km',
    discount: '20%',
    features: ['Ortaq hesabla ödəniş rahatlığı', 'Ümumi balansın idarə edilməsi', 'Ailəvi gedişlərə xüsusi endirim', 'Uşaqlar üçün transfer pulsuzdur'],
  },
];

export default function Pricing() {
  return (
    <section className={styles.pricing} id="pricing">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}><FiTag /> Qiymətlər</span>
          <h2 className={styles.title}>
            Şəffaf, <span className={styles.highlight}>Məsafəyə Əsaslanan</span> Tariflər
          </h2>
          <p className={styles.subtitle}>
            Gizli ödənişlər yoxdur. Səyahət etdiyiniz məsafəyə görə ödəyin. 
            Ailələr və daimi sərnişinlər üçün xüsusi endirimlər mövcuddur.
          </p>
        </div>

        <div className={styles.grid}>
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`${styles.card} ${tier.featured ? styles.featured : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {tier.featured && <div className={styles.popularTag}><FiStar /> Ən Populyar</div>}
              <h3 className={styles.tierName} style={tier.color ? { color: tier.color } : {}}>{tier.name}</h3>
              <div className={styles.rate}>{tier.rate}</div>
              <div className={styles.fareRange}>
                <span>Min: <strong>{tier.minFare}</strong></span>
                <span>Maks: <strong>{tier.maxFare}</strong></span>
              </div>
              <div className={styles.discountBadge}>{tier.discount} endirim</div>
              <ul className={styles.featureList}>
                {tier.features.map((f, j) => (
                  <li key={j}><FiCheckCircle /> {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.touristNote}>
          <div className={styles.noteIcon}><FiGlobe /></div>
          <div>
            <strong>Turist Kartı</strong> — Yalnız öncədən ödənişli. Sıfır balans = giriş imtinası. 
            Bütün metro stansiyalarında və hava limanı köşklərində əldə etmək olar. Standart tariflər keçərlidir.
          </div>
        </div>
      </div>
    </section>
  );
}
