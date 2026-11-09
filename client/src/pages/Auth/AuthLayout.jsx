import BrandMark from '../../components/layout/BrandMark.jsx';
import { coins, hero } from '../../assets/index.js';
import styles from './Auth.module.css';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className={styles.page}>
      <section className={styles.visual} aria-hidden="true">
        <BrandMark />
        <div className={styles.pitch}>
          <h2 className={styles.pitchTitle}>Earn Gems. Convert to VEs. Unlock rewards.</h2>
          <p className={styles.pitchText}>One place for everything you earn.</p>
        </div>
        <img src={hero} alt="" className={styles.hero} />
        <img src={coins} alt="" className={styles.coins} />
      </section>

      <section className={styles.formSide}>
        <div className={styles.mobileBrand}><BrandMark /></div>
        <div className={styles.card}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          {children}
          <p className={styles.footer}>{footer}</p>
        </div>
      </section>
    </div>
  );
}
