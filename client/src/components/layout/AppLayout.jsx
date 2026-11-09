import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setIsNavOpen(false); window.scrollTo(0, 0); }, [pathname]);

  useEffect(() => {
    if (!isNavOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setIsNavOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isNavOpen]);

  return (
    <div className={styles.shell}>
      <Sidebar isOpen={isNavOpen} onNavigate={() => setIsNavOpen(false)} />
      {isNavOpen && <div className={styles.overlay} onClick={() => setIsNavOpen(false)} aria-hidden="true" />}
      <div className={styles.body}>
        <Topbar isNavOpen={isNavOpen} onToggleNav={() => setIsNavOpen((v) => !v)} />
        <main className={styles.main}>
          <div className={styles.content}><Outlet /></div>
        </main>
      </div>
    </div>
  );
}
