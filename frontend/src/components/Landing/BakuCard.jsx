import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCompass, FiRefreshCw, FiZap, FiShield, FiCpu } from 'react-icons/fi';
import styles from './BakuCard.module.scss';

const mockTransactions = [
  { id: 1, route: 'Avtobus 78', distance: '4.2 km', fare: '₼0.50', time: '14:23', type: 'fare' },
  { id: 2, route: 'Metro — 28 May → Koroğlu', distance: '6.8 km', fare: '₼0.80', time: '11:05', type: 'fare' },
  { id: 3, route: 'Balans Artımı', distance: '—', fare: '+₼10.00', time: '09:30', type: 'topup' },
  { id: 4, route: 'Avtobus 140', distance: '2.1 km', fare: '₼0.30', time: 'Dünən', type: 'fare' },
  { id: 5, route: 'Vauçer İstifadəsi', distance: '—', fare: '₼0.00', time: '22 Apr', type: 'voucher' },
];

export default function BakuCard() {
  const [flipped, setFlipped] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (flipped) return;
    const card = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - card.top) / card.height - 0.5;
    const y = (e.clientX - card.left) / card.width - 0.5;
    setRotate({ x: x * 20, y: -y * 20 });
  };

  return (
    <section className={styles.section} id="baku-card">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}><FiCompass /> B.A.K.U Ekosistemi</span>
          <h2 className={styles.title}>
            Ağıllı <span className={styles.highlight}>Rəqəmsal ID</span>
          </h2>
          <p className={styles.subtitle}>
            Bütün nəqliyyat üçün vahid ID. Qüsursuz, təhlükəsiz və dəqiq məsafə izləmə.
          </p>
        </div>

        <div className={styles.sceneContainer}>
          {/* Floating Elements */}
          <div className={`${styles.floatingElement} ${styles.left}`}>
            <div className={styles.floatCard}>
              <FiZap />
              <span>Sinxronizasiya</span>
            </div>
          </div>
          <div className={`${styles.floatingElement} ${styles.right}`}>
            <div className={styles.floatCard}>
              <FiShield />
              <span>Təhlükəsiz ID</span>
            </div>
          </div>

          <div className={styles.cardScene}>
            <motion.div
              className={styles.cardBody}
              onClick={() => {
                setFlipped(!flipped);
                setRotate({ x: 0, y: 0 });
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setRotate({ x: 0, y: 0 })}
              animate={{ 
                rotateY: flipped ? 180 : rotate.y,
                rotateX: flipped ? 0 : rotate.x,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Front */}
              <div className={styles.front}>
                <div className={styles.cardGlow}></div>
                <div className={styles.cardReflect}></div>
                
                <div className={styles.topRow}>
                  <div className={styles.chip}>
                    <FiCpu className={styles.chipIcon} />
                  </div>
                  <div className={styles.cardLogo}>B.A.K.U</div>
                </div>

                <div className={styles.mainInfo}>
                  <div className={styles.infoGroup}>
                    <span className={styles.value}>ƏLİ MƏMMƏDOV</span>
                  </div>
                  
                  <div className={styles.infoGroup}>
                    <span className={styles.tierValue}>VƏTƏNDAŞ — STANDART</span>
                  </div>
                </div>

                <div className={styles.bottomRow}>
                  <div className={styles.idInfo}>
                    <span className={styles.label}>ID:</span>
                    <span className={styles.idValue}>BK-990421-X</span>
                  </div>
                </div>
              </div>

              {/* Back */}
              <div className={styles.back}>
                <div className={styles.backHeader}>
                  <h4>Son Əməliyyatlar</h4>
                </div>
                <ul className={styles.txList}>
                  {mockTransactions.map((tx) => (
                    <li key={tx.id} className={styles.txItem}>
                      <div className={styles.txLeft}>
                        <span className={`${styles.txDot} ${styles[tx.type]}`}></span>
                        <div>
                          <div className={styles.txRoute}>{tx.route}</div>
                          <div className={styles.txDistance}>{tx.distance}</div>
                        </div>
                      </div>
                      <div className={styles.txRight}>
                        <div className={`${styles.txFare} ${tx.type === 'topup' ? styles.topup : ''}`}>{tx.fare}</div>
                        <div className={styles.txTime}>{tx.time}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
          
          <div className={styles.flipInstruction}>
            <FiRefreshCw /> Çevirmək üçün karta klikləyin
          </div>
        </div>
      </div>
    </section>
  );
}
