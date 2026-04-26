import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
  FiMapPin, FiUsers, FiClock, FiSearch, FiActivity, 
  FiMap, FiX, FiFilter, FiRadio 
} from 'react-icons/fi';
import { FaBusAlt } from "react-icons/fa";
import CustomSelect from '../components/Common/CustomSelect';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Buses.module.scss';

const mapCenter = [40.4093, 49.8671];
const API_URL = import.meta.env.VITE_API_URL || 'https://baku-transit-backend.onrender.com/api';

export default function Buses() {
  const [allRoutes, setAllRoutes] = useState([]);
  const [routesByOperator, setRoutesByOperator] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('all');
  const [showMap, setShowMap] = useState(false);
  const [signalFilter, setSignalFilter] = useState('all'); // all, gps, sim, card

  // Mock density data for bus hubs/stops
  const [busActivity, setBusActivity] = useState([
    { id: 1, name: '28 May Terminal', coords: [40.3798, 49.8486], density: 90, gps: 45, sim: 30, card: 15 },
    { id: 2, name: 'Koroğlu Hub', coords: [40.4201, 49.9174], density: 80, gps: 30, sim: 35, card: 15 },
    { id: 3, name: 'Avtovağzal', coords: [40.4184, 49.7952], density: 65, gps: 25, sim: 25, card: 15 },
    { id: 4, name: 'Gənclik', coords: [40.4001, 49.8512], density: 55, gps: 20, sim: 20, card: 15 },
    { id: 5, name: 'Azneft dairəsi', coords: [40.3601, 49.8312], density: 40, gps: 15, sim: 15, card: 10 }
  ]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axios.get(`${API_URL}/routes`);
        const buses = res.data.filter(r => r.route_type === 'bus');
        setAllRoutes(buses);
        groupRoutes(buses, 'all');
      } catch (err) {
        console.error('Error fetching bus routes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const groupRoutes = (buses, operatorFilter) => {
    const filtered = operatorFilter === 'all' 
      ? buses 
      : buses.filter(r => r.operator_name === operatorFilter);

    const grouped = filtered.reduce((acc, route) => {
      if (!acc[route.operator_name]) acc[route.operator_name] = [];
      acc[route.operator_name].push(route);
      return acc;
    }, {});
    setRoutesByOperator(grouped);
  };

  const handleOperatorChange = (op) => {
    setSelectedOperator(op);
    groupRoutes(allRoutes, op);
  };

  const getMarkerRadius = (unit) => {
    if (signalFilter === 'all') return (unit.density || 0) * 0.4;
    if (signalFilter === 'gps') return (unit.gps || 0) * 0.8;
    if (signalFilter === 'sim') return (unit.sim || 0) * 0.8;
    if (signalFilter === 'card') return (unit.card || 0) * 1.5;
    return 10;
  };

  const getMarkerColor = (unit) => {
    const val = getMarkerRadius(unit);
    if (val > 30) return '#ef4444'; 
    if (val > 15) return '#f59e0b';
    return '#10b981';
  };

  if (loading) return (
    <DashboardLayout title="Avtobus Marşrutları">
      <div className={styles.loading}>
        Yüklənir...
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Avtobus Marşrutları">
      <div className={styles.pageHeader}>
        <div className={styles.searchBox}>
          <FiSearch />
          <input 
            type="text" 
            placeholder="Marşrut nömrəsi ilə axtar..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup} style={{ display: 'flex', gap: '10px' }}>
          <button 
            style={{ 
              background: 'rgba(159, 199, 60, 0.1)', 
              color: '#9FC73C', 
              border: '1px solid rgba(159, 199, 60, 0.2)',
              padding: '0 1.5rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setShowMap(true)}
          >
            <FiMap /> Xəritedə aktivliyə bax
          </button>
          <CustomSelect 
            options={[
              { value: 'all', label: 'Bütün Operatorlar' },
              ...Object.keys(allRoutes.reduce((acc, r) => { acc[r.operator_name] = true; return acc; }, {})).map(op => ({ value: op, label: op }))
            ]}
            value={selectedOperator}
            onChange={handleOperatorChange}
          />
        </div>
      </div>

      {Object.entries(routesByOperator).map(([operator, routes]) => {
        const filteredRoutes = routes.filter(r => r.route_number.includes(searchTerm));
        if (filteredRoutes.length === 0) return null;

        return (
          <div key={operator} className={styles.operatorSection}>
            <div className={styles.operatorHeader}>
              <div className={styles.operatorIcon}><FaBusAlt /></div>
              <div className={styles.operatorMeta}>
                <h2>{operator}</h2>
                <span className={styles.operatorSub}>Aktiv Fəaliyyətdə · Bakı Nəqliyyat Şəbəkəsi</span>
              </div>
              <div className={styles.routeCount}>
                <span className={styles.countNum}>{filteredRoutes.length}</span>
                <span className={styles.countLabel}>Marşrut</span>
              </div>
            </div>
            
            <div className={styles.fleetGrid}>
              {filteredRoutes.map((route) => (
                <div key={route.id} className={styles.unitCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.unitInfo}>
                      <div className={styles.iconBox}><FaBusAlt /></div>
                      <div>
                        <h3 className={styles.unitId}>Xətt #{route.route_number}</h3>
                        <span className={styles.unitType}>Bakı Şəhər Daxili</span>
                      </div>
                    </div>
                    <span className={`${styles.statusBadge} ${styles.normal}`}>Normal</span>
                  </div>

                  <div className={styles.metrics}>
                    <div className={styles.metric}>
                      <FiUsers />
                      <span>{Math.floor(Math.random() * 15) + 5} Aktiv Bölmə</span>
                    </div>
                    <div className={styles.metric}>
                      <FiClock />
                      <span>İnterval: {Math.floor(Math.random() * 5) + 4}-8 dəq</span>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.location}>
                      <FiMapPin />
                      <span>Canlı İzləmə Aktivdir</span>
                    </div>
                    <button className={styles.detailsBtn}>Xəritəyə Bax</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {showMap && (
        <div className="modalOverlay">
          <div className="modalContent" style={{ maxWidth: '900px', height: '600px', display: 'flex', flexDirection: 'column' }}>
            <div className="modalHeader">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiMap style={{ color: '#9FC73C' }} />
                <h3>Avtobus Şəbəkəsində Canlı Aktivlik</h3>
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
                {busActivity.map(unit => (
                  <CircleMarker 
                    key={unit.id}
                    center={unit.coords}
                    radius={getMarkerRadius(unit)}
                    fillColor={getMarkerColor(unit)}
                    color="#fff"
                    weight={1}
                    fillOpacity={0.6}
                  >
                    <Popup>
                      <div className={styles.popup}>
                        <strong>{unit.name}</strong><br/>
                        Sıxlıq: {unit.density}%<br/>
                        GPS: {unit.gps} siqnal<br/>
                        SIM: {unit.sim} cihaz<br/>
                        Ödəniş: {unit.card} keçid
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
