import { Link, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import { GuestRoute, ProtectedRoute } from './components/layout/RouteGuards.jsx';
import Login from './pages/Auth/Login.jsx';
import Signup from './pages/Auth/Signup.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Wallet from './pages/Wallet/Wallet.jsx';
import Rewards from './pages/Rewards/Rewards.jsx';
import LevelUp from './pages/LevelUp/LevelUp.jsx';
import ExchangeCenter from './pages/ExchangeCenter/ExchangeCenter.jsx';
import Referrals from './pages/Referrals/Referrals.jsx';
import History from './pages/History/History.jsx';
import Support from './pages/Support/Support.jsx';
import ui from './styles/ui.module.css';

function NotFound() {
  return (
    <div className={ui.empty} style={{ minHeight: '60vh', alignContent: 'center' }}>
      <h1>Page not found</h1>
      <Link to="/dashboard" className={`${ui.btn} ${ui.btnGold}`}>Back to dashboard</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/level-up" element={<LevelUp />} />
        <Route path="/exchange" element={<ExchangeCenter />} />
        <Route path="/referrals" element={<Referrals />} />
        <Route path="/history" element={<History />} />
        <Route path="/support" element={<Support />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
