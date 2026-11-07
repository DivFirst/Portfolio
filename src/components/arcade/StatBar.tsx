import clsx from 'clsx';
import { accentClass, accentTextClass, type Accent } from './accent';
import { useReducedMotion } from './ArcadeProvider';
import { useInView } from './useInView';

interface StatBarProps {
  label: string;
  /** 0–100. Truth rule: must be a real number from the resume or from Divyanshu. */
  value: number;
  /** Text shown on the right, e.g. "99.60 %ile". Defaults to `${value}%`. */
  display?: string;
  accent?: Accent;
  className?: string;
}

/** Segmented bar that fills the first time it scrolls into view (DESIGN.md §4). */
export function StatBar({ label, value, display, accent = 'green', className }: StatBarProps) {
  const reduced = useReducedMotion();
  const [ref, seen] = useInView<HTMLDivElement>();
  const pct = Math.max(0, Math.min(100, value));
  const width = reduced || seen ? pct : 0;

  return (
    <div ref={ref} className={clsx(accentClass[accent], 'mb-[18px]', className)}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="arcade-display text-[10px] text-arcade-text">{label}</span>
        <span className={clsx('arcade-score text-[26px]', accentTextClass[accent])}>{display ?? `${value}%`}</span>
      </div>
      <div
        className="arcade-stat-track"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={display}
      >
        <div className="arcade-stat-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
