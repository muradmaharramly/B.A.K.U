import { FaSearch, FaBell, FaUserCircle, FaPowerOff } from 'react-icons/fa';
import styles from './Topbar.module.scss';

export default function Topbar({ title }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h2>{title || 'Dashboard Overview'}</h2>
      </div>

      <div className={styles.right}>
        <div className={styles.search}>
          <FaSearch />
          <input type="text" placeholder="Search system logs..." />
        </div>

        <div className={styles.actions}>
          <button className={styles.iconBtn} aria-label="Notifications">
            <FaBell />
            <span className={styles.badge}></span>
          </button>
          
          <div className={styles.profile}>
            <div className={styles.userInfo}>
              <span className={styles.name}>Admin Access</span>
              <span className={styles.role}>System Overseer</span>
            </div>
            <FaUserCircle className={styles.avatar} />
          </div>

          <button className={styles.logoutBtn} aria-label="Logout">
            <FaPowerOff />
          </button>
        </div>
      </div>
    </header>
  );
}
