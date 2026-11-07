import { useEffect, useRef } from 'react';

/**
 * Offers Recruiter Mode when the 3D world won't work well on this device:
 *   lowend  → before the 3D code downloads (old/slow phone, data saver, software graphics)
 *   slow    → the world is loading very slowly or running at a low frame rate
 *   broken  → the 3D world failed to start (WebGL error or lost graphics context)
 * Sits above the intro screens. Readable body font, no animation (DESIGN.md §4 "Mode select").
 */
export type LiteReason = 'lowend' | 'slow' | 'broken';

const copy: Record<LiteReason, { title: string; text: string; stay: string }> = {
  lowend: {
    title: 'Quick check',
    text: 'The 3D arcade game may run slowly on this device. Recruiter Mode shows my whole CV on one fast page.',
    stay: '🕹️ Play the 3D game anyway',
  },
  slow: {
    title: 'Running slow',
    text: 'The 3D world is struggling on this device. Recruiter Mode shows my whole CV on one fast page.',
    stay: 'Keep playing',
  },
  broken: {
    title: 'Game over (sort of)',
    text: 'The 3D world couldn’t start on this device. Recruiter Mode has everything, on one fast page.',
    stay: '↻ Try again',
  },
};

export function LiteModeOffer({ reason, onStay }: { reason: LiteReason; onStay: () => void }) {
  const c = copy[reason];
  const firstRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => { firstRef.current?.focus({ preventScroll: true }); }, [reason]);

  return (
    <div className="arcade-lite-layer">
      <div className="arcade-panel arcade-accent-cyan arcade-lite-box" role="alertdialog" aria-modal="true" aria-labelledby="lite-title" aria-describedby="lite-text">
        <div className="arcade-panel-title"><span id="lite-title">{c.title}</span></div>
        <div className="arcade-panel-body">
          <p id="lite-text" className="text-[17px] leading-relaxed text-arcade-text">{c.text}</p>
          <div className="mt-6 flex flex-col gap-4">
            <a ref={firstRef} href="/cv?from=lite" className="arcade-btn arcade-btn-secondary">📄 Open Recruiter Mode</a>
            <button
              type="button"
              className="arcade-btn arcade-btn-ghost"
              onClick={() => (reason === 'broken' ? window.location.reload() : onStay())}
            >
              {c.stay}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
