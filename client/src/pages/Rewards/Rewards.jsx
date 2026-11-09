import { useId, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Copy, Loader2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Dialog from '../../components/common/Dialog.jsx';
import Gem from '../../components/common/Gem.jsx';
import VeCoin from '../../components/common/VeCoin.jsx';
import ExchangeLoader from '../../components/exchange/ExchangeLoader.jsx';
import ExchangeErrorState from '../../components/exchange/ExchangeErrorState.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../api/client.js';
import { chest } from '../../assets/index.js';
import { formatNumber } from '../../utils.js';
import ui from '../../styles/ui.module.css';
import styles from './Rewards.module.css';

export default function Rewards() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch('/rewards');
  const [selected, setSelected] = useState(null); // { reward, trigger }
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState('');
  const titleId = useId();

  const close = () => { setSelected(null); setCode(''); };

  const redeem = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await api.post('/rewards/redeem', { rewardId: selected.reward.id });
      setUser(result.user);
      setCode(result.code);
    } catch (err) {
      toast.error(err.message);
      close();
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(code); toast.success('Code copied'); } catch { toast.error('Could not copy. Select the code and copy it manually.'); }
  };

  if (loading) return <ExchangeLoader label="Loading rewards..." />;
  if (error) return <ExchangeErrorState onRetry={reload} />;

  return (
    <div className={ui.stack}>
      <PageHeader title="Rewards" subtitle="Redeem your VEs for rewards." />
      <section className={styles.banner}>
        <div><p className={styles.bannerLabel}>Your balance</p><p className={styles.bannerValue}><VeCoin size={44} /> {formatNumber(user.ves)} <span>VEs</span></p></div>
        <img src={chest} alt="" aria-hidden="true" className={styles.chest} />
      </section>

      <div className={styles.grid}>
        {data.rewards.map((reward) => {
          const affordable = user.ves >= reward.costVEs;
          return (
            <article key={reward.id} className={styles.card} data-tone={reward.tone}>
              <div className={styles.art}><Gem tone={reward.tone} size={150} /></div>
              <p className={styles.category}>{reward.category}</p>
              <h3 className={styles.name}>{reward.title}</h3>
              <p className={styles.cost}><VeCoin size={24} /> {formatNumber(reward.costVEs)} VEs</p>
              <button type="button" className={`${ui.btn} ${affordable ? ui.btnGold : ui.btnGhost} ${ui.btnBlock}`} disabled={!affordable} onClick={(e) => setSelected({ reward, trigger: e.currentTarget })}>
                {affordable ? 'Redeem' : `Need ${formatNumber(reward.costVEs - user.ves)} more VEs`}
              </button>
            </article>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <Dialog key={selected.reward.id} titleId={titleId} onClose={close} canClose={!busy} returnFocusTo={selected.trigger} tone={selected.reward.tone} size="sm">
            {code ? (
              <div className={styles.dialogBody}>
                <Gem tone={selected.reward.tone} size={130} />
                <h2 id={titleId} className={styles.dialogTitle}>Reward redeemed</h2>
                <p className={ui.muted}>{selected.reward.title}</p>
                <div className={styles.code}><code>{code}</code><button type="button" className={`${ui.btn} ${ui.btnGhost} ${ui.btnSm}`} onClick={copy} aria-label="Copy code"><Copy size={15} aria-hidden="true" /> Copy</button></div>
                <button type="button" className={`${ui.btn} ${ui.btnGold} ${ui.btnBlock}`} onClick={close} data-autofocus>Done</button>
              </div>
            ) : (
              <div className={styles.dialogBody}>
                <Gem tone={selected.reward.tone} size={130} />
                <h2 id={titleId} className={styles.dialogTitle}>Redeem this reward?</h2>
                <p className={ui.muted}>{selected.reward.title}</p>
                <p className={styles.spend}><VeCoin size={26} /> {formatNumber(selected.reward.costVEs)} VEs</p>
                <p className={ui.muted}>Balance after: {formatNumber(user.ves - selected.reward.costVEs)} VEs</p>
                <div className={styles.dialogActions}>
                  <button type="button" className={`${ui.btn} ${ui.btnGhost}`} onClick={close} disabled={busy}>Cancel</button>
                  <button type="button" className={`${ui.btn} ${ui.btnGold}`} onClick={redeem} disabled={busy} aria-busy={busy} data-autofocus="true">
                    {busy ? <><Loader2 size={16} className="spin" aria-hidden="true" /> Redeeming...</> : 'Confirm'}
                  </button>
                </div>
              </div>
            )}
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
