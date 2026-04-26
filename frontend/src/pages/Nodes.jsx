import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
  FiServer, FiCpu, FiWifi, FiActivity, FiSearch, 
  FiPlus, FiChevronRight, FiRefreshCw, FiX 
} from 'react-icons/fi';
import styles from './Nodes.module.scss';

export default function Nodes() {
  const [nodes, setNodes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', type: 'Əsas', ip_address: '' });

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/nodes`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search }
      });
      setNodes(res.data);
    } catch (err) {
      console.error('Error fetching nodes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNodes();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCreateNode = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/nodes`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setFormData({ id: '', name: '', type: 'Əsas', ip_address: '' });
      fetchNodes();
      toast.success('Qovşaq uğurla yaradıldı!');
    } catch (err) {
      console.error('Error creating node:', err);
      toast.error('Qovşaq yaradılarkən xəta baş verdi');
    }
  };

  return (
    <DashboardLayout title="Şəbəkə İnfrastrukturu">
      <div className={styles.pageHeader}>
        <div className={styles.searchBox}>
          <FiSearch />
          <input 
            type="text" 
            placeholder="Ad, ID və ya IP üzrə axtar..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.actions}>
          <button className={styles.btnGlass} onClick={fetchNodes}><FiRefreshCw /> Vəziyyəti Yenilə</button>
          <button className={styles.btnPrimary} onClick={() => setShowModal(true)}><FiPlus /> Yeni Qovşaq Yarat</button>
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
                  <span className={styles.nodeIp}>{node.ip_address}</span>
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
                  <div className={styles.fill} style={{ width: `${node.load_percent}%` }}></div>
                </div>
                <span className={styles.metricValue}>{node.load_percent}%</span>
              </div>
              
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>
                  <FiActivity /> ŞƏBƏKƏ AKTİVLİYİ
                </div>
                <span className={styles.metricValue}>{node.uptime || '0g 0s'}</span>
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
        {nodes.length === 0 && !loading && <p style={{ color: '#627d98', gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>Heç bir qovşaq tapılmadı.</p>}
      </div>

      {showModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <div className="modalHeader">
              <h3>Yeni Qovşaq Yarat</h3>
              <button onClick={() => setShowModal(false)} className="closeBtn"><FiX /></button>
            </div>
            <form onSubmit={handleCreateNode} className="modalForm">
              <div className="formGroup">
                <label>Qovşaq ID</label>
                <input required type="text" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} placeholder="Məs: NODE-06" />
              </div>
              <div className="formGroup">
                <label>Qovşaq Adı</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Məs: Sumqayıt Rele" />
              </div>
              <div className="formGroup">
                <label>Növü</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="Əsas">Əsas (Core)</option>
                  <option value="Köməkçi">Köməkçi (Edge)</option>
                  <option value="Lokal">Lokal (Local)</option>
                </select>
              </div>
              <div className="formGroup">
                <label>IP Ünvanı</label>
                <input required type="text" value={formData.ip_address} onChange={e => setFormData({...formData, ip_address: e.target.value})} placeholder="192.168.1.100" />
              </div>
              <button type="submit" className={styles.btnPrimary} style={{ marginTop: '1rem', width: '100%', padding: '1rem', justifyContent: 'center' }}>Yarat</button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
