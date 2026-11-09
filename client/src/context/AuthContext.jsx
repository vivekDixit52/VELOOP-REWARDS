import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, TOKEN_KEY } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!localStorage.getItem(TOKEN_KEY)) return undefined;
    api.get('/auth/me')
      .then((data) => !cancelled && setUser(data.user))
      .catch(() => !cancelled && clearSession())
      .finally(() => !cancelled && setBooting(false));
    return () => { cancelled = true; };
  }, [clearSession]);

  useEffect(() => {
    window.addEventListener('veloop:unauthorized', clearSession);
    return () => window.removeEventListener('veloop:unauthorized', clearSession);
  }, [clearSession]);

  const startSession = useCallback(({ token, user: nextUser }) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(nextUser);
  }, []);

  const value = useMemo(() => ({
    user,
    booting,
    setUser,
    login: async (credentials) => startSession(await api.post('/auth/login', credentials)),
    signup: async (details) => startSession(await api.post('/auth/signup', details)),
    logout: clearSession,
  }), [user, booting, startSession, clearSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
