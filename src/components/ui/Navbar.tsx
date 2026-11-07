import React, { useSyncExternalStore } from 'react';
import { HudBar, useArcade } from '../arcade';
import { portfolioData } from '../../data/portfolioData';
import { caseCompetitionCount } from '../../data/arcadeWorlds';
import { sound } from '../../utils/soundEffects';

interface NavbarProps {
  isIslandFocused: boolean;
  onResetView: () => void;
  onOpenTrophies: () => void;
  onOpenContact: () => void;
}

/**
 * Top arcade HUD (DESIGN.md §4 "HUD bar"):
 *   1UP DIVYANSHU · LVL 99 · ❤❤❤ · 🪙 x N   [📄 CV] [reset view] [♪ music] [🔊 sound]
 * Phones show 1UP · ❤❤❤ · 🪙 N + CV, music and sound (the "◀ map" button lives in the stage bar).
 * "📄 CV" opens Recruiter Mode (/cv) on every screen size.
 * Sound effects are muted by default; music is off until the visitor turns it on.
 */
export const Navbar: React.FC<NavbarProps> = ({ isIslandFocused, onResetView, onOpenTrophies, onOpenContact }) => {
  const { profile } = portfolioData;
  const { play } = useArcade();
  // Music switch follows the sound engine (Fun Mode turns it on; the choice is remembered).
  const musicOn = useSyncExternalStore(sound.subscribe, () => sound.isMusicWanted());

  const toggleMusic = () => {
    play('press');
    sound.setMusic(!musicOn);
  };

  return (
    <HudBar
      className="arcade-hud-fixed"
      player={profile.name.split(' ')[0]}
      level={99}
      lives={3}
      coins={caseCompetitionCount}
      coinsLabel="case competitions"
      right={
        <>
          <a href="/cv" className="arcade-toggle" aria-label="Recruiter Mode: my CV on one page" title="Recruiter Mode">
            <span aria-hidden="true">📄 <span className="hidden lg:inline">Recruiter </span>CV</span>
          </a>
          {/* Trophy Room + CONTINUE? (desktop; on smaller screens they sit in the stage bar) */}
          <button type="button" className="arcade-toggle hidden lg:inline-flex lg:items-center" onClick={onOpenTrophies}>
            🏆 Trophies
          </button>
          <button type="button" className="arcade-toggle hidden lg:inline-flex lg:items-center" onClick={onOpenContact}>
            ✉️ Contact
          </button>
          {!isIslandFocused && (
            <button
              type="button"
              className="arcade-toggle hidden md:inline-flex md:items-center"
              onClick={() => { sound.playWhoosh(); onResetView(); }}
              title="Esc"
            >
              Reset view
            </button>
          )}
          <button
            type="button"
            className="arcade-toggle"
            aria-pressed={musicOn}
            aria-label="Music"
            onClick={toggleMusic}
          >
            <span aria-hidden="true">🎵 <span className="hidden sm:inline">Music: </span>{musicOn ? 'On' : 'Off'}</span>
          </button>
        </>
      }
    />
  );
};
