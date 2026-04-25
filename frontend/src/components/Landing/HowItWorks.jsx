import { FiSmartphone, FiCheckCircle, FiCompass } from 'react-icons/fi';
import { RiSignalTowerLine } from 'react-icons/ri';
import styles from './HowItWorks.module.scss';

const steps = [
  {
    icon: <FiSmartphone />,
    title: 'SIM Kartınızı Bağlayın',
    desc: 'Dəqiq siqnal əsaslı yer təyini üçün mobil nömrənizi B.A.K.U şəbəkəsinə qoşun.'
  },
  {
    icon: <FiCompass />,
    title: 'Nəqliyyata Minin',
    desc: 'Sadəcə istənilən avtobusa və ya metroya daxil olun. Sistemimiz giriş nöqtənizi yaxınlıq sensorları vasitəsilə avtomatik aşkar edir.'
  },
  {
    icon: <RiSignalTowerLine />,
    title: 'Real Vaxtda İzləmə',
    desc: 'B.A.K.U yüksək dəqiqlikli GPS və hüceyrə trianqulyasiyasından istifadə edərək qət edilən dəqiq məsafəni hesablayır.'
  },
  {
    icon: <FiCheckCircle />,
    title: 'Avtomatik Ödəniş',
    desc: 'Nəqliyyat vasitəsindən çıxın və yalnız istifadə olunan kilometrlər üçün ödəyin. Balansınız dərhal yenilənir.'
  }
];

export default function HowItWorks() {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Sistem İşleyişi</span>
          <h2 className={styles.title}>Necə <span className={styles.highlight}>İşləyir?</span></h2>
          <p className={styles.subtitle}>
            Qabaqcıl siqnal intellekti ilə təmin edilən qüsursuz təcrübə. 
            Sabit tarifli biletlərə son.
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
