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
            The Future of
            <br />
            <span className={styles.highlight}>Transit Payment</span>
            <br />
            is Here.
          </h1>

          <p className={styles.subtitle}>
            Pay only for the distance you travel. B.A.K.U uses GPS & SIM signal
            intelligence to track your exact ride — no more flat fares.
          </p>

          <div className={styles.ctas}>
            <Link to="/dashboard" className={styles.btnPrimary}>
              <FiMapPin /> Explore Dashboard
            </Link>
            <a href="#how-it-works" className={styles.btnGlass}>
              Learn How It Works <FiArrowRight />
            </a>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.num}>2.4M+</div>
              <div className={styles.label}>Daily Riders</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.num}>89</div>
              <div className={styles.label}>Bus Routes</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.num}>19</div>
              <div className={styles.label}>Metro Stations</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
