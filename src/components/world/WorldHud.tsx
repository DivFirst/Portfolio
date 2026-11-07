import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { ArcadeButton, BlinkingText, accentClass, useArcade, type Accent } from '../arcade';
import { arcadeWorlds } from '../../data/arcadeWorlds';
import { chapterRange, worldOrder, type WorldRide } from '../../data/worldRides';
import type { IslandId } from '../../types/portfolio';
import { rideScroll, useRidePercent } from './rideStore';

interface WorldHudProps {
  ride: WorldRide;
  accent: Accent;
  onBack: () => void;
  onNext: (id: IslandId) => void;
}

const SEGMENTS = 24;

/**
 * HUD while inside a world (BUILD_GUIDE Part 2): "◀ BACK TO MAP", world name + chapter,
 * a segmented level-progress bar, "SCROLL ▼" at the start and "STAGE CLEAR!" at 100%.
 * Also lets the keyboard drive the ride (↑ ↓ PgUp PgDn Space Home End).
 */
export function WorldHud({ ride, accent, onBack, onNext }: WorldHudProps) {
  const { play } = useArcade();
  const percent = useRidePercent();
  const world = arcadeWorlds[ride.islandId];
  const clear = percent >= 99;
  const lit = Math.round((percent / 100) * SEGMENTS);

  const chapterIndex = ride.chapters.findIndex((_, i) => {
    const [from, to] = chapterRange(ride, i);
    return percent / 100 >= from && percent / 100 <= to;
  });
  const chapter = ride.chapters[Math.max(0, chapterIndex)];

  const nextIndex = worldOrder.indexOf(ride.islandId) + 1;
  const nextId = nextIndex < worldOrder.length ? worldOrder[nextIndex] : null;

  // STAGE CLEAR fanfare, once per arrival at 100%
  const cleared = useRef(false);
  useEffect(() => {
    if (clear && !cleared.current) { cleared.current = true; play('stageClear'); }
    if (percent < 90) cleared.current = false;
  }, [clear, percent, play]);

  // Keyboard scrolling (the scroll area itself never needs focus)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = rideScroll.el;
      if (!el || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const focus = document.activeElement;
      if (e.key === ' ' && focus && focus !== document.body && focus.closest('button, a, input, textarea, select')) return;
      const page = el.clientHeight * 0.8;
      const moves: Record<string, () => void> = {
        ArrowDown: () => el.scrollBy({ top: 120 }),
        ArrowUp: () => el.scrollBy({ top: -120 }),
        PageDown: () => el.scrollBy({ top: page }),
        PageUp: () => el.scrollBy({ top: -page }),
        ' ': () => el.scrollBy({ top: e.shiftKey ? -page : page }),
        Home: () => el.scrollTo({ top: 0 }),
        End: () => el.scrollTo({ top: el.scrollHeight }),
      };
      const move = moves[e.key];
      if (move) { e.preventDefault(); move(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className={clsx('arcade-world-hud', accentClass[accent])}>
      <div className="arcade-world-top">
        <button type="button" className="arcade-toggle arcade-world-back" onClick={() => { play('close'); onBack(); }}>
          ◀ Back to map
        </button>
        <div className="arcade-world-progress">
          <div className="arcade-world-progress-head">
            <span className="arcade-display text-[10px] arcade-world-name">World {world.number}: {world.name}</span>
            <span className="arcade-score text-2xl text-arcade-text">{String(percent).padStart(3, '0')}%</span>
          </div>
          <div
            className="arcade-loading-track"
            role="progressbar"
            aria-label={`World ${world.number} progress`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
          >
            {Array.from({ length: SEGMENTS }, (_, i) => (
              <span key={i} className={clsx('arcade-loading-seg', i < lit && 'is-lit')} />
            ))}
          </div>
          <p className="arcade-world-chapter">{chapter.label}</p>
        </div>
      </div>

      {percent < 4 && (
        <button
          type="button"
          className="arcade-world-scroll-hint"
          onClick={() => rideScroll.el?.scrollBy({ top: (rideScroll.el?.clientHeight ?? 600) * 0.8 })}
          aria-label="Scroll down to play"
        >
          <BlinkingText>Scroll ▼</BlinkingText>
        </button>
      )}

      {clear && (
        <div className="arcade-stage-clear animate-arcade-pop" role="status">
          <p className="arcade-display arcade-glow arcade-accent-green text-arcade-green text-base md:text-2xl">Stage clear!</p>
          {nextId ? (
            <ArcadeButton variant="success" sound="coin" onClick={() => onNext(nextId)}>
              Next world ▶
            </ArcadeButton>
          ) : (
            <ArcadeButton variant="success" onClick={onBack}>◀ Back to map</ArcadeButton>
          )}
        </div>
      )}
    </div>
  );
}
