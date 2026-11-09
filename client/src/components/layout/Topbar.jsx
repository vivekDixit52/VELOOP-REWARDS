import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import BrandMark from './BrandMark.jsx';
import Gem from '../common/Gem.jsx';
import VeCoin from '../common/VeCoin.jsx';
import InfoTip from '../common/InfoTip.jsx';
import AnimatedNumber from '../common/AnimatedNumber.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { infoTips } from '../../data/exchangeData.js';
import styles from './Topbar.module.css';

export default function Topbar({ isNavOpen, onToggleNav }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onPointer = (e) => { if (!menuRef.current?.contains(e.target)) setMenuOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onPointer); document.removeEventListener('keydown', onKey); };
  }, [menuOpen]);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <header className={styles.topbar}>
      <button type="button" className={styles.menuButton} aria-label={isNavOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={isNavOpen} onClick={onToggleNav}>
        {isNavOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
      </button>
      <div className={styles.brand}><BrandMark /></div>

      <div className={styles.right}>
        <div className={styles.chip}>
          <Gem tone="purple" size={30} />
          <div><AnimatedNumber value={user.gems} className={styles.num} /><span className={styles.unit}>Gems</span></div>
          <InfoTip label={infoTips.gems.label} title={infoTips.gems.title} align="end">{infoTips.gems.text}</InfoTip>
        </div>
        <div className={styles.chip}>
          <VeCoin size={28} />
          <div><AnimatedNumber value={user.ves} className={`${styles.num} ${styles.gold}`} /><span className={styles.unit}>VEs</span></div>
          <InfoTip label={infoTips.ves.label} title={infoTips.ves.title} align="end">{infoTips.ves.text}</InfoTip>
        </div>

        <div className={styles.account} ref={menuRef}>
          <button type="button" className={styles.avatar} aria-label="Account menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
            {user.name[0].toUpperCase()}
          </button>
          {menuOpen && (
            <div className={styles.menu} role="menu">
              <p className={styles.menuName}>{user.name}</p>
              <p className={styles.menuEmail}>{user.email}</p>
              <button type="button" role="menuitem" className={styles.logout} onClick={handleLogout}><LogOut size={16} aria-hidden="true" /> Log out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
