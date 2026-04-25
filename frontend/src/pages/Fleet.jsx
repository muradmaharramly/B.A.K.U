import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { FiTruck, FiMapPin, FiActivity, FiSearch } from 'react-icons/fi';
import styles from './Fleet.module.scss';

const fleetData = [
  { id: 'BUS-101', route: 'R78', status: 'In Transit', statusLabel: 'Yoldadır', load: '65%', location: 'Nizami küç.', health: 'Optimal', healthLabel: 'Optimal' },
  { id: 'BUS-102', route: 'R140', status: 'Maintenance', statusLabel: 'Texniki Baxış', load: '0%', location: 'Depo A', health: 'Warning', healthLabel: 'Xəbərdarlıq' },
  { id: 'BUS-103', route: 'M2', status: 'In Transit', statusLabel: 'Yoldadır', load: '40%', location: 'Xətai', health: 'Optimal', healthLabel: 'Optimal' },
  { id: 'BUS-104', route: 'R78', status: 'Delayed', statusLabel: 'Gecikir', load: '85%', location: 'Azneft meyd.', health: 'Critical', healthLabel: 'Kritik' },
  { id: 'BUS-105', route: 'R140', status: 'In Transit', statusLabel: 'Yoldadır', load: '20%', location: '8km', health: 'Optimal', healthLabel: 'Optimal' },
];

export default function Fleet() {
  return (
    <DashboardLayout title="Donanma İdarəetmə">
      <div className={styles.pageHeader}>
        <div className={styles.searchBox}>
          <FiSearch />
          <input type="text" placeholder="Blok ID və ya Marşrut üzrə filtr..." />
        </div>
        <div className={styles.actions}>
          <button className={styles.btnPrimary}>Yeni Blok Yerləşdir</button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Blok ID</th>
              <th>Marşrut</th>
              <th>Status</th>
              <th>Yük</th>
              <th>Cari Məkan</th>
              <th>Vəziyyət</th>
              <th>Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {fleetData.map((unit) => (
              <tr key={unit.id}>
                <td><span className={styles.unitId}>{unit.id}</span></td>
                <td>{unit.route}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[unit.status.toLowerCase().replace(' ', '')]}`}>
                    {unit.statusLabel}
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
                    {unit.healthLabel}
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
