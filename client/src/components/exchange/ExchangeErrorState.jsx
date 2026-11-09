import { RefreshCw, TriangleAlert } from 'lucide-react';
import styles from './StateMessage.module.css';

export default function ExchangeErrorState({ onRetry }) {
  return (
    <div className={`${styles.state} ${styles.page}`} role="alert">
      <span className={styles.errorIcon}><TriangleAlert size={30} aria-hidden="true" /></span>
      <h2 className={styles.title}>Unable to load exchange options.</h2>
      <p className={styles.text}>Please try again.</p>
      <button type="button" className={styles.retry} onClick={onRetry}><RefreshCw size={16} aria-hidden="true" /> Retry</button>
    </div>
  );
}
