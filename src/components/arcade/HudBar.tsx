import type { ReactNode } from 'react';
import clsx from 'clsx';
import { SoundToggle } from './SoundToggle';

interface HudBarProps {
  /** Player name shown after "1UP" (wide screens only) */
  player?: string;
  level?: number;
  lives?: number;
  /** Coin count, e.g. 15 case competitions */
  coins?: number;
  coinsLabel?: string;
  /** e.g. "1-6" (wide screens only) */
  stage?: string;
  /** Extra controls on the right, before the sound toggle */
  right?: ReactNode;
  className?: string;
}

/** Top HUD strip: 1UP · LVL · ❤❤❤ · 🪙 x N · STAGE, plus the sound toggle (DESIGN.md §4). */
export function HudBar({ player, level, lives = 3, coins, coinsLabel = 'coins', stage, right, className }: HudBarProps) {
  return (
    <header className={clsx('arcade-hud', className)}>
      <div className="flex flex-wrap items-center gap-3.5">
        <span className="text-arcade-pink">1UP</span>
        {player && <span className="hidden lg:inline">{player}</span>}
        {level !== undefined && <span className="hidden lg:inline">LVL {level}</span>}
        <span className="tracking-[2px] text-arcade-pink" aria-label={`${lives} lives`}>{'❤'.repeat(lives)}</span>
        {coins !== undefined && (
          <span className="text-arcade-yellow" aria-label={`${coins} ${coinsLabel}`}>🪙 x {coins}</span>
        )}
        {stage && <span className="hidden lg:inline">Stage {stage}</span>}
      </div>
      <div className="flex items-center gap-2">
        {right}
        <SoundToggle />
      </div>
    </header>
  );
}
