import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import CustomSelect from '../components/Common/CustomSelect';
import { MdDirectionsSubway } from 'react-icons/md';
import { 
  FiMapPin, FiUsers, FiClock, FiSearch, FiActivity, 
  FiChevronDown, FiChevronUp, FiMap, FiX, FiFilter, FiRadio 
} from 'react-icons/fi';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Metro.module.scss';

const mapCenter = [40.4093, 49.8671];

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
  const [showMap, setShowMap] = useState(false);
  const [signalFilter, setSignalFilter] = useState('all'); // all, gps, sim, card

  // Mock density data for stations
  const [stationActivity, setStationActivity] = useState([
    { id: 1, name: '28 May', coords: [40.3798, 49.8486], density: 85, gps: 40, sim: 30, card: 15 },
    { id: 2, name: 'Koroğlu', coords: [40.4201, 49.9174], density: 70, gps: 20, sim: 35, card: 15 },
    { id: 3, name: 'İçərişəhər', coords: [40.3661, 49.8312], density: 45, gps: 15, sim: 15, card: 15 },
    { id: 4, name: 'Nərimanov', coords: [40.4032, 49.8712], density: 60, gps: 25, sim: 20, card: 15 },
    { id: 5, name: 'Həzi Aslanov', coords: [40.3731, 49.9535], density: 50, gps: 10, sim: 20, card: 20 }
  ]);

  const fetchLines = async () => {
    try {
      const res = await axios.get(`${API_URL}/metro/lines`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setLines(res.data);
      }
    } catch (err) {
      console.warn('Using fallback data for metro lines.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLines();
  }, []);

  const getMarkerRadius = (station) => {
    if (signalFilter === 'all') return station.density * 0.4;
    if (signalFilter === 'gps') return station.gps * 0.8;
    if (signalFilter === 'sim') return station.sim * 0.8;
    if (signalFilter === 'card') return station.card * 1.5;
    return 10;
  };

  const getMarkerColor = (station) => {
    const val = getMarkerRadius(station);
    if (val > 30) return '#ef4444'; // High density
    if (val > 15) return '#f59e0b'; // Medium
    return '#10b981'; // Low
  };

  if (loading) return <DashboardLayout title="Metro Xətləri"><div className={styles.loading}>Yüklənir...</div></DashboardLayout>;
  return (
    <DashboardLayout title="Metro Xətləri və Stansiyalar">
      <div className={styles.pageHeader}>
        <div className={styles.searchBox}>
          <FiSearch />
          <input type="text" placeholder="Stansiya və ya xətt axtar..." />
        </div>
        <button className={styles.mapBtn} onClick={() => setShowMap(true)}>
          <FiMap /> Xəritedə aktivliyə bax
        </button>
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

      {showMap && (
        <div className="modalOverlay">
          <div className="modalContent" style={{ maxWidth: '900px', height: '600px', display: 'flex', flexDirection: 'column' }}>
            <div className="modalHeader">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiMap style={{ color: '#9FC73C' }} />
                <h3>Metro Şəbəkəsində Canlı Aktivlik</h3>
              </div>
              <button onClick={() => setShowMap(false)} className="closeBtn"><FiX /></button>
            </div>
            
            <div className={styles.mapControls}>
              <div className={styles.filterTitle}><FiFilter /> Siqnal Mənbəyi:</div>
              <div className={styles.dropdownFilter}>
                <CustomSelect 
                  options={[
                    { value: 'all', label: 'Ümumi Sıxlıq' },
                    { value: 'gps', label: 'GPS Siqnalları' },
                    { value: 'sim', label: 'SIM Kart Siqnalları' },
                    { value: 'card', label: 'Kart Keçidləri' }
                  ]}
                  value={signalFilter}
                  onChange={setSignalFilter}
                />
              </div>
            </div>

            <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
              <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; OpenStreetMap'
                />
                {stationActivity.map(station => (
                  <CircleMarker 
                    key={station.id}
                    center={station.coords}
                    radius={getMarkerRadius(station)}
                    fillColor={getMarkerColor(station)}
                    color="#fff"
                    weight={1}
                    fillOpacity={0.6}
                  >
                    <Popup>
                      <div className={styles.popup}>
                        <strong>{station.name} stansiyası</strong><br/>
                        Sıxlıq: {station.density}%<br/>
                        GPS: {station.gps} siqnal<br/>
                        SIM: {station.sim} cihaz<br/>
                        Ödəniş: {station.card} keçid
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
