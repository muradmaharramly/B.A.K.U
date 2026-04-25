import { useState } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
  FiUser, FiBell, FiLock, FiDatabase, FiSmartphone, 
  FiShield, FiMail, FiGlobe, FiSave, FiAlertCircle 
} from 'react-icons/fi';
import styles from './Dashboard.module.scss';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className={styles.settingsView}>
            <div className={styles.card}>
              <h3>Administrator Profile</h3>
              <p className={styles.cardDesc}>Manage your public and private system identity.</p>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input type="text" defaultValue="Admin Access" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Designation</label>
                  <input type="text" defaultValue="System Overseer" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Contact Email</label>
                  <input type="email" defaultValue="admin@baku-transit.com" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input type="text" defaultValue="+994 50 123 45 67" className={styles.input} />
                </div>
              </div>
              <button className={styles.btnPrimary}><FiSave /> Save Profile</button>
            </div>
            
            <div className={styles.card}>
              <h3>Regional Settings</h3>
              <div className={styles.formGroup}>
                <label>Default Currency</label>
                <select className={styles.input}>
                  <option>Azerbaijani Manat (₼)</option>
                  <option>US Dollar ($)</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>System Language</label>
                <select className={styles.input}>
                  <option>Azerbaijani</option>
                  <option>English</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className={styles.settingsView}>
            <div className={styles.card}>
              <h3>System Alerts</h3>
              <p className={styles.cardDesc}>Configure how you receive critical system updates.</p>
              <div className={styles.toggleList}>
                <div className={styles.toggleItem}>
                  <div>
                    <h4>Critical Errors</h4>
                    <p>Notify on database or node failures.</p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className={styles.toggleItem}>
                  <div>
                    <h4>Fleet Maintenance</h4>
                    <p>Alert when units require sensor calibration.</p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className={styles.toggleItem}>
                  <div>
                    <h4>Revenue Milestones</h4>
                    <p>Notify when daily revenue targets are hit.</p>
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
              <h3>Authentication</h3>
              <div className={styles.formGroup}>
                <label>Current Password</label>
                <input type="password" placeholder="••••••••" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>New Password</label>
                <input type="password" placeholder="Min. 12 characters" className={styles.input} />
              </div>
              <button className={styles.btnPrimary}><FiShield /> Update Password</button>
            </div>
            
            <div className={styles.card}>
              <h3>Security Protocols</h3>
              <div className={styles.toggleItem}>
                <div>
                  <h4>Two-Factor Authentication</h4>
                  <p>Require SMS code for admin access.</p>
                </div>
                <button className={styles.btnGlass}>Enable 2FA</button>
              </div>
            </div>
          </div>
        );

      case 'database':
        return (
          <div className={styles.settingsView}>
            <div className={styles.card}>
              <h3>Fare Configuration</h3>
              <p className={styles.cardDesc}>Master controls for distance-based billing logic.</p>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Base KM Rate (₼)</label>
                  <input type="number" defaultValue="0.10" step="0.01" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Flat Entry Fee (₼)</label>
                  <input type="number" defaultValue="0.20" step="0.01" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Student Discount (%)</label>
                  <input type="number" defaultValue="50" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Peak Hour Multiplier</label>
                  <input type="number" defaultValue="1.2" step="0.1" className={styles.input} />
                </div>
              </div>
              <button className={styles.btnPrimary}><FiSave /> Apply New Rates</button>
            </div>

            <div className={styles.card}>
              <h3>Data Retention</h3>
              <div className={styles.formGroup}>
                <label>Log Retention Period</label>
                <select className={styles.input}>
                  <option>30 Days</option>
                  <option>90 Days</option>
                  <option>1 Year</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'sync':
        return (
          <div className={styles.settingsView}>
            <div className={styles.card}>
              <h3>Edge Device Sync</h3>
              <p className={styles.cardDesc}>Manage API keys and protocols for on-bus validator units.</p>
              <div className={styles.keyBox}>
                <div className={styles.keyInfo}>
                  <label>Primary System API Key</label>
                  <code>BK_LIVE_••••••••••••••••••••3a2f</code>
                </div>
                <button className={styles.btnGlass}>Regenerate</button>
              </div>
              <div className={styles.formGroup}>
                <label>Sync Interval (Seconds)</label>
                <input type="number" defaultValue="5" className={styles.input} />
              </div>
              <button className={styles.btnPrimary}><FiSmartphone /> Force Sync All Units</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="System Settings">
      <div className={styles.settingsContainer}>
        <div className={styles.settingsNav}>
          <button 
            className={`${styles.sNavItem} ${activeTab === 'account' ? styles.active : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <FiUser /> Account
          </button>
          <button 
            className={`${styles.sNavItem} ${activeTab === 'notifications' ? styles.active : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <FiBell /> Notifications
          </button>
          <button 
            className={`${styles.sNavItem} ${activeTab === 'security' ? styles.active : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FiLock /> Security
          </button>
          <button 
            className={`${styles.sNavItem} ${activeTab === 'database' ? styles.active : ''}`}
            onClick={() => setActiveTab('database')}
          >
            <FiDatabase /> Fare & Data
          </button>
          <button 
            className={`${styles.sNavItem} ${activeTab === 'sync' ? styles.active : ''}`}
            onClick={() => setActiveTab('sync')}
          >
            <FiSmartphone /> Device Sync
          </button>
        </div>

        <div className={styles.settingsContent}>
          {renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
}
