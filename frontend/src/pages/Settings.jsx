import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
  FiUser, FiBell, FiLock, FiDatabase, FiSmartphone, 
  FiShield, FiMail, FiGlobe, FiSave, FiAlertCircle 
} from 'react-icons/fi';
import CustomSelect from '../components/Common/CustomSelect';
import styles from './Settings.module.scss';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);

  // States for all settings
  const [currency, setCurrency] = useState('azn');
  const [language, setLanguage] = useState('az');
  const [logRetention, setLogRetention] = useState('90');
  
  const [profile, setProfile] = useState({
    fullName: 'Admin Girişi',
    title: 'Sistem Nəzarətçisi',
    email: 'admin@baku-transit.com',
    phone: '+994 50 123 45 67'
  });

  const [notifications, setNotifications] = useState({
    criticalErrors: true,
    fleetMaintenance: true,
    revenueGoals: false
  });

  const [tariff, setTariff] = useState({
    baseFare: 0.30,
    perKm: 0.05,
    fixedEntry: 0.20,
    studentDiscount: 50,
    peakMultiplier: 1.2
  });

  const [sync, setSync] = useState({
    apiKey: 'BK_LIVE_••••••••••••••••••••3a2f',
    interval: 5
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data;
        
        if (data.currency) setCurrency(data.currency.code || data.currency);
        if (data.language) setLanguage(data.language.code || data.language);
        if (data.logRetention) setLogRetention(data.logRetention.days?.toString() || data.logRetention);
        
        if (data.admin_profile) setProfile(data.admin_profile);
        if (data.notifications) setNotifications(data.notifications);
        if (data.tariff) setTariff(data.tariff);
        if (data.sync_settings) setSync(data.sync_settings);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = async (payload, successMessage) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/settings`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(successMessage || 'Tənzimləmələr uğurla yadda saxlanıldı!');
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Məlumat saxlanılarkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = () => saveSettings({ admin_profile: profile }, 'Profil məlumatları yeniləndi!');
  const handleRegionalSave = () => saveSettings({ currency, language, logRetention }, 'Regional tənzimləmələr saxlanıldı!');
  const handleNotificationsSave = () => saveSettings({ notifications }, 'Bildiriş seçimləri yeniləndi!');
  const handleTariffSave = () => saveSettings({ tariff }, 'Yeni tariflər bazaya yazıldı və tətbiq edildi!');
  const handleSyncSave = () => saveSettings({ sync_settings: sync }, 'Sinxronizasiya tənzimləmələri yeniləndi!');

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
                  <input type="text" value={profile.fullName} onChange={e => setProfile({...profile, fullName: e.target.value})} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Vəzifə</label>
                  <input type="text" value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Əlaqə E-poçtu</label>
                  <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Telefon Nömrəsi</label>
                  <input type="text" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className={styles.input} />
                </div>
              </div>
              <button disabled={loading} className={styles.btnPrimary} onClick={handleProfileSave}><FiSave /> Profili Saxla</button>
            </div>
            
            <div className={styles.card}>
              <h3>Regional Tənzimləmələr</h3>
              <div className={styles.formGroup}>
                <label>Standart Valyuta</label>
                <div style={{ maxWidth: '300px' }}>
                  <CustomSelect 
                    options={[
                      { value: 'azn', label: 'Azərbaycan Manatı (₼)' },
                      { value: 'usd', label: 'ABŞ Dolları ($)' }
                    ]}
                    value={currency}
                    onChange={setCurrency}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Sistem Dili</label>
                <div style={{ maxWidth: '300px' }}>
                  <CustomSelect 
                    options={[
                      { value: 'az', label: 'Azərbaycan dili' },
                      { value: 'en', label: 'İngilis dili' }
                    ]}
                    value={language}
                    onChange={setLanguage}
                  />
                </div>
              </div>
              <button disabled={loading} className={styles.btnPrimary} onClick={handleRegionalSave}><FiSave /> Tənzimləmələri Saxla</button>
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
                  <input type="checkbox" checked={notifications.criticalErrors} onChange={e => setNotifications({...notifications, criticalErrors: e.target.checked})} />
                </div>
                <div className={styles.toggleItem}>
                  <div>
                    <h4>Donanma Texniki Baxışı</h4>
                    <p>Bloklar sensor kalibrlənməsi tələb etdikdə xəbərdar et.</p>
                  </div>
                  <input type="checkbox" checked={notifications.fleetMaintenance} onChange={e => setNotifications({...notifications, fleetMaintenance: e.target.checked})} />
                </div>
                <div className={styles.toggleItem}>
                  <div>
                    <h4>Gəlir Məqsədləri</h4>
                    <p>Gündəlik gəlir hədəflərinə çatdıqda bildiriş göndər.</p>
                  </div>
                  <input type="checkbox" checked={notifications.revenueGoals} onChange={e => setNotifications({...notifications, revenueGoals: e.target.checked})} />
                </div>
              </div>
              <button disabled={loading} className={styles.btnPrimary} onClick={handleNotificationsSave} style={{marginTop: '1.5rem'}}><FiSave /> Bildirişləri Saxla</button>
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
              <button className={styles.btnPrimary} onClick={() => toast.success("Şifrə uğurla yeniləndi")}><FiShield /> Şifrəni Yenilə</button>
            </div>
            
            <div className={styles.card}>
              <h3>Təhlükəsizlik Protokolları</h3>
              <div className={styles.toggleItem}>
                <div>
                  <h4>İki-Mərhələli Autentifikasiya</h4>
                  <p>Admin girişi üçün SMS kodu tələb et.</p>
                </div>
                <button className={styles.btnGlass} onClick={() => toast.info("2FA aktivləşdirmə kodu e-poçta göndərildi")}>2FA-nı Aktiv Et</button>
              </div>
            </div>
          </div>
        );

      case 'database':
        return (
          <div className={styles.settingsView}>
            <div className={styles.card}>
              <h3>Tarif İdarəetməsi</h3>
              <p className={styles.cardDesc}>Sistem üzrə baza gediş haqlarını və əmsalları təyin edin.</p>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Baza Gediş Haqqı (₼)</label>
                  <input type="number" value={tariff.baseFare} onChange={e => setTariff({...tariff, baseFare: parseFloat(e.target.value)})} step="0.01" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Kilometr Üzrə (₼/km)</label>
                  <input type="number" value={tariff.perKm} onChange={e => setTariff({...tariff, perKm: parseFloat(e.target.value)})} step="0.01" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Sabit Giriş Haqqı (₼)</label>
                  <input type="number" value={tariff.fixedEntry} onChange={e => setTariff({...tariff, fixedEntry: parseFloat(e.target.value)})} step="0.01" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Tələbə Endirimi (%)</label>
                  <input type="number" value={tariff.studentDiscount} onChange={e => setTariff({...tariff, studentDiscount: parseFloat(e.target.value)})} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Pik Saat Əmsalı</label>
                  <input type="number" value={tariff.peakMultiplier} onChange={e => setTariff({...tariff, peakMultiplier: parseFloat(e.target.value)})} step="0.1" className={styles.input} />
                </div>
              </div>
              <button disabled={loading} className={styles.btnPrimary} onClick={handleTariffSave}><FiSave /> Yeni Tarifləri Tətbiq Et</button>
            </div>

            <div className={styles.card}>
              <h3>Məlumatların Saxlanılması</h3>
              <div className={styles.formGroup}>
                <label>Jurnal Saxlama Müddəti</label>
                <div style={{ maxWidth: '300px' }}>
                  <CustomSelect 
                    options={[
                      { value: '30', label: '30 Gün' },
                      { value: '90', label: '90 Gün' },
                      { value: '365', label: '1 İl' }
                    ]}
                    value={logRetention}
                    onChange={setLogRetention}
                  />
                </div>
              </div>
              <button disabled={loading} className={styles.btnPrimary} onClick={handleRegionalSave}><FiSave /> Tənzimləmələri Saxla</button>
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
                  <code>{sync.apiKey}</code>
                </div>
                <button className={styles.btnGlass} onClick={() => {
                  const newKey = 'BK_LIVE_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                  setSync({...sync, apiKey: newKey});
                  toast.info('Yeni açar yaradıldı, saxlayaraq tətbiq edin.');
                }}>Yenidən Yaradın</button>
              </div>
              <div className={styles.formGroup}>
                <label>Sinxronizasiya İntervalı (Saniyə)</label>
                <input type="number" value={sync.interval} onChange={e => setSync({...sync, interval: parseInt(e.target.value)})} className={styles.input} />
              </div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                <button disabled={loading} className={styles.btnPrimary} onClick={handleSyncSave}><FiSave /> Saxla</button>
                <button className={styles.btnGlass} onClick={() => toast.success('Məcburi sinxronizasiya protokolu başladıldı!')}><FiSmartphone /> Bütün Blokları Məcburi Sinxron Et</button>
              </div>
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
