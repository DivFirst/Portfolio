import clsx from 'clsx';
import { accentClass, type Accent } from './accent';

interface LoadingBarProps {
  /** 0–100 */
  percent: number;
  accent?: Accent;
  label?: string;
  className?: string;
}

const SEGMENTS = 20;

/** Segmented pixel "LOADING…" bar (same look as StatBar). Shows the number as text too. */
export function LoadingBar({ percent, accent = 'yellow', label = 'Loading…', className }: LoadingBarProps) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));
  const lit = Math.round((value / 100) * SEGMENTS);
  return (
    <div className={clsx('arcade-loading', accentClass[accent], className)}>
      <div className="arcade-loading-head">
        <span className="arcade-display text-[10px]">{label}</span>
        <span className="arcade-score text-2xl text-arcade-text">{String(value).padStart(3, '0')}%</span>
      </div>
      <div
        className="arcade-loading-track"
        role="progressbar"
        aria-label="Loading the 3D world"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span key={i} className={clsx('arcade-loading-seg', i < lit && 'is-lit')} />
        ))}
      </div>
    </div>
  );
}
