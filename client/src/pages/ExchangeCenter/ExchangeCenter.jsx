import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ExchangeHero from '../../components/exchange/ExchangeHero.jsx';
import BalanceOverview from '../../components/exchange/BalanceOverview.jsx';
import ExchangeCard from '../../components/exchange/ExchangeCard.jsx';
import ExchangeModal from '../../components/exchange/ExchangeModal.jsx';
import ExchangeHistory from '../../components/exchange/ExchangeHistory.jsx';
import ExchangeRules from '../../components/exchange/ExchangeRules.jsx';
import ExchangeGlossary from '../../components/exchange/ExchangeGlossary.jsx';
import HowExchangeWorks from '../../components/exchange/HowExchangeWorks.jsx';
import EarnGemsBanner from '../../components/exchange/EarnGemsBanner.jsx';
import ExchangeLoader from '../../components/exchange/ExchangeLoader.jsx';
import ExchangeEmptyState from '../../components/exchange/ExchangeEmptyState.jsx';
import ExchangeErrorState from '../../components/exchange/ExchangeErrorState.jsx';
import DemoControls from '../../components/exchange/DemoControls.jsx';
import InfoTip from '../../components/common/InfoTip.jsx';
import { useExchangeCenter } from '../../hooks/useExchangeCenter.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { infoTips } from '../../data/exchangeData.js';
import styles from './ExchangeCenter.module.css';

const SHOW_PREVIEW = import.meta.env.DEV || import.meta.env.VITE_SHOW_PREVIEW_STATES === 'true';
const LOW_GEMS_PREVIEW = 34;

export default function ExchangeCenter() {
  const { user } = useAuth();
  const { status, options, history, convert, reload } = useExchangeCenter();
  const [active, setActive] = useState(null); // { option, trigger }
  const [preview, setPreview] = useState('normal');

  // "Loading" preview shows the loader for a few seconds, then returns to normal.
  useEffect(() => {
    if (preview !== 'loading') return undefined;
    const timer = setTimeout(() => setPreview('normal'), 4000);
    return () => clearTimeout(timer);
  }, [preview]);

  const gems = preview === 'lowGems' ? LOW_GEMS_PREVIEW : user.gems;
  const visibleOptions = preview === 'empty' ? [] : options;
  const showLoader = status === 'loading' || preview === 'loading';
  const showError = !showLoader && (status === 'error' || preview === 'error');

  const handleRetry = () => { setPreview('normal'); reload(); };
  const scrollToEarn = () => document.getElementById('earn-gems')?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return (
    <>
      {showLoader && <ExchangeLoader />}
      {showError && <ExchangeErrorState onRetry={handleRetry} />}

      {!showLoader && !showError && (
        <motion.div className={styles.layout} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
          <div className={styles.main}>
            <ExchangeHero><BalanceOverview gems={gems} ves={user.ves} /></ExchangeHero>

            <section className={styles.conversions} aria-labelledby="conversions-heading">
              <div className={styles.sectionHead}>
                <h2 id="conversions-heading" className={styles.sectionTitle}>
                  Available Conversions <InfoTip label={infoTips.rate.label} title={infoTips.rate.title}>{infoTips.rate.text}</InfoTip>
                </h2>
                <p className={styles.sectionText}>Choose a conversion that works best for you.</p>
              </div>
              {visibleOptions.length > 0 ? (
                <div className={styles.grid}>
                  {visibleOptions.map((option) => (
                    <ExchangeCard key={option.id} option={option} availableGems={gems} onConvert={(selected, trigger) => setActive({ option: selected, trigger })} onEarnMore={scrollToEarn} />
                  ))}
                </div>
              ) : (
                <ExchangeEmptyState />
              )}
              <EarnGemsBanner />
            </section>

            <HowExchangeWorks />
          </div>

          <aside className={styles.rail} aria-label="Exchange information">
            <ExchangeHistory items={history} />
            <ExchangeRules />
            <ExchangeGlossary />
          </aside>
        </motion.div>
      )}

      <AnimatePresence>
        {active && (
          <ExchangeModal key={active.option.id} option={active.option} balances={{ gems, ves: user.ves }} onConfirm={convert} onClose={() => setActive(null)} returnFocusTo={active.trigger} />
        )}
      </AnimatePresence>

      {SHOW_PREVIEW && <DemoControls scenario={preview} onSelect={setPreview} />}
    </>
  );
}
