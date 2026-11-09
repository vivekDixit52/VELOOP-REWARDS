import { useEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';
import { formatNumber } from '../../utils.js';

/** Counts smoothly from the previous value to the new one. */
export default function AnimatedNumber({ value, className }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    if (reduce || previous.current === value) {
      setDisplay(value);
      previous.current = value;
      return undefined;
    }
    const controls = animate(previous.current, value, { duration: 1.1, ease: 'easeOut', onUpdate: (v) => setDisplay(Math.round(v)) });
    previous.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  return <span className={className}>{formatNumber(display)}</span>;
}
