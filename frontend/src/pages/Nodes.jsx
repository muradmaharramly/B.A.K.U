import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
  FiServer, FiCpu, FiWifi, FiActivity, FiSearch, 
  FiPlus, FiChevronRight, FiRefreshCw 
} from 'react-icons/fi';
import styles from './Nodes.module.scss';

const nodes = [
  { id: 'NODE-01', name: 'Bakı Mərkəzi Rele', status: 'onlayn', uptime: '142g 4s', load: '12%', type: 'Əsas', ip: '192.168.1.1' },
  { id: 'NODE-02', name: 'Nizami Sektor Qovşağı', status: 'onlayn', uptime: '45g 12s', load: '45%', type: 'Kənari', ip: '192.168.4.12' },
  { id: 'NODE-03', name: 'Xətai Məlumat Qovşağı', status: 'gözləmədə', uptime: '12g 1s', load: '2%', type: 'Ehtiyat', ip: '10.0.0.5' },
  { id: 'NODE-04', name: 'Sumqayıt Bağlantısı', status: 'onlayn', uptime: '88g 19s', load: '68%', type: 'Kənari', ip: '172.16.0.44' },
  { id: 'NODE-05', name: 'Gəncə Giriş Qapısı', status: 'oflayn', uptime: '0g 0s', load: '0%', type: 'Kənari', ip: '192.168.10.1' },
];

export default function Nodes() {
  return (
    <DashboardLayout title="Şəbəkə İnfrastrukturu">
      <div className={styles.pageHeader}>
        <div className={styles.searchBox}>
          <FiSearch />
          <input type="text" placeholder="Ad, ID və ya IP üzrə axtar..." />
        </div>
        <div className={styles.actions}>
          <button className={styles.btnGlass}><FiRefreshCw /> Vəziyyəti Yenilə</button>
          <button className={styles.btnPrimary}><FiPlus /> Yeni Qovşaq Yarat</button>
        </div>
      </div>

      <div className={styles.nodesGrid}>
        {nodes.map((node) => (
          <div key={node.id} className={`${styles.nodeCard} ${styles[node.status === 'onlayn' ? 'online' : node.status === 'oflayn' ? 'offline' : 'standby']}`}>
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
                  <FiCpu /> CPU YÜKÜ
                </div>
                <div className={styles.metricBar}>
                  <div className={styles.fill} style={{ width: node.load }}></div>
                </div>
                <span className={styles.metricValue}>{node.load}</span>
              </div>
              
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>
                  <FiActivity /> ŞƏBƏKƏ AKTİVLİYİ
                </div>
                <span className={styles.metricValue}>{node.uptime}</span>
              </div>
            </div>

            <div className={styles.nodeFooter}>
              <div className={styles.nodeTag}>{node.type}</div>
              <button className={styles.nodeAction}>
                Təfərrüatlar <FiChevronRight />
              </button>
            </div>

            <div className={styles.nodeGlow}></div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
