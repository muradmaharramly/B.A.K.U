import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { FiTruck, FiMapPin, FiActivity, FiSearch, FiX } from 'react-icons/fi';
import styles from './Fleet.module.scss';

const statusMap = {
  'In Transit': { label: 'Yoldadır', class: 'intransit' },
  'Maintenance': { label: 'Texniki Baxış', class: 'maintenance' },
  'Delayed': { label: 'Gecikir', class: 'delayed' }
};

const healthMap = {
  'Optimal': 'Optimal',
  'Warning': 'Xəbərdarlıq',
  'Critical': 'Kritik'
};

const API_URL = import.meta.env.VITE_API_URL || 'https://baku-transit-backend.onrender.com/api';

export default function Fleet() {
  const [fleet, setFleet] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', route_number: '', current_location: '' });

  const fetchFleet = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/fleet`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search }
      });
      setFleet(res.data);
    } catch (err) {
      console.error('Error fetching fleet:', err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFleet();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCreateUnit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/fleet`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setFormData({ id: '', route_number: '', current_location: '' });
      fetchFleet();
      toast.success('Blok uğurla yerləşdirildi!');
    } catch (err) {
      console.error('Error creating fleet unit:', err);
      toast.error('Blok yaradılarkən xəta baş verdi');
    }
  };

  return (
    <DashboardLayout title="Donanma İdarəetmə">
      <div className={styles.pageHeader}>
        <div className={styles.searchBox}>
          <FiSearch />
          <input 
            type="text" 
            placeholder="Blok ID və ya Marşrut üzrə filtr..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={() => setShowModal(true)}>Yeni Blok Yerləşdir</button>
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
            {fleet.map((unit) => {
              const statusInfo = statusMap[unit.status] || { label: unit.status, class: 'intransit' };
              const healthLabel = healthMap[unit.health_status] || unit.health_status;
              return (
                <tr key={unit.id}>
                  <td><span className={styles.unitId}>{unit.id}</span></td>
                  <td>{unit.route_number}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[(statusInfo.class || 'intransit').toLowerCase()]}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td>
                    <div className={styles.progressWrapper}>
                      <div className={styles.progressBar} style={{ width: `${unit.load_percent || 0}%` }}></div>
                      <span>{unit.load_percent || 0}%</span>
                    </div>
                  </td>
                  <td>{unit.current_location || 'Naməlum'}</td>
                  <td>
                    <span className={`${styles.healthText} ${styles[(unit.health_status || 'Optimal').toLowerCase()]}`}>
                      {healthLabel || 'Optimal'}
                    </span>
                  </td>
                  <td>
                    <button className={styles.btnIcon}><FiActivity /></button>
                    <button className={styles.btnIcon}><FiMapPin /></button>
                  </td>
                </tr>
              );
            })}
            {fleet.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#627d98' }}>Heç bir donanma bloku tapılmadı.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <div className="modalHeader">
              <h3>Yeni Blok Yerləşdir</h3>
              <button onClick={() => setShowModal(false)} className="closeBtn"><FiX /></button>
            </div>
            <form onSubmit={handleCreateUnit} className="modalForm">
              <div className="formGroup">
                <label>Blok ID</label>
                <input required type="text" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} placeholder="Məs: BUS-106" />
              </div>
              <div className="formGroup">
                <label>Marşrut Nömrəsi</label>
                <input required type="text" value={formData.route_number} onChange={e => setFormData({...formData, route_number: e.target.value})} placeholder="Məs: R78" />
              </div>
              <div className="formGroup">
                <label>Cari Məkan</label>
                <input required type="text" value={formData.current_location} onChange={e => setFormData({...formData, current_location: e.target.value})} placeholder="Məs: Koroğlu" />
              </div>
              <button type="submit" className={styles.btnPrimary} style={{ marginTop: '1rem', width: '100%', padding: '1rem', justifyContent: 'center' }}>Yerləşdir</button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
