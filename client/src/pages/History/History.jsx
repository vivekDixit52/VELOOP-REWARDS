import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import ActivityList from '../../components/common/ActivityList.jsx';
import ExchangeLoader from '../../components/exchange/ExchangeLoader.jsx';
import ExchangeErrorState from '../../components/exchange/ExchangeErrorState.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import ui from '../../styles/ui.module.css';
import styles from './History.module.css';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'conversion', label: 'Conversions' },
  { id: 'earn', label: 'Earned' },
  { id: 'redeem', label: 'Redeemed' },
];

export default function History() {
  const [type, setType] = useState('all');
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch(`/activities?type=${type}&page=${page}&limit=8`);
  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  const choose = (id) => { setType(id); setPage(1); };

  return (
    <div className={ui.stack}>
      <PageHeader title="History" subtitle="Everything you have earned, converted and redeemed." />
      <section className={ui.panel}>
        <div className={ui.tabs} role="group" aria-label="Filter activity">
          {FILTERS.map((f) => <button key={f.id} type="button" className={ui.tab} aria-pressed={type === f.id} onClick={() => choose(f.id)}>{f.label}</button>)}
        </div>
        <div className={styles.list}>
          {loading && <ExchangeLoader label="Loading history..." />}
          {error && <ExchangeErrorState onRetry={reload} />}
          {data && !loading && <ActivityList items={data.items} emptyText="No activity in this category yet." />}
        </div>
        {data && pages > 1 && (
          <div className={styles.pager}>
            <button type="button" className={`${ui.btn} ${ui.btnGhost} ${ui.btnSm}`} onClick={() => setPage((p) => p - 1)} disabled={page === 1} aria-label="Previous page"><ChevronLeft size={16} aria-hidden="true" /> Prev</button>
            <span>Page {page} of {pages}</span>
            <button type="button" className={`${ui.btn} ${ui.btnGhost} ${ui.btnSm}`} onClick={() => setPage((p) => p + 1)} disabled={page >= pages} aria-label="Next page">Next <ChevronRight size={16} aria-hidden="true" /></button>
          </div>
        )}
      </section>
    </div>
  );
}
