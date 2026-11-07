import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { accentClass, useReducedMotion, type Accent } from '../arcade';
import { formatMetric, type WorldRide } from '../../data/worldRides';
import { getRideProgress, useRidePercent } from './rideStore';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const fmt = formatMetric;

/**
 * The ride's "floor screen": a solid pixel panel beside the 3D scene showing the current
 * chapter's heading, numbers and skill groups. Everything is tied to the scroll position:
 *  - the panel slides in as its chapter arrives and out as it leaves,
 *  - numbers count up on the way in and back down when scrolling up.
 * Reduced motion: no slide or counting (final numbers), and the scene fades through
 * black between chapters instead of the camera gliding.
 * pointer-events: none, so wheel / swipe over the panel still scrolls the ride.
 */
export function RideScreenPanel({ ride, accent }: { ride: WorldRide; accent: Accent }) {
  const reducedMotion = useReducedMotion();
  const percent = useRidePercent();
  const n = ride.chapters.length;
  const index = n > 1 ? Math.round((percent / 100) * (n - 1)) : 0;
  const chapter = ride.chapters[index];
  const screen = chapter.screen;

  const panelRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const x = getRideProgress() * (n - 1);
      const d = x - index; // -0.5 … 0.5 around this chapter's keyframe
      const shown = clamp01((0.5 - Math.abs(d)) / 0.14);
      const panel = panelRef.current;
      if (panel) {
        panel.style.opacity = String(shown);
        panel.style.translate = reducedMotion ? '0 0' : `${Math.round((1 - shown) * 32)}px 0`;
      }
      const arrive = reducedMotion ? 1 : smooth(clamp01((d + 0.5) / 0.4));
      screen?.metrics?.forEach((m, i) => {
        const el = numberRefs.current[i];
        if (el) el.textContent = fmt(m, m.value * arrive);
      });
      if (fadeRef.current) {
        const f = x - Math.floor(x);
        fadeRef.current.style.opacity = reducedMotion && n > 1 ? String(clamp01(1 - Math.abs(f - 0.5) / 0.16)) : '0';
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [index, n, screen, reducedMotion]);

  return (
    <>
      {reducedMotion && <div ref={fadeRef} className="arcade-ride-fade" aria-hidden="true" />}
      {screen && (
        <div
          ref={panelRef}
          className={clsx('arcade-ride-screen', accentClass[accent], percent < 4 && 'has-hint')}
          role="region"
          aria-label={`${chapter.label}: ${screen.heading}`}
        >
          <p className="arcade-display arcade-ride-screen-title">{screen.heading}</p>
          {screen.sub && <p className="arcade-ride-screen-sub">{screen.sub}</p>}
          {screen.metrics && (
            <dl className="arcade-ride-metrics">
              {screen.metrics.map((m, i) => (
                <div key={m.label} className="arcade-ride-metric">
                  <dt className="arcade-display">{m.label}</dt>
                  <dd>
                    <span className="sr-only">{fmt(m, m.value)}</span>
                    <span
                      aria-hidden="true"
                      className="arcade-score arcade-ride-number"
                      ref={(el) => { numberRefs.current[i] = el; }}
                    >
                      {fmt(m, reducedMotion ? m.value : 0)}
                    </span>
                    {m.note && <span className="arcade-ride-note">{m.note}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {screen.groups?.map((g) => (
            <div key={g.title} className="arcade-ride-group">
              <p className="arcade-ride-group-title">{g.title}</p>
              <ul>
                {g.items.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
