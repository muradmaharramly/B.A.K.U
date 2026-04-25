import { FiMap, FiActivity, FiShield, FiTrendingUp, FiSmartphone } from 'react-icons/fi';
import { RiSimCardLine } from 'react-icons/ri';
import styles from './About.module.scss';

const features = [
  {
    icon: <FiMap />,
    title: 'Pay Per Kilometer',
    desc: "Fair pricing based on actual distance traveled. Short ride? Pay less. It's that simple.",
  },
  {
    icon: <FiActivity />,
    title: 'GPS Tracking',
    desc: 'Real-time vehicle tracking with sub-meter accuracy to calculate the exact route distance.',
  },
  {
    icon: <RiSimCardLine />,
    title: 'SIM Signal Fallback',
    desc: 'When GPS drops in tunnels or underground, our SIM-based triangulation kicks in seamlessly.',
  },
  {
    icon: <FiShield />,
    title: 'Auto Tap-Out',
    desc: 'No need to swipe when exiting. Signal deviation from vehicle trajectory triggers automatic checkout.',
  },
  {
    icon: <FiTrendingUp />,
    title: 'Dynamic Discounts',
    desc: 'Frequent short-distance travelers earn "Next Ride Free" vouchers. The more you ride, the more you save.',
  },
  {
    icon: <FiSmartphone />,
    title: 'Digital-First Cards',
    desc: 'Manage your B.A.K.U card from your phone. Top up, view history, link family accounts — all digitally.',
  },
];

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Why B.A.K.U?</span>
          <h2 className={styles.title}>
            From <span className={styles.old}>Fixed Fares</span> to{' '}
            <span className={styles.highlight}>Smart Pricing</span>
          </h2>
          <p className={styles.subtitle}>
            Traditional transit systems charge the same price regardless of distance. 
            B.A.K.U changes the game with intelligent, distance-based fare calculation 
            powered by dual GPS/SIM signal technology.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((f, i) => (
            <div key={i} className={styles.card} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.iconBox}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
