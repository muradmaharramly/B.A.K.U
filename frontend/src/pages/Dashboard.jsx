import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
  FiTruck, FiActivity, FiUsers, FiTrendingUp, FiServer, FiCheckCircle, FiAlertTriangle
} from 'react-icons/fi';
import { FaBusSimple } from "react-icons/fa6";
import { MdDirectionsSubway } from "react-icons/md";
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Overview.module.scss';

const mapCenter = [40.4093, 49.8671];

export default function Dashboard() {
  const [stats, setStats] = useState({
    daily_revenue: 0,
    daily_passengers: 0,
    active_trips: 0,
    total_users: 0,
    peak_hours: []
  });
  const [logs, setLogs] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [fleet, setFleet] = useState([]);
  
  const { admin } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch stats
        const statsRes = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/stats`, { headers });
        setStats(statsRes.data);

        // Fetch logs (limit to 5)
        const logsRes = await axios.get(`${import.meta.env.VITE_API_URL}/logs`, { headers });
        setLogs(logsRes.data.slice(0, 5));

        // Fetch nodes (for system health)
        const nodesRes = await axios.get(`${import.meta.env.VITE_API_URL}/nodes`, { headers });
        setNodes(nodesRes.data.slice(0, 3));

        // Fetch fleet (for map)
        const fleetRes = await axios.get(`${import.meta.env.VITE_API_URL}/fleet`, { headers });
        setFleet(fleetRes.data);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };
    
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  // Parse location string to generic lat/lng for visualization if needed, or use mock spread around mapCenter
  const getMockPosition = (index) => {
    // Generate slight offset from map center to simulate fleet spread
    const offsetLat = (Math.random() - 0.5) * 0.05;
    const offsetLng = (Math.random() - 0.5) * 0.05;
    return [mapCenter[0] + offsetLat, mapCenter[1] + offsetLng];
  };

  return (
    <DashboardLayout title="Sistem Performansına Ümumi Baxış">
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statIcon}><FaBusSimple /></div>
          <div className={styles.statData}>
            <span className={styles.label}>Canlı Donanma</span>
            <span className={styles.value}>{fleet.length || stats.active_trips} / 150</span>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statIcon}><FiUsers /></div>
          <div className={styles.statData}>
            <span className={styles.label}>Cəmi Sərnişin (Gündəlik)</span>
            <span className={styles.value}>{stats.daily_passengers.toLocaleString()}</span>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statIcon}><FiActivity /></div>
          <div className={styles.statData}>
            <span className={styles.label}>Xalis Gəlir (Bugün)</span>
            <span className={styles.value}>₼{stats.daily_revenue.toFixed(2)}</span>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statIcon}><FiServer /></div>
          <div className={styles.statData}>
            <span className={styles.label}>Cəmi İstifadəçi</span>
            <span className={styles.value}>{stats.total_users}</span>
          </div>
        </div>
      </div>

      <div className={styles.dashboardLayout}>
        <div className={styles.mainCol}>
          <div className={styles.chartSection}>
            <div className={styles.sectionHeader}>
              <h3>Sərnişin Yükü (Son 24 Saat)</h3>
              <div className={styles.chartLegend}>
                <span className={styles.legendItem}><span className={styles.dotBus}></span>Avtobus</span>
                <span className={styles.legendItem}><span className={styles.dotMetro}></span>Metro</span>
              </div>
            </div>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.peak_hours}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9FC73C" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9FC73C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
                  <XAxis dataKey="hour" stroke="#A0AEC0" tick={{fill: '#A0AEC0'}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#A0AEC0" tick={{fill: '#A0AEC0'}} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #2D3748', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#9FC73C' }}
                  />
                  <Area type="monotone" dataKey="passengers" stroke="#9FC73C" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.quickActions}>
            <h3>Aktiv Marşrut Tıxacları</h3>
            <div className={styles.actionGrid}>
              <div className={styles.routeCard}>
                <div className={styles.rHeader}>
                  <div className={styles.rIcon}><FaBusSimple /></div>
                  <span className={styles.rNumber}>#140E</span>
                </div>
                <div className={styles.rDetails}>
                  <div className={styles.routeItem}>
                    <span>H. Aslanov m.</span>
                    <span className={styles.busy}>Yüksək Yük</span>
                  </div>
                  <div className={styles.routeItem}>
                    <span>Mərdəkan Qəs.</span>
                    <span className={styles.normal}>Normal</span>
                  </div>
                </div>
              </div>
              <div className={styles.routeCard}>
                <div className={styles.rHeader}>
                  <div className={styles.rIcon}><FaBusSimple /></div>
                  <span className={styles.rNumber}>#5</span>
                </div>
                <div className={styles.rDetails}>
                  <div className={styles.routeItem}>
                    <span>Nərimanov m.</span>
                    <span className={styles.normal}>Normal</span>
                  </div>
                  <div className={styles.routeItem}>
                    <span>28 May m.</span>
                    <span className={styles.busy}>Kritik</span>
                  </div>
                </div>
              </div>
              <div className={styles.routeCard}>
                <div className={styles.rHeader}>
                  <div className={styles.rIcon}><MdDirectionsSubway /></div>
                  <span className={styles.rNumber}>M1</span>
                </div>
                <div className={styles.rDetails}>
                  <div className={styles.routeItem}>
                    <span>Qırmızı Xətt</span>
                    <span className={styles.normal}>Gecikmə: 2 dəq</span>
                  </div>
                  <div className={styles.routeItem}>
                    <span>Bənövşəyi Xətt</span>
                    <span className={styles.busy}>Təmir</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.mapSection} style={{ overflow: 'hidden', position: 'relative' }}>
            <MapContainer center={mapCenter} zoom={12} style={{ height: '300px', width: '100%', borderRadius: '16px' }} zoomControl={false}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {fleet.map((bus, i) => (
                <CircleMarker 
                  key={bus.id} 
                  center={getMockPosition(i)} 
                  radius={8} 
                  fillColor="#9FC73C" 
                  color="#111" 
                  weight={2} 
                  fillOpacity={1}
                >
                  <Popup>{bus.route_number} - {bus.current_location}</Popup>
                </CircleMarker>
              ))}
            </MapContainer>
            <div className={styles.mapOverlay} style={{ pointerEvents: 'none' }}>
              <div className={styles.statusBadge}>
                <span className={styles.liveDot}></span> Canlı Sistem Baxışı
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.systemHealth}>
            <h3>Qovşaq Statusu</h3>
            <div className={styles.healthList}>
              {nodes.map(node => (
                <div key={node.id} className={styles.healthItem}>
                  <span>{node.name}</span>
                  <span className={styles.status} style={{ color: node.status === 'onlayn' ? '#9FC73C' : '#e53e3e' }}>{node.status}</span>
                </div>
              ))}
              {nodes.length === 0 && <span style={{color: '#627d98'}}>Qovşaq tapılmadı.</span>}
            </div>
          </div>

          <div className={styles.logsSection}>
            <div className={styles.sectionHeader}>
              <h3>Son Fəaliyyət Jurnalları</h3>
            </div>
            <div className={styles.logList}>
              {logs.map((log) => (
                <div key={log.id} className={`${styles.logItem} ${styles[log.level.toLowerCase()]}`}>
                  <div className={styles.logIcon}>
                    {log.level === 'INFO' && <FiTrendingUp />}
                    {log.level === 'WARN' && <FiAlertTriangle />}
                    {log.level === 'ERROR' && <FiAlertTriangle />}
                    {log.level === 'SUCCESS' && <FiCheckCircle />}
                  </div>
                  <div className={styles.logContent}>
                    <p>{log.message}</p>
                    <span className={styles.time}>{new Date(log.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
              {logs.length === 0 && <span style={{color: '#627d98'}}>Jurnal tapılmadı.</span>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
