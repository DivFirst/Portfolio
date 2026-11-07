import clsx from 'clsx';
import { useArcade } from './ArcadeProvider';

/**
 * Full-screen scanlines + vignette (DESIGN.md §5). Click-through, purely visual.
 * Hidden when the CRT setting is off (Recruiter Mode) or when motion is reduced.
 * `soft` = lighter lines for the main site, so small HUD text stays sharp.
 */
export function CRTOverlay({ soft = false }: { soft?: boolean }) {
  const { crtOn, reducedMotion } = useArcade();
  if (!crtOn || reducedMotion) return null;
  return <div className={clsx('arcade-crt', soft && 'arcade-crt-soft')} aria-hidden="true" />;
}
