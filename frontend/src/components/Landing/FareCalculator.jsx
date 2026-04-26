import { useState, useEffect } from 'react';
import { FiMapPin, FiNavigation, FiInfo, FiTrendingDown, FiActivity, FiTag, FiAlertTriangle } from 'react-icons/fi';
import { MdDirectionsBus, MdDirectionsSubway } from 'react-icons/md';
import CustomDropdown from './CustomDropdown';
import { busRoutes, metroRoutes } from './transportData';
import styles from './FareCalculator.module.scss';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://baku-transit-backend.onrender.com/api';

export default function FareCalculator() {
  const [type, setType] = useState('metro');
  const [plan, setPlan] = useState('standard');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState(null);
  const [alternative, setAlternative] = useState(null);
  const [pricing, setPricing] = useState(null);

  // Fetch Pricing Data on mount
  useEffect(() => {
    let isMounted = true;
    const fetchPricing = async () => {
      try {
        const res = await axios.get(`${API_URL}/settings/pricing`);
        if (isMounted) setPricing(res.data);
      } catch (err) {
        // No need to spam console if backend handles the fallback
        console.warn("Pricing fetch failed, using internal defaults.");
      }
    };
    fetchPricing();
    return () => { isMounted = false; };
  }, []);

  const currentPlans = pricing?.plans || {
    standard: { label: 'Standart', multiplier: 1.0 },
    family: { label: 'Ailə', multiplier: 0.8 },
    tourist: { label: 'Turist', multiplier: 0.9 }
  };

  // Get unique stops based on transport type
  const getStops = () => {
    const stops = new Set();
    if (type === 'metro') {
      metroRoutes.forEach(r => r.stops.forEach(s => stops.add(s)));
    } else {
      busRoutes.forEach(r => r.stops.forEach(s => stops.add(s)));
    }
    return Array.from(stops).sort();
  };

  const stations = getStops();

  const calculateFare = async () => {
    if (!from || !to || from === to) {
      setResult(null);
      setAlternative(null);
      return;
    }

    let minStations = Infinity;
    let distanceKm = 0;

    if (type === 'metro') {
      const findMetroPath = (start, end) => {
        const getLine = (s) => metroRoutes.filter(r => r.stops.includes(s));
        const startLines = getLine(start);
        const endLines = getLine(end);
        for (const sL of startLines) {
          for (const eL of endLines) {
            if (sL.name === eL.name) return Math.abs(sL.stops.indexOf(end) - sL.stops.indexOf(start));
          }
        }
        const via28May = () => {
          const rL = metroRoutes.find(r => r.name === "Qırmızı Xətt");
          const gL = metroRoutes.find(r => r.name === "Yaşıl Xətt");
          let d1 = Infinity, d2 = Infinity;
          if (startLines.some(l => l.name === "Qırmızı Xətt")) d1 = Math.abs(rL.stops.indexOf(start) - rL.stops.indexOf("28 May"));
          if (startLines.some(l => l.name === "Yaşıl Xətt")) d1 = Math.abs(gL.stops.indexOf(start) - gL.stops.indexOf("28 May"));
          if (endLines.some(l => l.name === "Qırmızı Xətt")) d2 = Math.abs(rL.stops.indexOf(end) - rL.stops.indexOf("28 May"));
          if (endLines.some(l => l.name === "Yaşıl Xətt")) d2 = Math.abs(gL.stops.indexOf(end) - gL.stops.indexOf("28 May"));
          return d1 + d2;
        };
        const viaAjami = () => {
          const gL = metroRoutes.find(r => r.name === "Yaşıl Xətt");
          const pL = metroRoutes.find(r => r.name === "Bənövşəyi Xətt");
          let d1 = Infinity, d2 = Infinity;
          if (startLines.some(l => l.name === "Yaşıl Xətt")) d1 = Math.abs(gL.stops.indexOf(start) - gL.stops.indexOf("Memar Əcəmi"));
          if (startLines.some(l => l.name === "Bənövşəyi Xətt")) d1 = Math.abs(pL.stops.indexOf(start) - pL.stops.indexOf("Memar Əcəmi"));
          if (endLines.some(l => l.name === "Yaşıl Xətt")) d2 = Math.abs(gL.stops.indexOf(end) - gL.stops.indexOf("Memar Əcəmi"));
          if (endLines.some(l => l.name === "Bənövşəyi Xətt")) d2 = Math.abs(pL.stops.indexOf(end) - pL.stops.indexOf("Memar Əcəmi"));
          return d1 + d2;
        };
        return Math.min(via28May(), viaAjami());
      };

      minStations = findMetroPath(from, to);
      if (minStations !== Infinity) {
        let baseFare = 0.40;
        if (pricing?.metro_tiers) {
          for (const t of pricing.metro_tiers) {
            if (t.count && minStations === t.count) { baseFare = t.fare; break; }
            if (t.range && minStations >= t.range[0] && minStations <= t.range[1]) { baseFare = t.fare; break; }
            if (t.min && minStations >= t.min) { baseFare = t.fare; break; }
          }
        }
        const finalFare = baseFare * currentPlans[plan].multiplier;
        setResult({
          fare: finalFare.toFixed(2),
          distance: (minStations * 2.1).toFixed(1),
          stations: minStations,
          route: "Metro Şəbəkəsi"
        });

        // Alternative check (Metro -> Bus)
        const altBus = busRoutes.find(r => r.stops.includes(from) && r.stops.includes(to));
        if (altBus && finalFare > 0.40) {
          setAlternative({ route: altBus.bus, fare: (finalFare - 0.05).toFixed(2), savings: "0.05" });
        } else {
          setAlternative(null);
        }
      }
    } else {
      // Advanced Bus Logic with Google Maps Real Distance
      const findDirectBus = (start, end) => {
        let best = null;
        busRoutes.forEach(r => {
          if (r.stops.includes(start) && r.stops.includes(end)) {
            const dist = Math.abs(r.stops.indexOf(end) - r.stops.indexOf(start));
            if (!best || dist < best.dist) best = { dist, bus: r.bus };
          }
        });
        return best;
      };

      const direct = findDirectBus(from, to);
      if (direct) {
        try {
          const distRes = await axios.get(`${API_URL}/transit/distance?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
          distanceKm = distRes.data.distanceKm;
          let baseFare = 0.40;
          if (pricing?.bus_tiers) {
            for (const t of pricing.bus_tiers) {
              if (t.range && distanceKm >= t.range[0] && distanceKm <= t.range[1]) { baseFare = t.fare; break; }
              if (t.min && distanceKm >= t.min) { baseFare = t.fare; break; }
            }
          }
          let finalFare = Math.max(0.40, baseFare * currentPlans[plan].multiplier);
          let maxLimit = plan === 'family' ? 0.65 : 0.80;
          if (finalFare > maxLimit) finalFare = maxLimit;
          setResult({ 
            fare: finalFare.toFixed(2), 
            distance: distanceKm.toFixed(2), 
            stations: direct.dist, 
            route: `Avtobus ${direct.bus}`,
            isGoogle: true 
          });
        } catch (err) {
          distanceKm = direct.dist * 0.65;
          setResult({ 
            fare: '0.40', 
            distance: distanceKm.toFixed(2), 
            stations: direct.dist, 
            route: `Avtobus ${direct.bus}`,
            isGoogle: false 
          });
        }
      } else {
        let transfer = null;
        for (const r1 of busRoutes) {
          if (r1.stops.includes(from)) {
            for (const r2 of busRoutes) {
              if (r2.stops.includes(to)) {
                const intersect = r1.stops.find(s => r2.stops.includes(s));
                if (intersect) {
                  transfer = { r1: r1.bus, r2: r2.bus, via: intersect, dist: Math.abs(r1.stops.indexOf(intersect) - r1.stops.indexOf(from)) + Math.abs(r2.stops.indexOf(to) - r2.stops.indexOf(intersect)) };
                  break;
                }
              }
            }
          }
          if (transfer) break;
        }
        if (transfer) {
          setResult({ fare: (0.60 * currentPlans[plan].multiplier).toFixed(2), distance: (transfer.dist * 0.65).toFixed(2), stations: transfer.dist, route: `${transfer.r1} ➔ ${transfer.r2}`, transfer: transfer.via });
        } else {
          setResult({ error: 'Bu istiqamətdə birbaşa və ya keçidli marşrut tapılmadı.' });
        }
      }
    }
  };

  useEffect(() => {
    calculateFare();
  }, [from, to, plan, type]);

  useEffect(() => {
    setFrom('');
    setTo('');
    setResult(null);
    setAlternative(null);
  }, [type]);

  return (
    <section className={styles.calculatorSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <FiActivity /> <span>Canlı Hesablayıcı</span>
          </div>
          <h2>Yol Pulu <span>Hesabla</span></h2>
          <p>Gedəcəyiniz məsafəyə görə tam olaraq nə qədər ödəyəcəyinizi əvvəlcədən öyrənin.</p>
        </div>

        <div className={styles.calculatorCard}>
          <div className={styles.typeToggle}>
            <button 
              className={type === 'metro' ? styles.active : ''} 
              onClick={() => setType('metro')}
            >
              <MdDirectionsSubway /> Metro
            </button>
            <button 
              className={type === 'bus' ? styles.active : ''} 
              onClick={() => setType('bus')}
            >
              <MdDirectionsBus /> Avtobus
            </button>
          </div>

          <div className={styles.grid}>
            <div className={styles.inputs}>
              <div className={styles.field}>
                <label><FiTag /> Sizin Paket</label>
                <div className={styles.planSelect}>
                  {Object.entries(currentPlans).map(([key, p]) => (
                    <button 
                      key={key}
                      className={plan === key ? styles.activePlan : ''}
                      onClick={() => setPlan(key)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.routeFields}>
                <div className={styles.dropdownWrapper}>
                  <label>Haradan</label>
                  <CustomDropdown 
                    options={stations}
                    value={from}
                    onChange={setFrom}
                    placeholder="Başlanğıc stansiya"
                    icon={FiMapPin}
                  />
                </div>
                
                <div className={styles.connector}></div>
                
                <div className={styles.dropdownWrapper}>
                  <label>Haraya</label>
                  <CustomDropdown 
                    options={stations}
                    value={to}
                    onChange={setTo}
                    placeholder="Təyinat stansiyası"
                    icon={FiNavigation}
                  />
                </div>
              </div>
            </div>

            <div className={styles.results}>
              {result && !result.error ? (
                <div className={styles.resultDisplay}>
                  <div className={styles.routeBadge}>
                    {type === 'metro' ? <MdDirectionsSubway /> : <MdDirectionsBus />}
                    <span>Xətt: {result.route}</span>
                    {result.isGoogle && <div className={styles.googleBadge} title="Real Google Maps məsafəsi">Live</div>}
                  </div>
                  <div className={styles.mainFare}>
                    <span className={styles.currency}>₼</span>
                    <span className={styles.amount}>{result.fare}</span>
                  </div>
                  <div className={styles.stats}>
                    <div className={styles.statItem}>
                      <span className={styles.label}>Təxmini Məsafə</span>
                      <span className={styles.value}>{result.distance} km</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.label}>Dayanacaq Sayı</span>
                      <span className={styles.value}>{result.stations} st.</span>
                    </div>
                  </div>

                  {result.transfer && (
                    <div className={styles.transferAlert}>
                      <FiActivity />
                      <span><strong>{result.transfer}</strong> dayanacağında keçid edin.</span>
                    </div>
                  )}

                  {alternative && (
                    <div className={styles.alternativeCard}>
                      <div className={styles.altHeader}>
                        <FiTrendingDown /> <span>Daha munasib seçim!</span>
                      </div>
                      <p>
                        <strong>{alternative.route}</strong> nömrəli avtobus ilə 
                        <span> ₼{alternative.fare}</span>-ə qənaətlə gedə bilərsiniz.
                      </p>
                    </div>
                  )}
                </div>
              ) : result?.error ? (
                <div className={styles.errorDisplay}>
                  <FiAlertTriangle />
                  <p>{result.error}</p>
                </div>
              ) : (
                <div className={styles.placeholder}>
                  <FiInfo />
                  <p>Stansiyaları seçərək gediş haqqını və ən yaxşı marşrutu öyrənin</p>
                  {from && !to && <span className={styles.hint}>İndi isə təyinat nöqtəsini seçin</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
