import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import ActivityList from '../../components/common/ActivityList.jsx';
import BalanceOverview from '../../components/exchange/BalanceOverview.jsx';
import ExchangeLoader from '../../components/exchange/ExchangeLoader.jsx';
import ExchangeErrorState from '../../components/exchange/ExchangeErrorState.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { coins } from '../../assets/index.js';
import ui from '../../styles/ui.module.css';
import styles from './Wallet.module.css';

export default function Wallet() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch('/activities?limit=8');

  return (
    <div className={ui.stack}>
      <PageHeader title="Wallet" subtitle="Your balances and latest movements.">
        <Link to="/exchange" className={`${ui.btn} ${ui.btnGold}`}>Convert Gems</Link>
        <Link to="/rewards" className={`${ui.btn} ${ui.btnGhost}`}>Redeem VEs</Link>
      </PageHeader>

      <section className={styles.balances}>
        <BalanceOverview gems={user.gems} ves={user.ves} />
        <img src={coins} alt="" aria-hidden="true" className={styles.coins} />
      </section>

      <section className={ui.panel} aria-labelledby="ledger-heading">
        <div className={ui.panelHead}>
          <h2 id="ledger-heading" className={ui.panelTitle}>Latest activity</h2>
          <Link to="/history" className={`${ui.btn} ${ui.btnGhost} ${ui.btnSm}`}>Full history</Link>
        </div>
        {loading && <ExchangeLoader label="Loading activity..." />}
        {error && <ExchangeErrorState onRetry={reload} />}
        {data && <ActivityList items={data.items} />}
      </section>
    </div>
  );
}
