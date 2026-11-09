import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import styles from './DemoControls.module.css';

const SCENARIOS = [
  { id: 'normal', label: 'Normal' },
  { id: 'lowGems', label: 'Low Gems' },
  { id: 'loading', label: 'Loading' },
  { id: 'empty', label: 'Empty' },
  { id: 'error', label: 'Error' },
];

/** Preview-only panel (dev builds) for capturing every UI state. Never changes saved data. */
export default function DemoControls({ scenario, onSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.wrapper}>
      {open && (
        <div className={styles.menu} role="group" aria-label="Preview states">
          {SCENARIOS.map(({ id, label }) => (
            <button key={id} type="button" className={styles.option} aria-pressed={scenario === id} onClick={() => onSelect(id)}>{label}</button>
          ))}
        </div>
      )}
      <button type="button" className={styles.toggle} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <SlidersHorizontal size={16} aria-hidden="true" /> Preview states
      </button>
    </div>
  );
}
