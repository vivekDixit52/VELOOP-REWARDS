import Gem from '../common/Gem.jsx';
import VeCoin from '../common/VeCoin.jsx';
import { infoTips } from '../../data/exchangeData.js';
import ui from '../../styles/ui.module.css';
import styles from './ExchangeGlossary.module.css';

export default function ExchangeGlossary() {
  return (
    <section className={ui.panel} aria-labelledby="glossary-heading">
      <div className={ui.panelHead}><h2 id="glossary-heading" className={ui.panelTitle}>What are these?</h2></div>
      <dl className={styles.list}>
        <div><span className={styles.icon}><Gem tone="purple" size={58} /></span><div><dt>Gems</dt><dd>{infoTips.gems.text}</dd></div></div>
        <div><span className={styles.icon}><VeCoin size={44} /></span><div><dt>VEs</dt><dd>{infoTips.ves.text}</dd></div></div>
      </dl>
    </section>
  );
}
