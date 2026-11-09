import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, Clock, XCircle } from 'lucide-react';
import { formatNumber, formatWhen } from '../../utils.js';
import ui from '../../styles/ui.module.css';
import styles from './ExchangeHistory.module.css';

const VISIBLE = 5;
const STATUS = { completed: { label: 'Completed', icon: Check }, processing: { label: 'Processing', icon: Clock }, failed: { label: 'Failed', icon: XCircle } };

export default function ExchangeHistory({ items }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, VISIBLE);

  return (
    <section className={ui.panel} aria-labelledby="history-heading">
      <div className={ui.panelHead}><h2 id="history-heading" className={ui.panelTitle}>Recent Conversions</h2></div>
      {items.length === 0 ? (
        <p className={ui.empty}>No conversions yet.</p>
      ) : (
        <ul className={styles.list}>
          <AnimatePresence initial={false}>
            {visible.map((item) => {
              const { label, icon: Icon } = STATUS[item.status];
              return (
                <motion.li key={item.id} layout="position" className={styles.item} data-new={Boolean(item.isNew)} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className={styles.body}>
                    <p className={styles.amounts}>{formatNumber(Math.abs(item.gems))} Gems <ArrowRight size={13} aria-hidden="true" /> <span>{formatNumber(item.ves)} VEs</span></p>
                    <time className={styles.when} dateTime={item.createdAt}>{formatWhen(item.createdAt)}</time>
                  </div>
                  <span className={ui.pill} data-status={item.status}><Icon size={12} aria-hidden="true" /> {label}</span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
      {items.length > VISIBLE && (
        <button type="button" className={styles.toggle} aria-expanded={showAll} onClick={() => setShowAll((v) => !v)}>
          {showAll ? 'Show fewer' : 'View full history'} <ChevronDown size={16} aria-hidden="true" data-open={showAll} />
        </button>
      )}
    </section>
  );
}
