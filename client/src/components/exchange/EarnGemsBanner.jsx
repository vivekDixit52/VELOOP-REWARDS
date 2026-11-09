import { Link } from 'react-router-dom';
import { chest } from '../../assets/index.js';
import ui from '../../styles/ui.module.css';
import styles from './EarnGemsBanner.module.css';

export default function EarnGemsBanner() {
  return (
    <aside id="earn-gems" className={styles.banner} aria-labelledby="earn-heading">
      <div className={styles.copy}>
        <h3 id="earn-heading" className={styles.title}>The more Gems you have, the better the rewards you unlock.</h3>
        <Link to="/level-up" className={`${ui.btn} ${ui.btnViolet}`}>Earn Gems</Link>
      </div>
      <img src={chest} alt="" aria-hidden="true" className={styles.chest} />
    </aside>
  );
}
