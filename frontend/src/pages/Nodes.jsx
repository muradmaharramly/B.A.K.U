import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
  FiServer, FiCpu, FiWifi, FiActivity, FiSearch, 
  FiPlus, FiChevronRight, FiRefreshCw 
} from 'react-icons/fi';
import styles from './Nodes.module.scss';

const nodes = [
  { id: 'NODE-01', name: 'Baku Central Relay', status: 'online', uptime: '142d 4h', load: '12%', type: 'Master', ip: '192.168.1.1' },
  { id: 'NODE-02', name: 'Nizami Sector Hub', status: 'online', uptime: '45d 12h', load: '45%', type: 'Edge', ip: '192.168.4.12' },
  { id: 'NODE-03', name: 'Xətai Data Node', status: 'standby', uptime: '12d 1h', load: '2%', type: 'Backup', ip: '10.0.0.5' },
  { id: 'NODE-04', name: 'Sumqayıt Link', status: 'online', uptime: '88d 19h', load: '68%', type: 'Edge', ip: '172.16.0.44' },
  { id: 'NODE-05', name: 'Gəncə Gateway', status: 'offline', uptime: '0d 0h', load: '0%', type: 'Edge', ip: '192.168.10.1' },
];

export default function Nodes() {
  return (
    <DashboardLayout title="Network Infrastructure">
      <div className={styles.pageHeader}>
        <div className={styles.searchBox}>
          <FiSearch />
          <input type="text" placeholder="Search by name, ID or IP..." />
        </div>
        <div className={styles.actions}>
          <button className={styles.btnGlass}><FiRefreshCw /> Refresh State</button>
          <button className={styles.btnPrimary}><FiPlus /> Provision Node</button>
        </div>
      </div>

      <div className={styles.nodesGrid}>
        {nodes.map((node) => (
          <div key={node.id} className={`${styles.nodeCard} ${styles[node.status]}`}>
            <div className={styles.nodeHeader}>
              <div className={styles.nodeIdentity}>
                <div className={styles.iconWrapper}>
                  <FiServer />
                </div>
                <div>
                  <h3 className={styles.nodeName}>{node.name}</h3>
                  <span className={styles.nodeIp}>{node.ip}</span>
                </div>
              </div>
              <span className={styles.statusBadge}>{node.status}</span>
            </div>

            <div className={styles.nodeMetrics}>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>
                  <FiCpu /> CPU LOAD
                </div>
                <div className={styles.metricBar}>
                  <div className={styles.fill} style={{ width: node.load }}></div>
                </div>
                <span className={styles.metricValue}>{node.load}</span>
              </div>
              
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>
                  <FiActivity /> NETWORK UPTIME
                </div>
                <span className={styles.metricValue}>{node.uptime}</span>
              </div>
            </div>

            <div className={styles.nodeFooter}>
              <div className={styles.nodeTag}>{node.type}</div>
              <button className={styles.nodeAction}>
                Details <FiChevronRight />
              </button>
            </div>

            <div className={styles.nodeGlow}></div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
