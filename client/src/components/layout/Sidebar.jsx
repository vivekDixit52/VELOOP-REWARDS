import { NavLink, Link } from 'react-router-dom';
import { Gift, HelpCircle, History, LayoutDashboard, Repeat, Trophy, Users, Wallet } from 'lucide-react';
import BrandMark from './BrandMark.jsx';
import { chest } from '../../assets/index.js';
import { useAuth } from '../../context/AuthContext.jsx';
import ui from '../../styles/ui.module.css';
import styles from './Sidebar.module.css';

export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
  { to: '/rewards', label: 'Rewards', icon: Gift },
  { to: '/level-up', label: 'Level Up & Earn', icon: Trophy },
  { to: '/exchange', label: 'Exchange Center', icon: Repeat },
  { to: '/referrals', label: 'Referrals', icon: Users },
  { to: '/history', label: 'History', icon: History },
  { to: '/support', label: 'Support', icon: HelpCircle },
];

export default function Sidebar({ isOpen, onNavigate }) {
  const { user } = useAuth();
  return (
    <aside className={styles.sidebar} data-open={isOpen} aria-label="Primary">
      <Link to="/dashboard" className={styles.brandLink} onClick={onNavigate} aria-label="VELOOP Rewards home"><BrandMark /></Link>

      <nav className={styles.nav} aria-label="Main menu">
        <ul>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink to={to} className={({ isActive }) => styles.link + (isActive ? ` ${styles.active}` : '')} onClick={onNavigate}>
                <Icon size={18} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.earn}>
        <h2 className={styles.earnTitle}>Earn more Gems</h2>
        <img src={chest} alt="" aria-hidden="true" className={styles.chest} />
        <Link to="/level-up" className={`${ui.btn} ${ui.btnViolet} ${ui.btnBlock} ${ui.btnSm}`} onClick={onNavigate}>Explore now</Link>
      </div>

      <div className={styles.profile}>
        <span className={styles.avatar} aria-hidden="true">{user?.name?.[0]?.toUpperCase()}</span>
        <div className={styles.who}>
          <p className={styles.name}>{user?.name}</p>
          <p className={styles.meta}><span className={styles.level}>Level {user?.level}</span> ID {user?.veloopId}</p>
        </div>
      </div>
    </aside>
  );
}
