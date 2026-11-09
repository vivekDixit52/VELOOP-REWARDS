import { useId, useRef, useState } from 'react';
import { AlertCircle, ArrowDown, Loader2 } from 'lucide-react';
import Dialog from '../common/Dialog.jsx';
import Gem from '../common/Gem.jsx';
import VeCoin from '../common/VeCoin.jsx';
import ConversionSuccess from './ConversionSuccess.jsx';
import { formatNumber, makeKey } from '../../utils.js';
import styles from './ExchangeModal.module.css';

/** Confirmation flow: review -> processing -> success | failed. */
export default function ExchangeModal({ option, balances, onConfirm, onClose, returnFocusTo }) {
  const [phase, setPhase] = useState('review');
  const [receipt, setReceipt] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [startBalances] = useState(balances);
  const [endBalances, setEndBalances] = useState(null);
  const idempotencyKey = useRef(makeKey()); // reused on retry, so a retry can't double-convert
  const titleId = useId();
  const isProcessing = phase === 'processing';

  const gemsAfter = startBalances.gems - option.requiredGems;
  const vesAfter = startBalances.ves + option.receiveVEs;

  const handleConfirm = async () => {
    if (isProcessing) return;
    setPhase('processing');
    const result = await onConfirm(option, idempotencyKey.current);
    if (result.ok) {
      setReceipt(result.receipt);
      setEndBalances({ gems: gemsAfter, ves: vesAfter });
      setPhase('success');
    } else {
      setErrorMessage(result.reason === 'failed' ? result.message : '');
      setPhase('failed');
    }
  };

  return (
    <Dialog titleId={titleId} onClose={onClose} canClose={!isProcessing} returnFocusTo={returnFocusTo} tone={option.tone} showClose={phase !== 'success'}>
      {phase === 'success' && <ConversionSuccess titleId={titleId} receipt={receipt} balances={endBalances} onContinue={onClose} />}

      {phase === 'failed' && (
        <div className={styles.failed} role="alert">
          <span className={styles.failedIcon}><AlertCircle size={30} aria-hidden="true" /></span>
          <h2 id={titleId} className={styles.title}>Conversion not completed</h2>
          <p className={styles.sub}>{errorMessage || 'Something went wrong.'} Your Gems and VEs have not changed.</p>
          <div className={styles.actions}>
            <button type="button" className={styles.secondary} onClick={onClose}>Close</button>
            <button type="button" className={styles.primary} onClick={() => setPhase('review')} data-autofocus>Try again</button>
          </div>
        </div>
      )}

      {(phase === 'review' || phase === 'processing') && (
        <>
          <h2 id={titleId} className={styles.title}>Confirm Conversion</h2>
          <p className={styles.sub}>{option.title}</p>

          <div className={styles.pathway} data-tone={option.tone}>
            <div className={styles.node}>
              <Gem tone={option.tone} size={120} className={styles.gem} />
              <p><strong>{formatNumber(option.requiredGems)}</strong> Gems</p>
            </div>
            <ArrowDown size={24} className={styles.arrow} aria-hidden="true" />
            <div className={styles.node}>
              <VeCoin size={76} className={styles.coin} />
              <p className={styles.reward}><strong>{formatNumber(option.receiveVEs)}</strong> VEs</p>
            </div>
          </div>

          <dl className={styles.after}>
            <div><dt>Gems after conversion</dt><dd><span>{formatNumber(startBalances.gems)}</span> → <strong>{formatNumber(gemsAfter)}</strong></dd></div>
            <div><dt>VEs after conversion</dt><dd><span>{formatNumber(startBalances.ves)}</span> → <strong className={styles.gold}>{formatNumber(vesAfter)}</strong></dd></div>
          </dl>

          <div className={styles.actions}>
            <button type="button" className={styles.secondary} onClick={onClose} disabled={isProcessing}>Cancel</button>
            <button type="button" className={styles.primary} onClick={handleConfirm} disabled={isProcessing} aria-busy={isProcessing} data-autofocus={isProcessing ? undefined : 'true'}>
              {isProcessing ? <><Loader2 size={17} className={styles.spin} aria-hidden="true" /> Converting...</> : 'Confirm Conversion'}
            </button>
          </div>
        </>
      )}
    </Dialog>
  );
}
