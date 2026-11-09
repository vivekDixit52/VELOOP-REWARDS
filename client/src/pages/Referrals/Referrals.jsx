import { Copy, Link2, Share2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Gem from '../../components/common/Gem.jsx';
import ExchangeLoader from '../../components/exchange/ExchangeLoader.jsx';
import ExchangeErrorState from '../../components/exchange/ExchangeErrorState.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useToast } from '../../context/ToastContext.jsx';
import { coins } from '../../assets/index.js';
import { formatWhen } from '../../utils.js';
import ui from '../../styles/ui.module.css';
import styles from './Referrals.module.css';

export default function Referrals() {
  const toast = useToast();
  const { data, loading, error, reload } = useFetch('/referrals');

  if (loading) return <ExchangeLoader label="Loading referrals..." />;
  if (error) return <ExchangeErrorState onRetry={reload} />;

  const link = `${window.location.origin}/signup?ref=${data.code}`;
  const copy = async (text, message) => {
    try { await navigator.clipboard.writeText(text); toast.success(message); } catch { toast.error('Could not copy. Please copy it manually.'); }
  };
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ title: 'Join me on VELOOP Rewards', url: link }); return; } catch { return; } }
    copy(link, 'Invite link copied');
  };

  return (
    <div className={ui.stack}>
      <PageHeader title="Referrals" subtitle="Invite friends. You both earn Gems." />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.label}>Your referral code</p>
          <p className={styles.code}>{data.code}</p>
          <div className={styles.actions}>
            <button type="button" className={`${ui.btn} ${ui.btnGold}`} onClick={() => copy(data.code, 'Code copied')}><Copy size={16} aria-hidden="true" /> Copy code</button>
            <button type="button" className={`${ui.btn} ${ui.btnGhost}`} onClick={() => copy(link, 'Invite link copied')}><Link2 size={16} aria-hidden="true" /> Copy link</button>
            <button type="button" className={`${ui.btn} ${ui.btnGhost}`} onClick={share}><Share2 size={16} aria-hidden="true" /> Share</button>
          </div>
        </div>
        <img src={coins} alt="" aria-hidden="true" className={styles.coins} />
      </section>

      <div className={ui.grid2}>
        <section className={ui.panel}>
          <div className={ui.panelHead}><h2 className={ui.panelTitle}>How it works</h2></div>
          <ol className={styles.steps}>
            <li><span>1</span> Share your code or link.</li>
            <li><span>2</span> A friend signs up with it.</li>
            <li><span>3</span> You get <strong>25 Gems</strong>, they get <strong>10 Gems</strong>.</li>
          </ol>
        </section>
        <section className={ui.panel} aria-labelledby="invited-heading">
          <div className={ui.panelHead}><h2 id="invited-heading" className={ui.panelTitle}>Friends joined · {data.invited.length}</h2></div>
          {data.invited.length === 0 ? (
            <p className={ui.empty}>No friends yet. Share your code to get started.</p>
          ) : (
            <ul className={styles.invited}>
              {data.invited.map((f) => (
                <li key={f.id}><Gem tone="blue" size={34} /><div><p>{f.name}</p><time dateTime={f.joinedAt}>{formatWhen(f.joinedAt)}</time></div><strong>+25 Gems</strong></li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
