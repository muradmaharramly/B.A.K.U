import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { FiTruck, FiMapPin, FiActivity, FiSearch } from 'react-icons/fi';
import styles from './Fleet.module.scss';

const fleetData = [
  { id: 'BUS-101', route: 'R78', status: 'In Transit', load: '65%', location: 'Nizami St.', health: 'Optimal' },
  { id: 'BUS-102', route: 'R140', status: 'Maintenance', load: '0%', location: 'Depot A', health: 'Warning' },
  { id: 'BUS-103', route: 'M2', status: 'In Transit', load: '40%', location: 'Xətai', health: 'Optimal' },
  { id: 'BUS-104', route: 'R78', status: 'Delayed', load: '85%', location: 'Azneft Sq.', health: 'Critical' },
  { id: 'BUS-105', route: 'R140', status: 'In Transit', load: '20%', location: '8km', health: 'Optimal' },
];

export default function Fleet() {
  return (
    <DashboardLayout title="Fleet Management">
      <div className={styles.pageHeader}>
        <div className={styles.searchBox}>
          <FiSearch />
          <input type="text" placeholder="Filter by Unit ID or Route..." />
        </div>
        <div className={styles.actions}>
          <button className={styles.btnPrimary}>Deploy New Unit</button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Unit ID</th>
              <th>Route</th>
              <th>Status</th>
              <th>Load</th>
              <th>Current Location</th>
              <th>Health</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fleetData.map((unit) => (
              <tr key={unit.id}>
                <td><span className={styles.unitId}>{unit.id}</span></td>
                <td>{unit.route}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[unit.status.toLowerCase().replace(' ', '')]}`}>
                    {unit.status}
                  </span>
                </td>
                <td>
                  <div className={styles.progressWrapper}>
                    <div className={styles.progressBar} style={{ width: unit.load }}></div>
                    <span>{unit.load}</span>
                  </div>
                </td>
                <td>{unit.location}</td>
                <td>
                  <span className={`${styles.healthText} ${styles[unit.health.toLowerCase()]}`}>
                    {unit.health}
                  </span>
                </td>
                <td>
                  <button className={styles.btnIcon}><FiActivity /></button>
                  <button className={styles.btnIcon}><FiMapPin /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
