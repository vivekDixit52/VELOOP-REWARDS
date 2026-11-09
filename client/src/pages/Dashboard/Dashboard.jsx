import { Link } from 'react-router-dom';
import { ArrowRight, Gift, Repeat, Trophy } from 'lucide-react';
import ActivityList from '../../components/common/ActivityList.jsx';
import ExchangeLoader from '../../components/exchange/ExchangeLoader.jsx';
import ExchangeErrorState from '../../components/exchange/ExchangeErrorState.jsx';
import Gem from '../../components/common/Gem.jsx';
import VeCoin from '../../components/common/VeCoin.jsx';
import AnimatedNumber from '../../components/common/AnimatedNumber.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { chest, hero } from '../../assets/index.js';
import { formatNumber } from '../../utils.js';
import ui from '../../styles/ui.module.css';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch('/dashboard');

  if (loading) return <ExchangeLoader label="Loading your dashboard..." />;
  if (error) return <ExchangeErrorState onRetry={reload} />;

  const { stats, recent } = data;
  const progress = Math.round(((user.xp - user.levelStartXp) / (user.nextLevelXp - user.levelStartXp)) * 100);

  return (
    <div className={ui.stack}>
      <section className={styles.welcome}>
        <div className={styles.welcomeCopy}>
          <h1 className={styles.title}>Welcome back, {user.name}</h1>
          <div className={styles.level}>
            <div className={styles.levelRow}><span>Level {user.level}</span><span>{user.xp - user.levelStartXp} / {user.nextLevelXp - user.levelStartXp} XP</span></div>
            <div className={ui.progress} role="progressbar" aria-label="Level progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>
          </div>
          <div className={styles.cta}>
            <Link to="/exchange" className={`${ui.btn} ${ui.btnGold}`}>Convert Gems</Link>
            <Link to="/level-up" className={`${ui.btn} ${ui.btnGhost}`}>Earn Gems</Link>
          </div>
        </div>
        <img src={hero} alt="" aria-hidden="true" className={styles.art} />
      </section>

      <section className={styles.stats} aria-label="Summary">
        <article className={styles.stat}><Gem tone="purple" size={64} /><div><p>Gems</p><AnimatedNumber value={user.gems} className={styles.num} /></div></article>
        <article className={styles.stat}><VeCoin size={48} /><div><p>VEs</p><AnimatedNumber value={user.ves} className={`${styles.num} ${styles.gold}`} /></div></article>
        <article className={styles.stat}><Gem tone="blue" size={64} /><div><p>Conversions</p><span className={styles.num}>{formatNumber(stats.conversions)}</span></div></article>
        <article className={styles.stat}><Gem tone="orange" size={64} /><div><p>Rewards redeemed</p><span className={styles.num}>{formatNumber(stats.redemptions)}</span></div></article>
      </section>

      <div className={styles.columns}>
        <section className={ui.panel} aria-labelledby="recent-heading">
          <div className={ui.panelHead}>
            <h2 id="recent-heading" className={ui.panelTitle}>Recent activity</h2>
            <Link to="/history" className={`${ui.btn} ${ui.btnGhost} ${ui.btnSm}`}>View all</Link>
          </div>
          <ActivityList items={recent} emptyText="No activity yet. Claim your first Gems in Level Up & Earn." />
        </section>

        <nav className={styles.actions} aria-label="Quick actions">
          <Link to="/exchange" className={styles.action}><span className={styles.actionIcon}><Repeat size={20} aria-hidden="true" /></span><div><h3>Exchange Center</h3><p>Turn Gems into VEs</p></div><ArrowRight size={18} aria-hidden="true" /></Link>
          <Link to="/level-up" className={styles.action}><span className={styles.actionIcon}><Trophy size={20} aria-hidden="true" /></span><div><h3>Level Up & Earn</h3><p>Claim daily Gems</p></div><ArrowRight size={18} aria-hidden="true" /></Link>
          <Link to="/rewards" className={styles.action}><span className={styles.actionIcon}><Gift size={20} aria-hidden="true" /></span><div><h3>Rewards</h3><p>Redeem your VEs</p></div><ArrowRight size={18} aria-hidden="true" /></Link>
          <img src={chest} alt="" aria-hidden="true" className={styles.chest} />
        </nav>
      </div>
    </div>
  );
}
