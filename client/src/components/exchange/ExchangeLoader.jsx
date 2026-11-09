import { coin, gems } from '../../assets/index.js';
import { cx } from '../../utils.js';
import styles from './ExchangeLoader.module.css';

export default function ExchangeLoader({ fullScreen = false, label = 'Preparing your reward conversions...' }) {
  return (
    <div className={cx(styles.loader, fullScreen && styles.full)} role="status" aria-live="polite">
      <div className={styles.stage} aria-hidden="true">
        <span className={styles.core} />
        <span className={styles.orbit}>
          <img src={gems.purple} alt="" className={styles.gem} />
          <img src={coin} alt="" className={styles.coin} />
        </span>
      </div>
      <p className={styles.title}>{label}</p>
      <p className={styles.text}>Just a moment.</p>
    </div>
  );
}
