import { gems } from '../../assets/index.js';
import styles from './Art.module.css';
import { cx } from '../../utils.js';

/** Official VELOOP Gem artwork. `tone`: purple | blue | green | orange. */
export default function Gem({ tone = 'purple', size = 48, className }) {
  return <img src={gems[tone] ?? gems.purple} width={size} alt="" aria-hidden="true" draggable={false} className={cx(styles.art, className)} />;
}
