import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import styles from './Dialog.module.css';

const FOCUSABLE = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal: focus trap, Esc to close, focus restored on close, body scroll locked.
 * Pass canClose={false} while an action is processing.
 */
export default function Dialog({ titleId, onClose, canClose = true, returnFocusTo, tone = 'purple', size = 'md', children, showClose = true }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      returnFocusTo?.focus?.();
    };
  }, [returnFocusTo]);

  // Move focus into the dialog whenever its content changes.
  useEffect(() => {
    const el = dialogRef.current;
    (el?.querySelector('[data-autofocus]') ?? el)?.focus();
  });

  const requestClose = () => { if (canClose) onClose(); };

  const onKeyDown = (event) => {
    if (event.key === 'Escape') { event.stopPropagation(); requestClose(); return; }
    if (event.key !== 'Tab') return;
    const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)];
    if (!items.length) { event.preventDefault(); return; }
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  return createPortal(
    <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && requestClose()}>
      <motion.div
        ref={dialogRef} className={styles.dialog} data-tone={tone} data-size={size}
        role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onKeyDown={onKeyDown}
        initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        {showClose && (
          <button type="button" className={styles.close} aria-label="Close dialog" onClick={requestClose} disabled={!canClose}>
            <X size={18} aria-hidden="true" />
          </button>
        )}
        {children}
      </motion.div>
    </motion.div>,
    document.body,
  );
}
