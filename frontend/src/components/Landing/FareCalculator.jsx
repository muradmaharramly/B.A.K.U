import { useState, useEffect } from 'react';
import { FiMapPin, FiNavigation, FiInfo, FiTrendingDown, FiActivity, FiTag } from 'react-icons/fi';
import { MdDirectionsBus, MdDirectionsSubway } from 'react-icons/md';
import CustomDropdown from './CustomDropdown';
import { busRoutes, metroRoutes } from './transportData';
import styles from './FareCalculator.module.scss';

const plans = {
  standard: { label: 'Standart', multiplier: 1.0, base: 0.20, perStation: 0.05, max: 1.20 },
  family: { label: 'Ailə', multiplier: 0.8, base: 0.15, perStation: 0.04, max: 0.90 },
  tourist: { label: 'Turist', multiplier: 0.9, base: 0.18, perStation: 0.045, max: 1.00 }
};

export default function FareCalculator() {
  const [type, setType] = useState('metro');
  const [plan, setPlan] = useState('standard');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState(null);
  const [alternative, setAlternative] = useState(null);

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
      
      // Metro Tier Logic
      let fare = 0.40;
      if (minStations === 2) fare = 0.45;
      else if (minStations === 3) fare = 0.50;
      else if (minStations === 4) fare = 0.55;
      else if (minStations === 5) fare = 0.60;
      else if (minStations >= 6 && minStations <= 7) fare = 0.65;
      else if (minStations >= 8 && minStations <= 9) fare = 0.70;
      else if (minStations >= 10) fare = 0.75;

      const p = plans[plan];
      const finalFare = fare * p.multiplier;

      setResult({
        fare: finalFare.toFixed(2),
        distance: (minStations * 1.8).toFixed(1),
        stations: minStations,
        route: foundRouteName
      });
    } else {
      // Bus Logic
      busRoutes.forEach(r => {
        if (r.stops.includes(from) && r.stops.includes(to)) {
          const dist = Math.abs(r.stops.indexOf(to) - r.stops.indexOf(from));
          if (dist < minStations) {
            minStations = dist;
            foundRouteName = r.bus;
          }
        }
      });

      if (foundRouteName) {
        distanceKm = minStations * 2.2; // Avg km per bus stop
        let fare = 0.40;
        if (distanceKm >= 4 && distanceKm <= 6) fare = 0.50;
        else if (distanceKm >= 7 && distanceKm <= 10) fare = 0.60;
        else if (distanceKm >= 11 && distanceKm <= 15) fare = 0.70;
        else if (distanceKm > 15) fare = 0.80;

        const p = plans[plan];
        const finalFare = fare * p.multiplier;

        setResult({
          fare: finalFare.toFixed(2),
          distance: distanceKm.toFixed(1),
          stations: minStations,
          route: `Avtobus ${foundRouteName}`
        });
      }
    }

    // Alternative logic (Refined)
    const currentFare = result ? parseFloat(result.fare) : 0;
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
                  {Object.entries(plans).map(([key, p]) => (
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
              {result ? (
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
