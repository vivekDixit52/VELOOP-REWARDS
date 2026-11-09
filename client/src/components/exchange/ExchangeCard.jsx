import { motion } from 'framer-motion';
import { ArrowDown, ChevronsRight, Lock, Sparkles } from 'lucide-react';
import Gem from '../common/Gem.jsx';
import VeCoin from '../common/VeCoin.jsx';
import { formatNumber } from '../../utils.js';
import styles from './ExchangeCard.module.css';

export default function ExchangeCard({ option, availableGems, onConvert, onEarnMore }) {
  const { title, tone, requiredGems, receiveVEs, popular } = option;
  const canAfford = availableGems >= requiredGems;
  const missing = requiredGems - availableGems;
  const progress = Math.min(100, Math.round((availableGems / requiredGems) * 100));

  return (
    <motion.article className={styles.card} data-tone={tone} data-locked={!canAfford} whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
      {popular && <span className={styles.badge}><Sparkles size={12} aria-hidden="true" /> Popular</span>}

      <div className={styles.stage} aria-hidden="true">
        <Gem tone={tone} size={150} className={styles.gem} />
        <ChevronsRight size={22} className={styles.flow} />
        <VeCoin size={64} className={styles.coin} />
      </div>

      <h3 className={styles.title}>{title}</h3>

      <div className={styles.values}>
        <p className={styles.from}><strong>{formatNumber(requiredGems)}</strong> Gems</p>
        <ArrowDown size={20} className={styles.arrow} aria-hidden="true" />
        <p className={styles.to}><strong>{formatNumber(receiveVEs)}</strong> VEs</p>
      </div>

      {canAfford ? (
        <button type="button" className={styles.cta} aria-label={`Convert ${requiredGems} Gems into ${receiveVEs} VEs`} onClick={(e) => onConvert(option, e.currentTarget)}>
          Convert {formatNumber(requiredGems)} Gems
        </button>
      ) : (
        <div className={styles.locked}>
          <div className={styles.lockedTop}>
            <span><Lock size={13} aria-hidden="true" /> {formatNumber(availableGems)} / {formatNumber(requiredGems)} Gems</span>
          </div>
          <div className={styles.track} role="progressbar" aria-label={`Gems toward ${title}`} aria-valuemin={0} aria-valuemax={requiredGems} aria-valuenow={availableGems}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className={styles.shortfall}>Need {formatNumber(missing)} more Gems to unlock</p>
          <button type="button" className={styles.ctaLocked} onClick={onEarnMore}>Earn More Gems</button>
        </div>
      )}
    </motion.article>
  );
}
