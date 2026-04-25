import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
  FiTruck, FiActivity, FiUsers, FiTrendingUp, FiServer, FiCheckCircle, FiAlertTriangle
} from 'react-icons/fi';
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import styles from './Overview.module.scss';

const ridershipData = [
  { time: '06:00', count: 1200 },
  { time: '08:00', count: 4500 },
  { time: '10:00', count: 3200 },
  { time: '12:00', count: 2800 },
  { time: '14:00', count: 3100 },
  { time: '16:00', count: 5200 },
  { time: '18:00', count: 6800 },
  { time: '20:00', count: 2400 },
];

const systemLogs = [
  { id: 1, type: 'info', msg: 'Sector 4: Route frequency optimized for rush hour', time: '14:23' },
  { id: 2, type: 'warning', msg: 'Maintenance Alert: Unit #B-201 sensor drift', time: '14:15' },
  { id: 3, type: 'success', msg: 'Batch billing sync: 12,402 transactions processed', time: '13:00' },
  { id: 4, type: 'error', msg: 'Critical: Database node 3 connection timeout', time: '12:45' },
  { id: 5, type: 'info', msg: 'New SIM Handover protocol deployed to fleet', time: '10:30' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    daily_revenue: 0,
    daily_passengers: 0,
    active_trips: 0,
    total_users: 0,
    peak_hours: []
  });
  const { admin } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);
  return (
    <DashboardLayout title="System Performance Overview">
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statIcon}><FiTruck /></div>
          <div className={styles.statData}>
            <span className={styles.label}>Live Fleet</span>
            <span className={styles.value}>{stats.active_trips} / 150</span>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statIcon}><FiUsers /></div>
          <div className={styles.statData}>
            <span className={styles.label}>Total Riders (Daily)</span>
            <span className={styles.value}>{stats.daily_passengers.toLocaleString()}</span>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statIcon}><FiActivity /></div>
          <div className={styles.statData}>
            <span className={styles.label}>Net Revenue (Today)</span>
            <span className={styles.value}>₼{stats.daily_revenue.toFixed(2)}</span>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statIcon}><FiServer /></div>
          <div className={styles.statData}>
            <span className={styles.label}>Total Users</span>
            <span className={styles.value}>{stats.total_users}</span>
          </div>
        </div>
      </div>

      <div className={styles.layoutGrid}>
        <div className={styles.leftCol}>
          <div className={styles.chartSection}>
            <div className={styles.sectionHeader}>
              <h3>Network Ridership Flow</h3>
            </div>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats.peak_hours.length > 0 ? stats.peak_hours : ridershipData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9FC73C" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#9FC73C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey={stats.peak_hours.length > 0 ? "hour" : "time"} stroke="#627d98" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#627d98" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#9FC73C', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey={stats.peak_hours.length > 0 ? "passengers" : "count"} stroke="#9FC73C" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.mapSection}>
            <div className={styles.mapPlaceholder}>
              <div className={styles.busDot} style={{ top: '35%', left: '45%' }}></div>
              <div className={styles.busDot} style={{ top: '55%', left: '65%' }}></div>
              <div className={styles.busDot} style={{ top: '25%', left: '15%' }}></div>
              <div className={styles.busDot} style={{ top: '75%', left: '30%' }}></div>
            </div>
            <div className={styles.mapOverlay}>
              <div className={styles.statusBadge}>
                <span className={styles.liveDot}></span> Live System View
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.systemHealth}>
            <h3>Node Status</h3>
            <div className={styles.healthList}>
              <div className={styles.healthItem}>
                <span>GPS Alpha</span>
                <span className={styles.status}>Active</span>
              </div>
              <div className={styles.healthItem}>
                <span>Payment Relays</span>
                <span className={styles.status}>Active</span>
              </div>
              <div className={styles.healthItem}>
                <span>Sector 4 Analytics</span>
                <span className={styles.status}>Active</span>
              </div>
            </div>
          </div>

          <div className={styles.logsSection}>
            <div className={styles.sectionHeader}>
              <h3>Recent Activity Logs</h3>
            </div>
            <div className={styles.logList}>
              {systemLogs.map((log) => (
                <div key={log.id} className={`${styles.logItem} ${styles[log.type]}`}>
                  <div className={styles.logIcon}>
                    {log.type === 'info' && <FiTrendingUp />}
                    {log.type === 'warning' && <FiAlertTriangle />}
                    {log.type === 'error' && <FiAlertTriangle />}
                    {log.type === 'success' && <FiCheckCircle />}
                  </div>
                  <div className={styles.logContent}>
                    <p>{log.msg}</p>
                    <span className={styles.time}>{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
