import { coin } from '../../assets/index.js';
import styles from './Art.module.css';
import { cx } from '../../utils.js';

/** Official VE coin artwork. */
export default function VeCoin({ size = 48, className }) {
  return <img src={coin} width={size} alt="" aria-hidden="true" draggable={false} className={cx(styles.art, className)} />;
}
