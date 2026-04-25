import { FiMap, FiActivity, FiShield, FiTrendingUp, FiSmartphone } from 'react-icons/fi';
import { RiSimCardLine } from 'react-icons/ri';
import styles from './About.module.scss';

const features = [
  {
    icon: <FiMap />,
    title: 'Kilometrə görə ödəniş',
    desc: "Həqiqi qət edilən məsafəyə əsaslanan ədalətli qiymət. Qısa gediş? Daha az ödəyin. Bu qədər sadə.",
  },
  {
    icon: <FiActivity />,
    title: 'GPS İzləmə',
    desc: 'Dəqiq marşrut məsafəsini hesablamaq üçün metr səviyyəsində dəqiqliklə real vaxtda nəqliyyat vasitəsinin izlənilməsi.',
  },
  {
    icon: <RiSimCardLine />,
    title: 'SIM Siqnal Dəstəyi',
    desc: 'Tunellərdə və ya yeraltı ərazilərdə GPS siqnalı itdiyi zaman, SIM-əsaslı trianqulyasiya sistemimiz problemsiz işə düşür.',
  },
  {
    icon: <FiShield />,
    title: 'Avtomatik Çıxış',
    desc: 'Çıxarkən kartı oxutmağa ehtiyac yoxdur. Siqnalın nəqliyyat vasitəsinin trayektoriyasından uzaqlaşması avtomatik ödənişi sonlandırır.',
  },
  {
    icon: <FiTrendingUp />,
    title: 'Dinamik Endirimlər',
    desc: 'Tez-tez qısa məsafəyə səyahət edənlər "Növbəti Gediş Pulsuz" vauçerləri qazanırlar. Nə qədər çox istifadə etsəniz, o qədər çox qənaət edərsiniz.',
  },
  {
    icon: <FiSmartphone />,
    title: 'Rəqəmsal Kartlar',
    desc: 'B.A.K.U kartınızı telefonunuzdan idarə edin. Balans artırın, tarixçəyə baxın, ailə hesablarını birləşdirin — hamısı rəqəmsal.',
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
