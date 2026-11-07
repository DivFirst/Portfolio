import { useEffect, useRef, useState, type ReactNode } from 'react';
import clsx from 'clsx';
import { accentClass, type Accent } from './accent';
import { useArcade } from './ArcadeProvider';
import { PixelPanel } from './PixelPanel';

interface HotspotProps {
  /** Screen-reader label, e.g. "Open: CAT preparation story" */
  label: string;
  /** Title of the info box */
  title: string;
  /** World accent colour for the ring */
  accent?: Accent;
  /** Info box colour (default yellow) */
  boxAccent?: Accent;
  children: ReactNode;
  className?: string;
}

/**
 * Pulsing "?" block that opens a small info box beside it (centred on phones).
 * Closes with ✕, Esc or a click outside (DESIGN.md §4).
 * Position it by placing it inside a `relative` container.
 */
export function Hotspot({ label, title, accent = 'cyan', boxAccent = 'yellow', children, className }: HotspotProps) {
  const { play } = useArcade();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const close = () => { setOpen(false); play('close'); };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    const onPointer = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) close();
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]); // close() is re-created each render; listeners are reset whenever `open` changes

  return (
    <div ref={wrapRef} className={clsx('relative inline-block', accentClass[accent], className)}>
      <button
        type="button"
        className="arcade-hotspot animate-arcade-pulse"
        aria-label={label}
        aria-expanded={open}
        onClick={() => { if (open) close(); else { setOpen(true); play('open'); } }}
      >
        ?
      </button>
      {open && (
        <>
          <div className="arcade-hotspot-backdrop" onPointerDown={close} />
          <div className="arcade-hotspot-popover animate-arcade-pop" role="dialog" aria-label={title}>
            <PixelPanel title={title} accent={boxAccent} onClose={close}>{children}</PixelPanel>
          </div>
        </>
      )}
    </div>
  );
}
