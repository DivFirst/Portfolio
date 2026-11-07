import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import clsx from 'clsx';
import { useArcade } from './ArcadeProvider';
import { ArcadeButton } from './ArcadeButton';
import { BlinkingText } from './BlinkingText';
import { CRTOverlay } from './CRTOverlay';
import { LoadingBar } from './LoadingBar';
import { SoundToggle } from './SoundToggle';

interface BootScreenProps {
  /** 0–100, real loading progress of the 3D world */
  progress: number;
  /** called when the player starts (after the short power-off animation) */
  onStart: () => void;
  /** "RECRUITER MODE: skip to CV" target (the /cv page) */
  recruiterHref: string;
  /** called when the Recruiter Mode button is used */
  onRecruiter?: () => void;
  name?: string;
  headline?: string;
  /**
   * "quick": returning visitors. Only a small loading bar, no flicker, no PRESS START:
   * enters the world on its own as soon as it is ready.
   */
  variant?: 'full' | 'quick';
}

const OFF_MS = 280;

/**
 * Arcade boot screen + loading screen (BUILD_GUIDE Part 2, step 1; DESIGN.md §4, §5, §7).
 * CRT power-on and flicker run once; PRESS START works with click, tap, Enter or Space.
 */
export function BootScreen({
  progress,
  onStart,
  recruiterHref,
  onRecruiter,
  name = 'Divyanshu Garg',
  headline,
  variant = 'full',
}: BootScreenProps) {
  const { play, reducedMotion } = useArcade();
  const ready = progress >= 100;
  const [leaving, setLeaving] = useState(false);
  const leavingRef = useRef(false);
  const startRef = useRef<HTMLButtonElement>(null);

  const start = useCallback(() => {
    if (!ready || leavingRef.current) return;
    leavingRef.current = true;
    if (variant === 'full') play('coin');
    if (reducedMotion) { onStart(); return; }
    setLeaving(true);
    window.setTimeout(onStart, OFF_MS);
  }, [ready, variant, play, reducedMotion, onStart]);

  // Returning visitors go straight in once the world is ready.
  useEffect(() => { if (variant === 'quick' && ready) start(); }, [variant, ready, start]);

  // Put keyboard focus on PRESS START as soon as it appears.
  useEffect(() => { if (variant === 'full' && ready) startRef.current?.focus({ preventScroll: true }); }, [variant, ready]);

  // Enter / Space anywhere (unless another button or link has focus, which handles its own keys).
  useEffect(() => {
    if (variant !== 'full') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const el = document.activeElement;
      if (el && el !== startRef.current && el.closest('a, button, input, textarea, select')) return;
      e.preventDefault();
      start();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [variant, start]);

  // Tap / click anywhere on the screen also starts (except on the other buttons).
  const onBackgroundClick = (e: MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest('a, button')) return;
    start();
  };

  if (variant === 'quick') {
    return (
      <section className={clsx('arcade-boot arcade-boot-quick', leaving && 'is-leaving')} aria-label="Loading">
        <p className="arcade-display mb-5 text-[10px] text-arcade-muted">{name} · The Game</p>
        <LoadingBar percent={progress} className="w-full max-w-[320px]" />
      </section>
    );
  }

  return (
    <section
      className={clsx('arcade-boot', !reducedMotion && 'is-powering-on', leaving && 'is-leaving')}
      aria-label="Start screen"
      onClick={onBackgroundClick}
    >
      <CRTOverlay />
      <div className={clsx('arcade-boot-inner', !reducedMotion && 'animate-arcade-flicker')}>
        <header className="arcade-boot-top">
          <div className="arcade-boot-hiscore">
            <span className="arcade-display text-[10px] text-arcade-pink">Hi-Score</span>
            <span className="arcade-score text-[32px] text-arcade-yellow arcade-glow arcade-accent-yellow md:text-[40px]">
              99.60 <span className="text-[24px]">%ile</span>
            </span>
            <span className="text-[14px] leading-tight text-arcade-muted">CAT percentile</span>
          </div>
          <SoundToggle />
        </header>

        <div className="arcade-boot-center">
          <h1 className="arcade-boot-title arcade-display">
            <span className="arcade-glow arcade-accent-yellow block text-arcade-yellow">{name}</span>
            <span className="arcade-glow arcade-accent-pink mt-3 block text-arcade-pink md:mt-5">The Game</span>
          </h1>
          {headline && <p className="arcade-boot-headline">{headline}</p>}

          <div className="arcade-boot-status">
            {ready ? (
              <>
                <button ref={startRef} type="button" className="arcade-boot-start" onClick={start}>
                  <BlinkingText>▶ Press Start</BlinkingText>
                </button>
                <p className="mt-3 text-[14px] text-arcade-muted">Click, tap, or press Enter</p>
              </>
            ) : (
              <LoadingBar percent={progress} className="w-full max-w-[320px]" />
            )}
          </div>
        </div>

        <footer className="arcade-boot-bottom arcade-accent-cyan">
          <ArcadeButton
            variant="ghost"
            href={recruiterHref}
            onClick={onRecruiter}
          >
            [ Recruiter mode: skip to CV ]
          </ArcadeButton>
        </footer>
      </div>
    </section>
  );
}
