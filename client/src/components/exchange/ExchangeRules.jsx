import { CheckCircle2 } from 'lucide-react';
import InfoTip from '../common/InfoTip.jsx';
import { shield } from '../../assets/index.js';
import { exchangeRules, infoTips } from '../../data/exchangeData.js';
import ui from '../../styles/ui.module.css';
import styles from './ExchangeRules.module.css';

export default function ExchangeRules() {
  return (
    <section className={`${ui.panel} ${styles.panel}`} aria-labelledby="rules-heading">
      <div className={ui.panelHead}>
        <h2 id="rules-heading" className={ui.panelTitle}>Exchange Rules <InfoTip label={infoTips.rules.label} title={infoTips.rules.title} align="end">{infoTips.rules.text}</InfoTip></h2>
      </div>
      <ul className={styles.list}>
        {exchangeRules.map((rule) => (<li key={rule}><CheckCircle2 size={17} aria-hidden="true" /><span>{rule}</span></li>))}
      </ul>
      <img src={shield} alt="" aria-hidden="true" className={styles.shield} />
    </section>
  );
}
