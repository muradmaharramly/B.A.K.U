import { FiSmartphone, FiCheckCircle, FiCompass } from 'react-icons/fi';
import { RiSignalTowerLine } from 'react-icons/ri';
import styles from './HowItWorks.module.scss';

const steps = [
  {
    icon: <FiSmartphone />,
    title: 'Link Your SIM',
    desc: 'Connect your mobile number to the B.A.K.U network to enable precise signal-based location tracking.'
  },
  {
    icon: <FiCompass />,
    title: 'Board Transport',
    desc: 'Simply enter any bus or metro. Our system automatically detects your entry point via proximity sensors.'
  },
  {
    icon: <RiSignalTowerLine />,
    title: 'Real-time Tracking',
    desc: 'B.A.K.U calculates the exact distance traveled using high-precision GPS and cellular triangulation.'
  },
  {
    icon: <FiCheckCircle />,
    title: 'Automatic Payment',
    desc: 'Exit the vehicle and pay only for the kilometers used. Your balance is updated instantly.'
  }
];

export default function HowItWorks() {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>System Flow</span>
          <h2 className={styles.title}>How It <span className={styles.highlight}>Works</span></h2>
          <p className={styles.subtitle}>
            A seamless experience powered by advanced signal intelligence. 
            No more flat-rate tickets.
          </p>
        </div>

        <div className={styles.grid}>
          {steps.map((step, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.iconBox}>{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {i < steps.length - 1 && <div className={styles.connector}></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
