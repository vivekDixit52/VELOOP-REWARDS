import { Coins, Gem, ListChecks, Search, ShieldCheck } from 'lucide-react';
import { howExchangeSteps } from '../../data/exchangeData.js';
import ui from '../../styles/ui.module.css';
import styles from './HowExchangeWorks.module.css';

const ICONS = { gem: Gem, list: ListChecks, search: Search, shield: ShieldCheck, coins: Coins };
const TONES = ['purple', 'blue', 'teal', 'gold', 'green'];

export default function HowExchangeWorks() {
  return (
    <section className={ui.panel} aria-labelledby="how-heading">
      <div className={ui.panelHead}><h2 id="how-heading" className={ui.panelTitle}>How Exchange Works</h2></div>
      <ol className={styles.steps}>
        {howExchangeSteps.map((step, index) => {
          const Icon = ICONS[step.icon];
          return (
            <li key={step.id} className={styles.step} data-tone={TONES[index]}>
              <span className={styles.node}><Icon size={22} aria-hidden="true" /></span>
              <div>
                <p className={styles.title}><span className={styles.number}>0{index + 1}</span> {step.title}</p>
                <p className={styles.text}>{step.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
