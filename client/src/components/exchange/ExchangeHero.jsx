import { hero } from '../../assets/index.js';
import styles from './ExchangeHero.module.css';

export default function ExchangeHero({ children }) {
  return (
    <header className={styles.hero}>
      <div className={styles.copy}>
        <h1 className={styles.title}>Exchange Center</h1>
        <p className={styles.subtitle}>Turn your earned Gems into VEs</p>
        <p className={styles.lead}>Pick a conversion, confirm, and your VEs arrive instantly.</p>
      </div>
      <img src={hero} alt="A purple Gem passing through a golden vault portal and becoming a VE coin" className={styles.art} width="1400" height="583" />
      <div className={styles.balances}>{children}</div>
    </header>
  );
}
