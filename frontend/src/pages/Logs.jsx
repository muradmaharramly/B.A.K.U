import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
  FiFileText, FiDownload, FiTrash2, FiSearch, 
  FiFilter, FiActivity, FiCpu, FiShield, FiTruck 
} from 'react-icons/fi';
import styles from './Logs.module.scss';

const logs = [
  { id: 1, timestamp: '2026-04-25 14:23:01', level: 'INFO', category: 'Fleet', message: 'Unit BUS-101 reached Nizami St. sector', source: 'GPS-ALPHA' },
  { id: 2, timestamp: '2026-04-25 14:20:45', level: 'WARN', category: 'Sensor', message: 'Proximity sensor drift detected on Gate #4', source: 'NODE-02' },
  { id: 3, timestamp: '2026-04-25 14:15:12', level: 'ERROR', category: 'Auth', message: 'Failed signature on SIM handover: BK-9904', source: 'AUTH-RELAY' },
  { id: 4, timestamp: '2026-04-25 14:10:00', level: 'SUCCESS', category: 'Payment', message: 'Billing cycle completed for 1,400 units', source: 'FIN-NODE' },
  { id: 5, timestamp: '2026-04-25 14:05:33', level: 'INFO', category: 'System', message: 'Kernel update pushed to edge nodes', source: 'MASTER-RELAY' },
  { id: 6, timestamp: '2026-04-25 14:00:21', level: 'INFO', category: 'Fleet', message: 'Unit METRO-02 speed adjustment: 60km/h', source: 'TRAFFIC-CTRL' },
];

export default function Logs() {
  return (
    <DashboardLayout title="System Activity Logs">
      <div className={styles.logsContainer}>
        <div className={styles.logsSidebar}>
          <div className={styles.logSearch}>
            <FiSearch />
            <input type="text" placeholder="Search logs..." />
          </div>
          
          <div className={styles.filterGroup}>
            <label>Filter by Level</label>
            <div className={styles.filterOptions}>
              <button className={`${styles.filterBtn} ${styles.active}`}>All</button>
              <button className={styles.filterBtn}>Info</button>
              <button className={styles.filterBtn}>Warning</button>
              <button className={styles.filterBtn}>Error</button>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Categories</label>
            <ul className={styles.catList}>
              <li><FiTruck /> Fleet <span>142</span></li>
              <li><FiActivity /> System <span>28</span></li>
              <li><FiShield /> Security <span>5</span></li>
              <li><FiCpu /> Sensors <span>12</span></li>
            </ul>
          </div>

          <div className={styles.logActions}>
            <button className={styles.btnGlass}><FiDownload /> Export CSV</button>
            <button className={styles.btnDanger}><FiTrash2 /> Clear Buffer</button>
          </div>
        </div>

        <div className={styles.logsMain}>
          <div className={styles.logsHeader}>
            <div className={styles.liveIndicator}>
              <span className={styles.pulse}></span> Streaming Live Logs
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
