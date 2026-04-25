import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import styles from './Analytics.module.scss';

const data = [
  { name: 'Mon', revenue: 4000, riders: 2400 },
  { name: 'Tue', revenue: 3000, riders: 1398 },
  { name: 'Wed', revenue: 2000, riders: 9800 },
  { name: 'Thu', revenue: 2780, riders: 3908 },
  { name: 'Fri', revenue: 1890, riders: 4800 },
  { name: 'Sat', revenue: 2390, riders: 3800 },
  { name: 'Sun', revenue: 3490, riders: 4300 },
];

export default function Analytics() {
  return (
    <DashboardLayout title="System Analytics">
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statData}>
            <span className={styles.label}>Avg. Trip Distance</span>
            <span className={styles.value}>8.4 km</span>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statData}>
            <span className={styles.label}>Peak Hour Load</span>
            <span className={styles.value}>92%</span>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statData}>
            <span className={styles.label}>Active Vouchers</span>
            <span className={styles.value}>1,204</span>
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statData}>
            <span className={styles.label}>Error Rate</span>
            <span className={styles.value}>0.02%</span>
          </div>
        </div>
      </div>

      <div className={styles.layoutGrid}>
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>Weekly Revenue vs Ridership</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#627d98" />
                <YAxis stroke="#627d98" />
                <Tooltip 
                  contentStyle={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <Bar dataKey="revenue" fill="#9FC73C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="riders" fill="#0d2840" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>System Load Projection</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#627d98" />
                <YAxis stroke="#627d98" />
                <Tooltip 
                  contentStyle={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#9FC73C" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
