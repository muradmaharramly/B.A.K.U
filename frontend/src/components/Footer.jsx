import { FaBus, FaTwitter, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoIcon}><FaBus /></span>
              <span>B.<span className={styles.accent}>A</span>.K.<span className={styles.accent}>U</span></span>
            </Link>
            <p className={styles.desc}>
              Based on Accurate Kilometer Usage. 
              The future of distance-based public transit payment.
            </p>
            <div className={styles.socials}>
              <a href="#twitter" aria-label="Twitter"><FaTwitter /></a>
              <a href="#linkedin" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="#github" aria-label="Github"><FaGithub /></a>
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.col}>
              <h4>Product</h4>
              <ul>
                <li><a href="#about">How it works</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#baku-card">B.A.K.U Card</a></li>
              </ul>
            </div>
            <div className={styles.col}>
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#news">Newsroom</a></li>
              </ul>
            </div>
            <div className={styles.col}>
              <h4>Legal</h4>
              <ul>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#cookies">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {currentYear} B.A.K.U Transit Systems. All rights reserved.</p>
          <div className={styles.contact}>
            <FaEnvelope /> support@baku-transit.com
          </div>
        </div>
      </div>
    </footer>
  );
}
