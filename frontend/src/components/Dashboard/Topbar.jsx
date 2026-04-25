import { FiSearch, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import { PiUserCircleFill } from "react-icons/pi";
import styles from './Topbar.module.scss';

export default function Topbar({ title }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h2>{title || 'Dashboard Overview'}</h2>
      </div>

      <div className={styles.right}>
        <div className={styles.search}>
          <FiSearch />
          <input type="text" placeholder="Search system logs..." />
        </div>

        <div className={styles.actions}>
          <button className={styles.iconBtn} aria-label="Notifications">
            <FiBell />
            <span className={styles.badge}></span>
          </button>
          
          <div className={styles.profile}>
            <div className={styles.userInfo}>
              <span className={styles.role}>System Overseer</span>
            </div>
            <PiUserCircleFill className={styles.avatar} />
          </div>

          <button className={styles.logoutBtn} aria-label="Logout">
            <FiLogOut />
          </button>
        </div>
      </div>
    </header>
  );
}
