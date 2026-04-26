import { FiTwitter, FiLinkedin, FiGithub, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import logo from '../assets/B.A.K.U-logo.png';
import styles from './Footer.module.scss';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <img src={logo} alt="B.A.K.U Logo" className={styles.logoImg} />
              <span>B.<span className={styles.accent}>A</span>.K.<span className={styles.accent}>U</span></span>
            </Link>
            <p className={styles.desc}>
              Dəqiq Kilometr İstifadəsinə Əsaslanır. 
              Məsafəyə əsaslanan ictimai nəqliyyat ödənişlərinin gələcəyi.
            </p>
            <div className={styles.socials}>
              <a href="#twitter" aria-label="Twitter"><FiTwitter /></a>
              <a href="#linkedin" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href="#github" aria-label="Github"><FiGithub /></a>
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.col}>
              <h4>Məhsul</h4>
              <ul>
                <li><a href="#about">Necə işləyir</a></li>
                <li><a href="#pricing">Qiymətlər</a></li>
                <li><a href="#baku-card">B.A.K.U Kart</a></li>
              </ul>
            </div>
            <div className={styles.col}>
              <h4>Şirkət</h4>
              <ul>
                <li><a href="#about">Haqqımızda</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {currentYear} B.A.K.U Nəqliyyat Sistemləri. Bütün hüquqlar qorunur.</p>
          <div className={styles.contact}>
            <FiMail /> support@baku-transit.com
          </div>
        </div>
      </div>
    </footer>
  );
}
