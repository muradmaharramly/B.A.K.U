import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import styles from './FAQ.module.scss';

const faqs = [
  {
    question: 'How accurate is the distance tracking?',
    answer: 'B.A.K.U uses a combination of GPS, cellular triangulation (SIM signal), and proximity sensors at vehicle entrances. Our precision is within ±5 meters, ensuring you pay only for exactly what you travel.'
  },
  {
    question: 'What happens if my phone dies during a trip?',
    answer: 'Our proximity sensors record your entry. If your signal is lost, the system assumes the maximum possible distance for that route as a security measure. However, you can appeal this through the dashboard with trip logs.'
  },
  {
    question: 'Are my location data and privacy secure?',
    answer: 'We prioritize privacy. All location data is encrypted and anonymized after the transaction is completed. We only store the total distance and fare history, not your specific route paths.'
  },
  {
    question: 'Can I use a physical B.A.K.U card?',
    answer: 'Yes! While our system is optimized for mobile/SIM tracking, physical B.A.K.U cards are available at all metro stations and include an embedded chip for distance-based tracking.'
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
          <h2 className={styles.title}>Frequently Asked <span className={styles.highlight}>Questions</span></h2>
          <p className={styles.subtitle}>Everything you need to know about the B.A.K.U distance-based transit network.</p>
        </div>

        <div className={styles.layout}>
          <div className={styles.decorativeCol}>
            <div className={styles.blurCard}>
              <div className={styles.cardContent}>
                <h3>Find Answers</h3>
                <p>Support & Help</p>
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
