import styles from './BrandMark.module.css';

export default function BrandMark() {
  return (
    <div className={styles.brand}>
      <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
        <defs>
          <linearGradient id="brand-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c4b5fd" />
            <stop offset="1" stopColor="#f5c451" />
          </linearGradient>
        </defs>
        <path d="M4 8h9l7 16 7-16h9L24 34h-8z" fill="url(#brand-grad)" />
      </svg>
      <span className={styles.text}>VELOOP<small>REWARDS</small></span>
    </div>
  );
}
