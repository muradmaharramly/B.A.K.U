import { FiArrowRight, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.dataStreams}>
        <div className={styles.stream} style={{ top: '20%', left: '10%', animationDelay: '0s' }}></div>
        <div className={styles.stream} style={{ top: '50%', right: '10%', animationDelay: '1s' }}></div>
        <div className={styles.stream} style={{ bottom: '20%', left: '30%', animationDelay: '2s' }}></div>
        <div className={styles.glowElement}></div>
      </div>

      <div className={styles.grid}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Nəqliyyatın
            <br />
            <span className={styles.highlight}>Gələcəyi</span>
            <br />
            Artıq Buradadır.
          </h1>

          <p className={styles.subtitle}>
            Yalnız qət etdiyiniz məsafə üçün ödəyin. B.A.K.U dəqiq gedişinizi izləmək 
            üçün GPS və SIM siqnal intellektindən istifadə edir — sabit tariflərə son.
          </p>

          <div className={styles.ctas}>
            <Link to="/dashboard" className={styles.btnPrimary}>
              <FiMapPin /> Paneli Kəşf Et
            </Link>
            <a href="#how-it-works" className={styles.btnGlass}>
              Necə İşləyir? <FiArrowRight />
            </a>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.num}>2.4M+</div>
              <div className={styles.label}>Gündəlik Sərnişin</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.num}>1500+</div>
              <div className={styles.label}>Aktiv Avtobus</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.num}>27</div>
              <div className={styles.label}>Metro Stansiyası</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
