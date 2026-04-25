import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import styles from './FAQ.module.scss';

const faqs = [
  {
    question: 'Məsafə izləmə nə dərəcədə dəqiqdir?',
    answer: 'B.A.K.U GPS, hüceyrə trianqulyasiyası (SIM siqnalı) və nəqliyyat girişlərindəki yaxınlıq sensorlarının kombinasiyasından istifadə edir. Dəqiqliyimiz ±5 metr daxilindədir, bu da yalnız qət etdiyiniz məsafəyə görə ödəniş etməyinizi təmin edir.'
  },
  {
    question: 'Gediş zamanı telefonum sönərsə nə baş verir?',
    answer: 'Yaxınlıq sensorlarımız girişinizi qeydə alır. Siqnal itərsə, təhlükəsizlik tədbiri olaraq sistem həmin marşrut üçün mümkün olan maksimum məsafəni hesablayır. Lakin siz gediş qeydləri ilə paneldən buna etiraz edə bilərsiniz.'
  },
  {
    question: 'Məkan məlumatlarım və məxfiliyim qorunurmu?',
    answer: 'Biz məxfiliyə üstünlük veririk. Bütün məkan məlumatları əməliyyat başa çatdıqdan sonra şifrələnir və anonimləşdirilir. Biz spesifik marşrut trayektoriyalarınızı deyil, yalnız ümumi məsafəni və ödəniş tarixçəsini saxlayırıq.'
  },
  {
    question: 'Fiziki B.A.K.U kartından istifadə edə bilərəmmi?',
    answer: 'Bəli! Sistemimiz mobil/SIM izləmə üçün optimallaşdırılsa da, fiziki B.A.K.U kartları bütün metro stansiyalarında mövcuddur və məsafəyə əsaslanan izləmə üçün daxili çiplə təmin olunub.'
  }
];

export default function FAQ() {
  const [active, setActive] = useState(null);

  const toggle = (i) => {
    setActive(active === i ? null : i);
  };

  return (
    <section className={styles.section} id="faq">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Tez-tez Verilən <span className={styles.highlight}>Suallar</span></h2>
          <p className={styles.subtitle}>B.A.K.U məsafəyə əsaslanan nəqliyyat şəbəkəsi haqqında bilməli olduğunuz hər şey.</p>
        </div>

        <div className={styles.layout}>
          <div className={styles.decorativeCol}>
            <div className={styles.blurCard}>
              <div className={styles.cardContent}>
                <h3>Cavabları Tap</h3>
                <p>Dəstək və Yardım</p>
              </div>
              <span className={styles.qMark} style={{ fontSize: '80px', top: '10%', left: '15%', opacity: 0.15 }}>?</span>
              <span className={styles.qMark} style={{ fontSize: '40px', bottom: '20%', right: '10%', opacity: 0.15 }}>?</span>
              <span className={styles.qMark} style={{ fontSize: '120px', top: '40%', right: '20%', opacity: 0.1 }}>?</span>
              <span className={styles.qMark} style={{ fontSize: '60px', bottom: '10%', left: '25%', opacity: 0.15 }}>?</span>
              <div className={styles.glow}></div>
            </div>
          </div>

          <div className={styles.listCol}>
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className={`${styles.item} ${active === i ? styles.active : ''}`}
                onClick={() => toggle(i)}
              >
                <div className={styles.question}>
                  <h3>{faq.question}</h3>
                  <span className={styles.icon}>
                    {active === i ? <FiMinus /> : <FiPlus />}
                  </span>
                </div>
                <div className={styles.answer}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
