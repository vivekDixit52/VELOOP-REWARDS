import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client.js';

/** GET a path and track loading / error state. `reload` refetches. */
export function useFetch(path) {
  const [state, setState] = useState({ data: null, error: null, loading: true });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      setState({ data: await api.get(path), error: null, loading: false });
    } catch (error) {
      setState({ data: null, error, loading: false });
    }
  }, [path]);

  useEffect(() => { load(); }, [load]);

  return { ...state, reload: load };
}
