import { FaBusSimple } from "react-icons/fa6";
import { MdDirectionsSubway } from "react-icons/md";
import { FiActivity, FiShield, FiTrendingUp, FiSmartphone } from 'react-icons/fi';
import styles from './About.module.scss';

const features = [
  {
    icon: <FaBusSimple />,
    title: 'Geniş Avtobus Şəbəkəsi',
    desc: "Bakı şəhərinin bütün avtobus xətləri ilə tam inteqrasiya. Hər bir avtobus dəqiq GPS izləmə modulu ilə təchiz olunub.",
  },
  {
    icon: <MdDirectionsSubway />,
    title: 'Metro və Yeraltı Dəstək',
    desc: 'Metro tunellərində GPS siqnalı itdiyi zaman, SIM-əsaslı trianqulyasiya sistemimiz problemsiz ödənişi təmin edir.',
  },
  {
    icon: <FiActivity />,
    title: 'Məsafəyə Görə Ödəniş',
    desc: 'Yalnız qət etdiyiniz kilometrə görə ödəyin. Sistem mindiyiniz və düşdüyünüz nöqtələri avtomatik qeydə alır.',
  },
  {
    icon: <FiShield />,
    title: 'Transfer Endirimləri',
    desc: 'Avtobusdan metroya və ya əksinə keçid zamanı xüsusi transfer endirimləri avtomatik tətbiq olunur.',
  },
  {
    icon: <FiTrendingUp />,
    title: 'Real-vaxt Analitikası',
    desc: 'Marşrutların doluluq səviyyəsini və növbəti nəqliyyatın gəlmə vaxtını saniyələr daxilində izləyin.',
  },
  {
    icon: <FiSmartphone />,
    title: 'Rəqəmsal Ödəniş Sistemi',
    desc: 'Fiziki karta ehtiyac yoxdur. Telefonunuzla avtobusa minin və ya metro keçidlərindən sürətlə keçin.',
  },
];

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Niyə B.A.K.U?</span>
          <h2 className={styles.title}>
            Sabit Tariflərdən <span className={styles.old}>Ağıllı</span>{' '}
            <span className={styles.highlight}>Qiymətlərə</span>
          </h2>
          <p className={styles.subtitle}>
            Ənənəvi nəqliyyat sistemləri məsafədən asılı olmayaraq eyni qiyməti tələb edir. 
            B.A.K.U ikili GPS/SIM siqnal texnologiyası ilə işləyən intellektual, 
            məsafəyə əsaslanan gediş haqqı hesablaması ilə oyunu dəyişir.
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
