import React, { useEffect, useState } from 'react';
import { HudBar, useArcade } from '../arcade';
import { portfolioData } from '../../data/portfolioData';
import { caseCompetitionCount } from '../../data/arcadeWorlds';
import { sound } from '../../utils/soundEffects';

interface NavbarProps {
  isIslandFocused: boolean;
  onResetView: () => void;
}

/**
 * Top arcade HUD (DESIGN.md §4 "HUD bar"):
 *   1UP DIVYANSHU · LVL 99 · ❤❤❤ · 🪙 x N   [reset view] [♪ music] [🔊 sound]
 * Phones show 1UP · ❤❤❤ · 🪙 N + music and sound (the "◀ map" button lives in the stage bar).
 * Sound effects are muted by default; music is off until the visitor turns it on.
 */
export const Navbar: React.FC<NavbarProps> = ({ isIslandFocused, onResetView }) => {
  const { profile } = portfolioData;
  const { play } = useArcade();
  const [musicOn, setMusicOn] = useState(sound.isBgm());

  // Stop the music if the HUD goes away (e.g. hot reload); never auto-start it.
  useEffect(() => () => { sound.toggleAmbientMusic(false); }, []);

  const toggleMusic = () => {
    play('press');
    setMusicOn(sound.toggleAmbientMusic(!musicOn));
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
          <button
            type="button"
            className="arcade-toggle hidden md:inline-flex md:items-center"
            onClick={() => { sound.playWhoosh(); onResetView(); }}
            title="Esc"
          >
            {isIslandFocused ? '◀ Back to map' : 'Reset view'}
          </button>
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
