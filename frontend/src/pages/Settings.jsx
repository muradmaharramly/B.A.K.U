import { useState } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
  FiUser, FiBell, FiLock, FiDatabase, FiSmartphone, 
  FiShield, FiMail, FiGlobe, FiSave, FiAlertCircle 
} from 'react-icons/fi';
import styles from './Settings.module.scss';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className={styles.settingsView}>
            <div className={styles.card}>
              <h3>Administrator Profili</h3>
              <p className={styles.cardDesc}>İctimai və şəxsi sistem kimliyinizi idarə edin.</p>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Tam Ad</label>
                  <input type="text" defaultValue="Admin Girişi" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Vəzifə</label>
                  <input type="text" defaultValue="Sistem Nəzarətçisi" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Əlaqə E-poçtu</label>
                  <input type="email" defaultValue="admin@baku-transit.com" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Telefon Nömrəsi</label>
                  <input type="text" defaultValue="+994 50 123 45 67" className={styles.input} />
                </div>
              </div>
              <button className={styles.btnPrimary}><FiSave /> Profili Saxla</button>
            </div>
            
            <div className={styles.card}>
              <h3>Regional Tənzimləmələr</h3>
              <div className={styles.formGroup}>
                <label>Standart Valyuta</label>
                <select className={styles.input}>
                  <option>Azərbaycan Manatı (₼)</option>
                  <option>ABŞ Dolları ($)</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Sistem Dili</label>
                <select className={styles.input}>
                  <option>Azərbaycan dili</option>
                  <option>İngilis dili</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className={styles.settingsView}>
            <div className={styles.card}>
              <h3>Sistem Xəbərdarlıqları</h3>
              <p className={styles.cardDesc}>Kritik sistem yeniləmələrini necə alacağınızı tənzimləyin.</p>
              <div className={styles.toggleList}>
                <div className={styles.toggleItem}>
                  <div>
                    <h4>Kritik Xətalar</h4>
                    <p>Verilənlər bazası və ya qovşaq xətaları zamanı bildiriş göndər.</p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className={styles.toggleItem}>
                  <div>
                    <h4>Donanma Texniki Baxışı</h4>
                    <p>Bloklar sensor kalibrlənməsi tələb etdikdə xəbərdar et.</p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className={styles.toggleItem}>
                  <div>
                    <h4>Gəlir Məqsədləri</h4>
                    <p>Gündəlik gəlir hədəflərinə çatdıqda bildiriş göndər.</p>
                  </div>
                  <input type="checkbox" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className={styles.settingsView}>
            <div className={styles.card}>
              <h3>Autentifikasiya</h3>
              <div className={styles.formGroup}>
                <label>Cari Şifrə</label>
                <input type="password" placeholder="••••••••" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Yeni Şifrə</label>
                <input type="password" placeholder="Min. 12 simvol" className={styles.input} />
              </div>
              <button className={styles.btnPrimary}><FiShield /> Şifrəni Yenilə</button>
            </div>
            
            <div className={styles.card}>
              <h3>Təhlükəsizlik Protokolları</h3>
              <div className={styles.toggleItem}>
                <div>
                  <h4>İki-Mərhələli Autentifikasiya</h4>
                  <p>Admin girişi üçün SMS kodu tələb et.</p>
                </div>
                <button className={styles.btnGlass}>2FA-nı Aktiv Et</button>
              </div>
            </div>
          </div>
        );

      case 'database':
        return (
          <div className={styles.settingsView}>
            <div className={styles.card}>
              <h3>Tarif Tənzimləmələri</h3>
              <p className={styles.cardDesc}>Məsafəyə əsaslanan ödəniş məntiqi üçün əsas idarəetmə.</p>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Baza KM Tarifi (₼)</label>
                  <input type="number" defaultValue="0.10" step="0.01" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Sabit Giriş Haqqı (₼)</label>
                  <input type="number" defaultValue="0.20" step="0.01" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Tələbə Endirimi (%)</label>
                  <input type="number" defaultValue="50" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Pik Saat Əmsalı</label>
                  <input type="number" defaultValue="1.2" step="0.1" className={styles.input} />
                </div>
              </div>
              <button className={styles.btnPrimary}><FiSave /> Yeni Tarifləri Tətbiq Et</button>
            </div>

            <div className={styles.card}>
              <h3>Məlumatların Saxlanılması</h3>
              <div className={styles.formGroup}>
                <label>Jurnal Saxlama Müddəti</label>
                <select className={styles.input}>
                  <option>30 Gün</option>
                  <option>90 Gün</option>
                  <option>1 İl</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'sync':
        return (
          <div className={styles.settingsView}>
            <div className={styles.card}>
              <h3>Cihaz Sinxronizasiyası</h3>
              <p className={styles.cardDesc}>Nəqliyyat daxili validatorlar üçün API açarlarını və protokolları idarə edin.</p>
              <div className={styles.keyBox}>
                <div className={styles.keyInfo}>
                  <label>Əsas Sistem API Açarı</label>
                  <code>BK_LIVE_••••••••••••••••••••3a2f</code>
                </div>
                <button className={styles.btnGlass}>Yenidən Yaradın</button>
              </div>
              <div className={styles.formGroup}>
                <label>Sinxronizasiya İntervalı (Saniyə)</label>
                <input type="number" defaultValue="5" className={styles.input} />
              </div>
              <button className={styles.btnPrimary}><FiSmartphone /> Bütün Blokları Məcburi Sinxron Et</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="Sistem Tənzimləmələri">
      <div className={styles.settingsContainer}>
        <div className={styles.settingsNav}>
          <button 
            className={`${styles.sNavItem} ${activeTab === 'account' ? styles.active : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <FiUser /> Hesab
          </button>
          <button 
            className={`${styles.sNavItem} ${activeTab === 'notifications' ? styles.active : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <FiBell /> Bildirişlər
          </button>
          <button 
            className={`${styles.sNavItem} ${activeTab === 'security' ? styles.active : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FiLock /> Təhlükəsizlik
          </button>
          <button 
            className={`${styles.sNavItem} ${activeTab === 'database' ? styles.active : ''}`}
            onClick={() => setActiveTab('database')}
          >
            <FiDatabase /> Tarif və Məlumat
          </button>
          <button 
            className={`${styles.sNavItem} ${activeTab === 'sync' ? styles.active : ''}`}
            onClick={() => setActiveTab('sync')}
          >
            <FiSmartphone /> Cihaz Sinxronizasiyası
          </button>
        </div>

        <div className={styles.settingsContent}>
          {renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
}
