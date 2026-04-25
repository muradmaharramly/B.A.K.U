import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { FiMapPin, FiUsers, FiClock, FiSearch, FiActivity } from 'react-icons/fi';
import { FaBusAlt } from "react-icons/fa";
import CustomSelect from '../components/Common/CustomSelect';
import styles from './Buses.module.scss';

export default function Buses() {
  const [allRoutes, setAllRoutes] = useState([]);
  const [routesByOperator, setRoutesByOperator] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('all');

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/routes`);
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
        <div className={styles.filterGroup}>
          <select 
            className={styles.filterSelect}
            value={selectedOperator}
            onChange={(e) => handleOperatorChange(e.target.value)}
          >
            <option value="all">Bütün Operatorlar</option>
            {Object.keys(allRoutes.reduce((acc, r) => { acc[r.operator_name] = true; return acc; }, {})).map(op => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
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
    </DashboardLayout>
  );
}
