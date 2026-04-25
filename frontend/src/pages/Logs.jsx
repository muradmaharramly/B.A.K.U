import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
  FiFileText, FiDownload, FiTrash2, FiSearch, 
  FiFilter, FiActivity, FiCpu, FiShield, FiTruck 
} from 'react-icons/fi';
import styles from './Logs.module.scss';

const logs = [
  { id: 1, timestamp: '2026-04-25 14:23:01', level: 'INFO', category: 'Fleet', message: 'BUS-101 bloku Nizami küç. sektoruna çatdı', source: 'GPS-ALPHA' },
  { id: 2, timestamp: '2026-04-25 14:20:45', level: 'WARN', category: 'Sensor', message: 'Giriş #4-də yaxınlıq sensoru sapması aşkar edildi', source: 'NODE-02' },
  { id: 3, timestamp: '2026-04-25 14:15:12', level: 'ERROR', category: 'Auth', message: 'SIM keçidində imza xətası: BK-9904', source: 'AUTH-RELAY' },
  { id: 4, timestamp: '2026-04-25 14:10:00', level: 'SUCCESS', category: 'Payment', message: '1,400 blok üçün ödəniş dövrü başa çatdı', source: 'FIN-NODE' },
  { id: 5, timestamp: '2026-04-25 14:05:33', level: 'INFO', category: 'System', message: 'Kənari qovşaqlara nüvə yeniləməsi göndərildi', source: 'MASTER-RELAY' },
  { id: 6, timestamp: '2026-04-25 14:00:21', level: 'INFO', category: 'Fleet', message: 'METRO-02 bloku sürət tənzimlənməsi: 60km/saat', source: 'TRAFFIC-CTRL' },
];

export default function Logs() {
  return (
    <DashboardLayout title="Sistem Fəaliyyət Jurnalları">
      <div className={styles.logsContainer}>
        <div className={styles.logsSidebar}>
          <div className={styles.logSearch}>
            <FiSearch />
            <input type="text" placeholder="Jurnallarda axtar..." />
          </div>
          
          <div className={styles.filterGroup}>
            <label>Səviyyəyə görə filtr</label>
            <div className={styles.filterOptions}>
              <button className={`${styles.filterBtn} ${styles.active}`}>Hamısı</button>
              <button className={styles.filterBtn}>Info</button>
              <button className={styles.filterBtn}>Xəbərdarlıq</button>
              <button className={styles.filterBtn}>Xəta</button>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Kateqoriyalar</label>
            <ul className={styles.catList}>
              <li><FiTruck /> Donanma <span>142</span></li>
              <li><FiActivity /> Sistem <span>28</span></li>
              <li><FiShield /> Təhlükəsizlik <span>5</span></li>
              <li><FiCpu /> Sensorlar <span>12</span></li>
            </ul>
          </div>

          <div className={styles.logActions}>
            <button className={styles.btnGlass}><FiDownload /> CSV-yə Eksport</button>
            <button className={styles.btnDanger}><FiTrash2 /> Buferi Təmizlə</button>
          </div>
        </div>

        <div className={styles.logsMain}>
          <div className={styles.logsHeader}>
            <div className={styles.liveIndicator}>
              <span className={styles.pulse}></span> Canlı Jurnallar Axını
            </div>
          </div>

          <div className={styles.terminal}>
            <div className={styles.terminalHeader}>
              <div className={styles.dots}><span></span><span></span><span></span></div>
              <span className={styles.title}>system_logs.sh</span>
            </div>
            <div className={styles.terminalBody}>
              {logs.map((log) => (
                <div key={log.id} className={`${styles.logLine} ${styles[log.level.toLowerCase()]}`}>
                  <span className={styles.logTime}>[{log.timestamp}]</span>
                  <span className={styles.logLevel}>{log.level}</span>
                  <span className={styles.logSource}>{log.source}</span>
                  <span className={styles.logMsg}>{log.message}</span>
                </div>
              ))}
              <div className={styles.terminalCursor}></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
