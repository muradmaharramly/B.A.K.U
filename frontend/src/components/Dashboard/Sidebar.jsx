import { FiGrid, FiCompass, FiActivity, FiSettings, FiClock, FiServer } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.scss';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { icon: <FiGrid />, label: 'Overview', path: '/dashboard' },
    { icon: <FiCompass />, label: 'Fleet Management', path: '/dashboard/fleet' },
    { icon: <FiActivity />, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: <FiClock />, label: 'System Logs', path: '/dashboard/logs' },
    { icon: <FiServer />, label: 'Nodes', path: '/dashboard/nodes' },
    { icon: <FiSettings />, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoWrapper}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}><FiCompass /></span>
          <span>B.<span className={styles.accent}>A</span>.K.<span className={styles.accent}>U</span></span>
        </Link>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.systemBadge}>
          <span className={styles.pulse}></span>
          System Live
        </div>
      </div>
    </aside>
  );
}
