import { ArrowRight, Check, Clock, XCircle } from 'lucide-react';
import Gem from './Gem.jsx';
import VeCoin from './VeCoin.jsx';
import { formatNumber, formatWhen } from '../../utils.js';
import ui from '../../styles/ui.module.css';
import styles from './ActivityList.module.css';

const STATUS = { completed: { label: 'Completed', icon: Check }, processing: { label: 'Processing', icon: Clock }, failed: { label: 'Failed', icon: XCircle } };

const sign = (n) => (n > 0 ? '+' : n < 0 ? '−' : '');

function Amounts({ item }) {
  const gems = Math.abs(item.gems);
  const ves = Math.abs(item.ves);
  if (item.type === 'conversion') {
    return (
      <span className={styles.amounts}>
        <span>{formatNumber(gems)} Gems</span>
        <ArrowRight size={13} aria-hidden="true" />
        <span className={styles.gold}>{formatNumber(ves)} VEs</span>
      </span>
    );
  }
  return (
    <span className={styles.amounts}>
      {item.gems !== 0 && <span className={item.gems > 0 ? styles.plus : ''}>{sign(item.gems)}{formatNumber(gems)} Gems</span>}
      {item.ves !== 0 && <span className={item.ves > 0 ? styles.plus : styles.gold}>{sign(item.ves)}{formatNumber(ves)} VEs</span>}
    </span>
  );
}

export default function ActivityList({ items, emptyText = 'Nothing here yet.' }) {
  if (!items.length) return <p className={ui.empty}>{emptyText}</p>;
  return (
    <ul className={styles.list}>
      {items.map((item) => {
        const { label, icon: StatusIcon } = STATUS[item.status] ?? STATUS.completed;
        return (
          <li key={item.id} className={styles.item}>
            <span className={styles.icon} data-type={item.type} aria-hidden="true">
              {item.type === 'redeem' ? <VeCoin size={30} /> : <Gem tone={item.type === 'conversion' ? 'purple' : 'blue'} size={34} />}
            </span>
            <div className={styles.body}>
              <p className={styles.title}>{item.title}</p>
              <time className={styles.when} dateTime={item.createdAt}>{formatWhen(item.createdAt)}</time>
            </div>
            <div className={styles.end}>
              <Amounts item={item} />
              <span className={ui.pill} data-status={item.status}><StatusIcon size={12} aria-hidden="true" /> {label}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
