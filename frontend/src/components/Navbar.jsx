import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBus, FaBars, FaTimes } from 'react-icons/fa';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = isDashboard
    ? [{ label: '← Əsas Səhifə', href: '/' }]
    : [
        { label: 'Haqqımızda', href: '#about' },
        { label: 'Necə İşləyir', href: '#how-it-works' },
        { label: 'Qiymətlər', href: '#pricing' },
        { label: 'Sual-Cavab', href: '#faq' },
      ];

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}><FaBus /></span>
          <span>B.<span className={styles.accent}>A</span>.K.<span className={styles.accent}>U</span></span>
        </Link>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {navLinks.map((l) => (
            <li key={l.label}>
              <a href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          {!isDashboard && (
            <Link to="/login" className={styles.dashBtn}>Giriş</Link>
          )}
          <button className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </nav>
  );
}
