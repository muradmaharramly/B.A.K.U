import { FiArrowRight } from 'react-icons/fi';
import { RiRocketLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import styles from './CTA.module.scss';

export default function CTA() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.badge}>
            <RiRocketLine /> B.A.K.U Transit Ecosystem
          </div>
          <h2 className={styles.title}>İctimai <span className={styles.highlight}>Nəqliyyatın Gələcəyinə</span> Qoşul!</h2>
          <p className={styles.desc}>
            Məsafəyə əsaslanan ödəniş sistemi ilə daha ədalətli və rahat səyahət et. 
            İndi qeydiyyatdan keç və B.A.K.U-nun üstünlüklərindən yararlanmağa başla.
          </p>
          <Link to="/dashboard" className={styles.button}>
            Başla <FiArrowRight />
          </Link>
          
          <div className={styles.glow}></div>
        </div>
      </div>
    </section>
  );
}
