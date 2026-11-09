import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import ExchangeLoader from '../exchange/ExchangeLoader.jsx';

export function ProtectedRoute({ children }) {
  const { user, booting } = useAuth();
  const location = useLocation();
  if (booting) return <ExchangeLoader fullScreen label="Opening your rewards..." />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

export function GuestRoute({ children }) {
  const { user, booting } = useAuth();
  const location = useLocation();
  if (booting) return <ExchangeLoader fullScreen label="Opening your rewards..." />;
  if (user) return <Navigate to={location.state?.from || '/dashboard'} replace />;
  return children;
}
