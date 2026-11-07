import type { ReactNode } from 'react';
import clsx from 'clsx';
import { accentClass, type Accent } from './accent';

interface PixelPanelProps {
  /** Title bar text (pixel font). Leave out for a panel with no title bar. */
  title?: ReactNode;
  accent?: Accent;
  /** Shows a ✕ in the title bar */
  onClose?: () => void;
  /** Accessible name and symbol for the title-bar button (default "Close" / ✕) */
  closeLabel?: string;
  closeSymbol?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}

/** Solid panel with a notched pixel border and hard shadow (DESIGN.md §4). */
export function PixelPanel({ title, accent = 'cyan', onClose, closeLabel = 'Close', closeSymbol = '✕', className, bodyClassName, children }: PixelPanelProps) {
  return (
    <div className={clsx('arcade-panel', accentClass[accent], className)}>
      {(title || onClose) && (
        <div className="arcade-panel-title">
          <span>{title}</span>
          {onClose && (
            <button type="button" className="arcade-panel-close" aria-label={closeLabel} onClick={onClose}>{closeSymbol}</button>
          )}
        </div>
      )}
      <div className={clsx('arcade-panel-body', bodyClassName)}>{children}</div>
    </div>
  );
}
