import { coins } from '../../assets/index.js';
import styles from './StateMessage.module.css';

export default function ExchangeEmptyState() {
  return (
    <div className={styles.state}>
      <img src={coins} alt="" aria-hidden="true" className={styles.dim} />
      <h3 className={styles.title}>No conversions available right now.</h3>
      <p className={styles.text}>New reward conversion opportunities will appear here when available.</p>
    </div>
  );
}
