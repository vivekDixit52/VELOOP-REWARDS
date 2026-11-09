import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import styles from './Toast.module.css';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((kind, message) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((list) => [...list, { id, kind, message }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 4200);
  }, []);

  const value = useMemo(() => ({ success: (m) => push('success', m), error: (m) => push('error', m) }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.region} role="status" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div key={t.id} className={styles.toast} data-kind={t.kind} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
              {t.kind === 'success' ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
