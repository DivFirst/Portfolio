import type { ReactNode } from 'react';
import clsx from 'clsx';
import { accentClass, type Accent } from './accent';

interface BadgeProps {
  icon: ReactNode;
  title: string;
  detail?: string;
  locked?: boolean;
  className?: string;
}

/** Trophy Room badge (DESIGN.md §4). Locked badges are greyed out. */
export function Badge({ icon, title, detail, locked = false, className }: BadgeProps) {
  return (
    <div className={clsx('arcade-badge', locked && 'arcade-badge-locked', className)}>
      <div className={clsx('mb-2.5 text-[28px] leading-none', locked && 'opacity-50 grayscale')} aria-hidden="true">{icon}</div>
      <div className={clsx('arcade-display mb-1.5 text-[10px]', locked ? 'text-arcade-dim' : 'text-arcade-yellow')}>
        {locked && <span className="sr-only">Locked: </span>}
        {title}
      </div>
      {detail && <div className="text-[13px] leading-snug text-arcade-muted">{detail}</div>}
    </div>
  );
}

/** Small one-line label, e.g. "CURRENT ROLE". */
export function Tag({ children, accent = 'pink', className }: { children: ReactNode; accent?: Accent; className?: string }) {
  return <span className={clsx('arcade-tag', accentClass[accent], className)}>{children}</span>;
}
