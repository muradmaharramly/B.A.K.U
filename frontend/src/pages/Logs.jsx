import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
  FiFileText, FiDownload, FiTrash2, FiSearch, 
  FiFilter, FiActivity, FiCpu, FiShield, FiTruck 
} from 'react-icons/fi';
import styles from './Logs.module.scss';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('Hamısı');

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      // Convert UI filters to backend filters if needed. Our DB has INFO, WARN, ERROR, SUCCESS
      let backendLevel = filterLevel;
      if (filterLevel === 'Info') backendLevel = 'INFO';
      if (filterLevel === 'Xəbərdarlıq') backendLevel = 'WARN';
      if (filterLevel === 'Xəta') backendLevel = 'ERROR';
      
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/logs`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search, level: backendLevel }
      });
      setLogs(res.data);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, filterLevel]);

  return (
    <DashboardLayout title="Sistem Fəaliyyət Jurnalları">
      <div className={styles.logsContainer}>
        <div className={styles.logsSidebar}>
          <div className={styles.logSearch}>
            <FiSearch />
            <input 
              type="text" 
              placeholder="Jurnallarda axtar..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label>Səviyyəyə görə filtr</label>
            <div className={styles.filterOptions}>
              {['Hamısı', 'Info', 'Xəbərdarlıq', 'Xəta'].map(lvl => (
                <button 
                  key={lvl}
                  className={`${styles.filterBtn} ${filterLevel === lvl ? styles.active : ''}`}
                  onClick={() => setFilterLevel(lvl)}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Kateqoriyalar</label>
            <ul className={styles.catList}>
              <li><FiTruck /> Donanma <span>-</span></li>
              <li><FiActivity /> Sistem <span>-</span></li>
              <li><FiShield /> Təhlükəsizlik <span>-</span></li>
              <li><FiCpu /> Sensorlar <span>-</span></li>
            </ul>
          </div>

          <div className={styles.logActions}>
            <button className={styles.btnGlass} onClick={fetchLogs}><FiDownload /> Təzələ</button>
            <button className={styles.btnDanger} onClick={() => setLogs([])}><FiTrash2 /> Buferi Təmizlə</button>
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
                  <span className={styles.logTime}>[{new Date(log.created_at).toLocaleTimeString()}]</span>
                  <span className={styles.logLevel}>{log.level}</span>
                  <span className={styles.logSource}>{log.source}</span>
                  <span className={styles.logMsg}>{log.message}</span>
                </div>
              ))}
              {logs.length === 0 && <div className={styles.logLine}><span className={styles.logMsg}>Göstəriləcək jurnal tapılmadı...</span></div>}
              <div className={styles.terminalCursor}></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
