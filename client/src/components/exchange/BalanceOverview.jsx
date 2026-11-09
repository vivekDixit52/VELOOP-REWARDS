import Gem from '../common/Gem.jsx';
import VeCoin from '../common/VeCoin.jsx';
import InfoTip from '../common/InfoTip.jsx';
import AnimatedNumber from '../common/AnimatedNumber.jsx';
import { infoTips } from '../../data/exchangeData.js';
import styles from './BalanceOverview.module.css';

export default function BalanceOverview({ gems, ves }) {
  return (
    <section className={styles.balances} aria-label="Your balances">
      <article className={styles.card} data-kind="gems">
        <Gem tone="purple" size={86} className={styles.icon} />
        <div className={styles.info}>
          <p className={styles.label}>Available Gems <InfoTip label={infoTips.gems.label} title={infoTips.gems.title}>{infoTips.gems.text}</InfoTip></p>
          <AnimatedNumber value={gems} className={styles.value} />
        </div>
        <Gem tone="purple" size={150} className={styles.watermark} />
      </article>
      <article className={styles.card} data-kind="ves">
        <VeCoin size={62} className={styles.icon} />
        <div className={styles.info}>
          <p className={styles.label}>Available VEs <InfoTip label={infoTips.ves.label} title={infoTips.ves.title} align="end">{infoTips.ves.text}</InfoTip></p>
          <AnimatedNumber value={ves} className={styles.value} />
        </div>
        <VeCoin size={110} className={styles.watermark} />
      </article>
    </section>
  );
}
