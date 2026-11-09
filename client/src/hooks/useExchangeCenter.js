import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Loads exchange options + history from the API and performs conversions.
 * A lock blocks overlapping conversions; the server also de-duplicates by idempotency key.
 */
export function useExchangeCenter() {
  const { setUser } = useAuth();
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [options, setOptions] = useState([]);
  const [history, setHistory] = useState([]);
  const requestId = useRef(0);
  const lock = useRef(false);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    setStatus('loading');
    try {
      const data = await api.get('/exchange');
      if (id !== requestId.current) return;
      setOptions(data.options);
      setHistory(data.history);
      setUser(data.user);
      setStatus('ready');
    } catch {
      if (id === requestId.current) setStatus('error');
    }
  }, [setUser]);

  useEffect(() => { load(); }, [load]);

  const convert = useCallback(async (option, idempotencyKey) => {
    if (lock.current) return { ok: false, reason: 'busy' };
    lock.current = true;
    try {
      // A short minimum delay keeps the "Converting..." state readable.
      const [data] = await Promise.all([api.post('/exchange/convert', { optionId: option.id, idempotencyKey }), wait(1100)]);
      setUser(data.user);
      setHistory((list) => (list.some((i) => i.id === data.activity.id) ? list : [{ ...data.activity, isNew: true }, ...list]));
      return { ok: true, receipt: { gemsSpent: option.requiredGems, vesReceived: option.receiveVEs } };
    } catch (error) {
      return { ok: false, reason: 'failed', message: error.message };
    } finally {
      lock.current = false;
    }
  }, [setUser]);

  return { status, options, history, convert, reload: load };
}
