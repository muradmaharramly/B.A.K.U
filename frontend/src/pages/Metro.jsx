import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { MdDirectionsSubway } from 'react-icons/md';
import { FiMapPin, FiUsers, FiClock, FiSearch, FiActivity, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import styles from './Metro.module.scss';

const hexToRgb = (hex) => {
  if (!hex) return '255, 255, 255';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

const API_URL = import.meta.env.VITE_API_URL || 'https://baku-transit-backend.onrender.com/api';

export default function Metro() {
  const [lines, setLines] = useState([]);
  const [expandedLine, setExpandedLine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLines = async () => {
      try {
        const res = await axios.get(`${API_URL}/metro/lines`);
        setLines(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching metro lines:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLines();
  }, []);

  if (loading) return <DashboardLayout title="Metro Xətləri"><div className={styles.loading}>Yüklənir...</div></DashboardLayout>;
  return (
    <DashboardLayout title="Metro Xətləri və Stansiyalar">
      <div className={styles.pageHeader}>
        <div className={styles.searchBox}>
          <FiSearch />
          <input type="text" placeholder="Stansiya və ya xətt axtar..." />
        </div>
      </div>

      <div className={styles.fleetGrid}>
        {(Array.isArray(lines) ? lines : []).map((line) => (
          <div key={line.id} className={styles.unitCard} style={{ color: line.color }}>
            <div className={styles.cardHeader}>
              <div className={styles.unitInfo}>
                <div 
                  className={styles.iconBox} 
                  style={{ 
                    color: line.color, 
                    borderColor: line.color,
                    '--line-shadow': `rgba(${hexToRgb(line.color)}, 0.3)`
                  }}
                >
                  <MdDirectionsSubway />
                </div>
                <div>
                  <h3 className={styles.unitId}>{line.name}</h3>
                  <span className={styles.unitType}>
                    {line.stations[0].name} - {line.stations[line.stations.length - 1].name}
                  </span>
                </div>
              </div>
              <span className={`${styles.statusBadge} ${styles.normal}`}>
                Aktiv
              </span>
            </div>

            <div className={styles.metrics}>
              <div className={styles.metric}>
                <FiActivity />
                <span>{Math.floor(Math.random() * 5) + 10} Qatar Hərəkətdə</span>
              </div>
              <div className={styles.metric}>
                <FiClock />
                <span>Pik İnterval: 2-3 dəq</span>
              </div>
            </div>

            {expandedLine === line.id && (
              <div className={styles.stationsList}>
                <h4>Stansiyalar</h4>
                <div className={styles.stationsScroll}>
                  {(Array.isArray(line.stations) ? line.stations : []).map((s, idx) => (
                    <div key={s.id} className={styles.stationItem}>
                      <span className={styles.dot} style={{ background: line.color }}></span>
                      <span className={styles.stationName}>{s.name}</span>
                      {idx < line.stations.length - 1 && <span className={styles.line} style={{ background: line.color }}></span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.cardFooter}>
              <div className={styles.location}>
                <FiMapPin />
                <span>Bakı Metropoliteni</span>
              </div>
              <button 
                className={styles.detailsBtn}
                onClick={() => setExpandedLine(expandedLine === line.id ? null : line.id)}
              >
                {expandedLine === line.id ? <><FiChevronUp /> Bağla</> : <><FiChevronDown /> Stansiyalar</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
