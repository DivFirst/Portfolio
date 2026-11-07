import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { accentClass, accentTextClass, type Accent } from './accent';
import { useReducedMotion } from './ArcadeProvider';
import { useInView } from './useInView';

interface ScoreCounterProps {
  value: number;
  /** Small pixel label above the number. Leave empty to show just the number. */
  label?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Zero-pad to this many digits, e.g. 6 → 000099 */
  pad?: number;
  size?: 'sm' | 'md' | 'lg';
  accent?: Accent;
  className?: string;
}

const sizeClass = {
  sm: 'text-[28px]',
  md: 'text-[36px] md:text-[48px]',
  lg: 'text-[56px] md:text-[72px]',
};

/** Number that counts up the first time it scrolls into view (DESIGN.md §4). */
export function ScoreCounter({
  value, label, decimals = 0, prefix = '', suffix = '', pad = 0, size = 'md', accent = 'yellow', className,
}: ScoreCounterProps) {
  const reduced = useReducedMotion();
  const [ref, seen] = useInView<HTMLDivElement>();
  const [n, setN] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) { setN(value); return; }
    if (!seen) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 800);
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value, reduced]);

  const shown = n.toFixed(decimals).padStart(pad, '0');
  const finalText = `${prefix}${value.toFixed(decimals)}${suffix}`;

  return (
    <div ref={ref} className={className}>
      {label && <div className="arcade-display text-[10px] text-arcade-muted">{label}</div>}
      <div
        className={clsx('arcade-score my-1.5 arcade-glow', sizeClass[size], accentTextClass[accent], accentClass[accent])}
        role="img"
        aria-label={label ? `${label}: ${finalText}` : finalText}
      >
        <span aria-hidden="true">{prefix}{shown}{suffix}</span>
      </div>
    </div>
  );
}
