import { useState } from 'react';
import { FiSearch, FiBell, FiUser, FiLogOut, FiCheckCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import { PiUserCircleFill } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Topbar.module.scss';

const notifications = [
  { id: 1, type: 'success', text: 'BUS-102 bloku uğurla qoşuldu', time: '2 dəq əvvəl', icon: <FiCheckCircle /> },
  { id: 2, type: 'warning', text: 'Nizami sektorunda yüklənmə aşkarlandı', time: '15 dəq əvvəl', icon: <FiAlertTriangle /> },
  { id: 3, type: 'info', text: 'Yeni sistem yeniləməsi hazırdır', time: '1 saat əvvəl', icon: <FiInfo /> },
];

export default function Topbar({ title }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h2>{title || 'Paneli Baxış'}</h2>
      </div>

      <div className={styles.right}>
        <div className={styles.search}>
          <FiSearch />
          <input type="text" placeholder="Sistem jurnallarında axtar..." />
        </div>

        <div className={styles.actions}>
          <div className={styles.notificationWrapper}>
            <button className={styles.iconBtn} aria-label="Bildirişlər">
              <FiBell />
              <span className={styles.badge}></span>
            </button>
            
            <div className={styles.notificationsDropdown}>
              <div className={styles.dropdownHeader}>
                <h3>Bildirişlər</h3>
                <span>Hamısını sil</span>
              </div>
              <div className={styles.dropdownList}>
                {notifications.map(notif => (
                  <div key={notif.id} className={`${styles.notifItem} ${styles[notif.type]}`}>
                    <div className={styles.notifIcon}>{notif.icon}</div>
                    <div className={styles.notifContent}>
                      <p>{notif.text}</p>
                      <span className={styles.notifTime}>{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.dropdownFooter}>
                Bütün bildirişlərə bax
              </div>
            </div>
          </div>
          
          <div 
            className={styles.profile}
            onClick={() => navigate('/dashboard/settings')}
            style={{ cursor: 'pointer' }}
            title="Tənzimləmələrə keç"
          >
            <div className={styles.userInfo}>
              <span className={styles.role}>Sistem Nəzarətçisi</span>
            </div>
            <PiUserCircleFill className={styles.avatar} />
          </div>

          <button 
            className={styles.logoutBtn} 
            aria-label="Çıxış"
            onClick={() => setShowLogoutModal(true)}
          >
            <FiLogOut />
          </button>
        </div>
      </div>

      {showLogoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalIcon}>
              <FiLogOut />
            </div>
            <h3>Sistemdən Çıxış</h3>
            <p>Hesabınızdan çıxış etmək istədiyinizə əminsinizmi?</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowLogoutModal(false)}>İmtina</button>
              <button className={styles.confirmBtn} onClick={logout}>Bəli, Çıx</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
