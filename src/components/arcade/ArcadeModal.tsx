import { useEffect, useId, useRef, type ReactNode } from 'react';
import clsx from 'clsx';
import { accentClass, type Accent } from './accent';
import { useArcade } from './ArcadeProvider';

interface ArcadeModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  accent?: Accent;
  children: ReactNode;
  /** wider box for grids (Trophy Room) */
  wide?: boolean;
  className?: string;
}

/**
 * Full-screen pixel pop-up (Trophy Room, CONTINUE?, cheat code).
 * Closes with ✕, Esc or a click on the dark backdrop. Keyboard focus moves into the box
 * when it opens and returns to where it was when it closes.
 */
export function ArcadeModal({ open, onClose, title, accent = 'yellow', children, wide = false, className }: ArcadeModalProps) {
  const { play } = useArcade();
  const boxRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    play('open');
    // focus the first button/link inside (or the box itself)
    const first = boxRef.current?.querySelector<HTMLElement>('a[href], button:not([disabled])');
    (first ?? boxRef.current)?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); closeRef.current(); }
      // keep Tab inside the box
      if (e.key === 'Tab' && boxRef.current) {
        const items = [...boxRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
        if (!items.length) return;
        const firstEl = items[0], lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      play('close');
      previous?.focus?.({ preventScroll: true });
    };
  }, [open, play]);

  if (!open) return null;

  return (
    <div className="arcade-modal-backdrop" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={clsx('arcade-panel arcade-modal animate-arcade-pop', accentClass[accent], wide && 'arcade-modal-wide', className)}
      >
        <div className="arcade-panel-title">
          <span id={titleId}>{title}</span>
          <button type="button" className="arcade-panel-close arcade-modal-close" aria-label="Close" onClick={onClose}>✕</button>
        </div>
        <div className="arcade-modal-body">{children}</div>
      </div>
    </div>
  );
}
