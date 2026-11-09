import { useEffect, useId, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import styles from './InfoTip.module.css';

/** ⓘ icon that explains a term. Opens on hover, click/tap or keyboard; Esc closes. */
export default function InfoTip({ label, title, children, align = 'start' }) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const wrapperRef = useRef(null);
  const tooltipId = useId();
  const isOpen = hovered || pinned;

  useEffect(() => {
    if (!isOpen) return undefined;
    const close = () => { setHovered(false); setPinned(false); };
    const onPointerDown = (event) => { if (!wrapperRef.current?.contains(event.target)) close(); };
    const onKeyDown = (event) => { if (event.key === 'Escape') close(); };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <span className={styles.wrapper} ref={wrapperRef} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <button type="button" className={styles.trigger} aria-label={`About ${label}`} aria-expanded={isOpen} aria-describedby={isOpen ? tooltipId : undefined} onClick={() => setPinned((v) => !v)}>
        <Info size={13} aria-hidden="true" />
      </button>
      {isOpen && (
        <span role="tooltip" id={tooltipId} className={styles.popover} data-align={align}>
          <strong className={styles.title}>{title}</strong>
          <span className={styles.text}>{children}</span>
        </span>
      )}
    </span>
  );
}
