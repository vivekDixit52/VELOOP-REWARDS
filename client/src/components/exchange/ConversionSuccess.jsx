import { Check } from 'lucide-react';
import { coins } from '../../assets/index.js';
import { formatNumber } from '../../utils.js';
import styles from './ConversionSuccess.module.css';

const SPARKS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

export default function ConversionSuccess({ titleId, receipt, balances, onContinue }) {
  return (
    <div className={styles.success} role="status">
      <div className={styles.visual}>
        {SPARKS.map((angle) => <span key={angle} className={styles.spark} style={{ '--angle': `${angle}deg` }} />)}
        <img src={coins} alt="" aria-hidden="true" className={styles.coins} />
        <span className={styles.badge}><Check size={26} strokeWidth={3.2} aria-hidden="true" /></span>
      </div>
      <h2 id={titleId} className={styles.title}>Conversion Complete</h2>
      <p className={styles.gain}>+{formatNumber(receipt.vesReceived)} VEs added</p>
      <p className={styles.line}>{formatNumber(receipt.gemsSpent)} Gems converted</p>
      <dl className={styles.balances}>
        <div><dt>Gems</dt><dd>{formatNumber(balances.gems)}</dd></div>
        <div><dt>VEs</dt><dd>{formatNumber(balances.ves)}</dd></div>
      </dl>
      <button type="button" className={styles.continue} onClick={onContinue} data-autofocus>Continue</button>
    </div>
  );
}
