import { useState, useEffect } from 'react';
import { FiMapPin, FiNavigation, FiInfo, FiTrendingDown, FiActivity, FiTag, FiAlertTriangle } from 'react-icons/fi';
import { MdDirectionsBus, MdDirectionsSubway } from 'react-icons/md';
import CustomDropdown from './CustomDropdown';
import { busRoutes, metroRoutes } from './transportData';
import styles from './FareCalculator.module.scss';

import axios from 'axios';

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
    const fetchPricing = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/settings/pricing`);
        setPricing(res.data);
      } catch (err) {
        console.error("Failed to fetch pricing, using fallback:", err);
        // Fallback data to prevent blank screen
        setPricing({
          plans: {
            standard: { label: 'Standart', multiplier: 1.0 },
            family: { label: 'Ailə', multiplier: 0.8 },
            tourist: { label: 'Turist', multiplier: 0.9 }
          },
          metro_tiers: [
            { count: 1, fare: 0.40 }, { count: 2, fare: 0.45 }, { count: 3, fare: 0.50 },
            { count: 4, fare: 0.55 }, { count: 5, fare: 0.60 }, { range: [6, 7], fare: 0.65 },
            { range: [8, 9], fare: 0.70 }, { min: 10, fare: 0.75 }
          ],
          bus_tiers: [
            { range: [0, 1.5], fare: 0.40 }, { range: [1.6, 2.5], fare: 0.45 },
            { range: [2.6, 4], fare: 0.50 }, { range: [4.1, 6], fare: 0.55 },
            { range: [6.1, 8], fare: 0.60 }, { range: [8.1, 10], fare: 0.65 },
            { range: [10.1, 13], fare: 0.70 }, { range: [13.1, 16], fare: 0.75 },
            { min: 16.1, fare: 0.80 }
          ]
        });
      }
    };
    fetchPricing();
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

  const calculateFare = () => {
    if (!from || !to || from === to) {
      setResult(null);
      setAlternative(null);
      return;
    }

    let minStations = Infinity;
    let foundRouteName = "";
    let distanceKm = 0;

    if (type === 'metro') {
      // Find the best path in Metro (supporting transfers)
      const findMetroPath = (start, end) => {
        // Simple logic for the 3 lines and transfer points (28 May, Memar Ajami)
        const getLine = (station) => metroRoutes.filter(r => r.stops.includes(station));
        const startLines = getLine(start);
        const endLines = getLine(end);

        // 1. Same line
        for (const sL of startLines) {
          for (const eL of endLines) {
            if (sL.name === eL.name) {
              return Math.abs(sL.stops.indexOf(end) - sL.stops.indexOf(start));
            }
          }
        }

        // 2. Transfer via 28 May (Red <-> Green)
        const via28May = () => {
          const redLine = metroRoutes.find(r => r.name === "Qırmızı Xətt");
          const greenLine = metroRoutes.find(r => r.name === "Yaşıl Xətt");
          
          let d1 = Infinity, d2 = Infinity;
          if (startLines.some(l => l.name === "Qırmızı Xətt")) d1 = Math.abs(redLine.stops.indexOf(start) - redLine.stops.indexOf("28 May"));
          if (startLines.some(l => l.name === "Yaşıl Xətt")) d1 = Math.abs(greenLine.stops.indexOf(start) - greenLine.stops.indexOf("28 May"));
          
          if (endLines.some(l => l.name === "Qırmızı Xətt")) d2 = Math.abs(redLine.stops.indexOf(end) - redLine.stops.indexOf("28 May"));
          if (endLines.some(l => l.name === "Yaşıl Xətt")) d2 = Math.abs(greenLine.stops.indexOf(end) - greenLine.stops.indexOf("28 May"));
          
          return d1 + d2;
        };

        // 3. Transfer via Memar Ajami (Green <-> Purple)
        const viaAjami = () => {
          const greenLine = metroRoutes.find(r => r.name === "Yaşıl Xətt");
          const purpleLine = metroRoutes.find(r => r.name === "Bənövşəyi Xətt");
          
          let d1 = Infinity, d2 = Infinity;
          if (startLines.some(l => l.name === "Yaşıl Xətt")) d1 = Math.abs(greenLine.stops.indexOf(start) - greenLine.stops.indexOf("Memar Əcəmi"));
          if (startLines.some(l => l.name === "Bənövşəyi Xətt")) d1 = Math.abs(purpleLine.stops.indexOf(start) - purpleLine.stops.indexOf("Memar Əcəmi"));
          
          if (endLines.some(l => l.name === "Yaşıl Xətt")) d2 = Math.abs(greenLine.stops.indexOf(end) - greenLine.stops.indexOf("Memar Əcəmi"));
          if (endLines.some(l => l.name === "Bənövşəyi Xətt")) d2 = Math.abs(purpleLine.stops.indexOf(end) - purpleLine.stops.indexOf("Memar Əcəmi"));
          
          return d1 + d2;
        };

        return Math.min(via28May(), viaAjami());
      };

      minStations = findMetroPath(from, to);
      foundRouteName = "Metro Şəbəkəsi";
      
      // Dynamic Metro Tier Logic from DB
      let fare = 0.40; // Default
      if (pricing?.metro_tiers) {
        for (const tier of pricing.metro_tiers) {
          if (tier.count === minStations) { fare = tier.fare; break; }
          if (tier.range && minStations >= tier.range[0] && minStations <= tier.range[1]) { fare = tier.fare; break; }
          if (tier.min && minStations >= tier.min) { fare = tier.fare; break; }
        }
      }

      const p = currentPlans[plan];
      const finalFare = fare * p.multiplier;

      setResult({
        fare: finalFare.toFixed(2),
        distance: (minStations * 1.8).toFixed(1),
        stations: minStations,
        route: foundRouteName
      });
    } else {
      // Advanced Bus Logic with Transfer Support
      const findDirectBus = (start, end) => {
        let best = null;
        busRoutes.forEach(r => {
          if (r.stops.includes(start) && r.stops.includes(end)) {
            const dist = Math.abs(r.stops.indexOf(end) - r.stops.indexOf(start));
            if (!best || dist < best.dist) {
              best = { dist, bus: r.bus };
            }
          }
        });
        return best;
      };

      const direct = findDirectBus(from, to);

      if (direct) {
        minStations = direct.dist;
        foundRouteName = direct.bus;
        distanceKm = minStations * 0.65;
        
        let baseFare = 0.40;
        if (pricing?.bus_tiers) {
          for (const tier of pricing.bus_tiers) {
            if (tier.range && distanceKm >= tier.range[0] && distanceKm <= tier.range[1]) { baseFare = tier.fare; break; }
            if (tier.min && distanceKm >= tier.min) { baseFare = tier.fare; break; }
          }
        }

        const p = currentPlans[plan];
        let finalFare = Math.max(0.40, baseFare * p.multiplier);
        let maxLimit = plan === 'family' ? 0.65 : 0.80;
        if (finalFare > maxLimit) finalFare = maxLimit;

        setResult({
          fare: finalFare.toFixed(2),
          distance: distanceKm.toFixed(2),
          stations: minStations,
          route: `Avtobus ${foundRouteName}`
        });
      } else {
        // Try finding a 1-transfer connection
        let transferFound = null;
        for (const r1 of busRoutes) {
          if (r1.stops.includes(from)) {
            for (const r2 of busRoutes) {
              if (r2.stops.includes(to)) {
                // Find intersection stop
                const intersection = r1.stops.find(s => r2.stops.includes(s));
                if (intersection) {
                  const d1 = Math.abs(r1.stops.indexOf(intersection) - r1.stops.indexOf(from));
                  const d2 = Math.abs(r2.stops.indexOf(to) - r2.stops.indexOf(intersection));
                  transferFound = { r1: r1.bus, r2: r2.bus, via: intersection, dist: d1 + d2 };
                  break;
                }
              }
            }
          }
          if (transferFound) break;
        }

        if (transferFound) {
          minStations = transferFound.dist;
          distanceKm = minStations * 0.65;
          let finalFare = Math.max(0.40, 0.60 * (currentPlans[plan].multiplier)); // Fixed fare for transfer trips
          
          setResult({
            fare: finalFare.toFixed(2),
            distance: distanceKm.toFixed(2),
            stations: minStations,
            route: `${transferFound.r1} ➔ ${transferFound.r2}`,
            transfer: transferFound.via
          });
        } else {
          setResult({ error: 'Bu istiqamətdə birbaşa və ya keçidli marşrut tapılmadı.' });
        }
      }
    }

    // Alternative logic (Refined)
    const currentFare = result?.fare ? parseFloat(result.fare) : 0;
    if (type === 'metro' && currentFare > 0.40) {
      const altBus = busRoutes.find(r => r.stops.includes(from) && r.stops.includes(to));
      if (altBus) {
        const potentialSavings = 0.05; 
        let busFare = currentFare - potentialSavings;
        if (busFare < 0.40) busFare = 0.40;
        
        const actualSavings = currentFare - busFare;
        if (actualSavings >= 0.04) {
          setAlternative({
            type: 'bus',
            route: altBus.bus,
            fare: busFare.toFixed(2),
            savings: actualSavings.toFixed(2)
          });
        } else {
          setAlternative(null);
        }
      } else {
        setAlternative(null);
      }
    } else {
      setAlternative(null);
    }
  };

  useEffect(() => {
    calculateFare();
  }, [from, to, plan, type]);

  // Reset selections when type changes
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
