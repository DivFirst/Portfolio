import React, { useEffect } from 'react';
import clsx from 'clsx';
import { IslandMeta } from '../../types/portfolio';
import { portfolioData } from '../../data/portfolioData';
import { arcadeWorlds } from '../../data/arcadeWorlds';
import { accentClass, useArcade } from '../arcade';
import { sound } from '../../utils/soundEffects';

interface IslandDockProps {
  selectedIsland: IslandMeta | null;
  onSelectIsland: (island: IslandMeta | null) => void;
  /** Inside a world the bar is hidden, but keys 1–6 still switch worlds */
  hidden?: boolean;
}

/**
 * "STAGE SELECT" bar (BUILD_GUIDE Part 2): one button per world, keys 1–6.
 * Desktop: one row of six. Phones and tablets: 3 × 2 grid, so nothing scrolls sideways.
 * Buttons are neutral until hovered/selected, then take their world's accent (DESIGN.md §2).
 */
export const IslandDock: React.FC<IslandDockProps> = ({ selectedIsland, onSelectIsland, hidden = false }) => {
  const { play } = useArcade();
  const islandsList = Object.values(portfolioData.islands).sort((a, b) => a.index - b.index);

  // Keys 1–6 pick a world (Esc back to the map is handled in App).
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = (e.target as HTMLElement | null)?.closest('input, textarea, select, [contenteditable="true"]');
      if (target) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= islandsList.length) {
        sound.playSelect();
        onSelectIsland(islandsList[num - 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [islandsList, onSelectIsland]);

  const selectedWorld = selectedIsland ? arcadeWorlds[selectedIsland.id] : null;
  if (hidden) return null;

  return (
    <nav className="arcade-stage-bar" aria-label="Stage select">
      <div className="arcade-stage-head">
        <span className="arcade-display text-[10px] text-arcade-pink">
          {selectedWorld ? `World ${selectedWorld.number}: ${selectedWorld.name}` : 'Stage select'}
        </span>
        {selectedIsland ? (
          <button
            type="button"
            className="arcade-toggle"
            onClick={() => { play('close'); sound.playWhoosh(); onSelectIsland(null); }}
          >
            ◀ Map
          </button>
        ) : (
          <span className="hidden text-[14px] text-arcade-muted md:inline">Drag to rotate · scroll to zoom · keys 1–6</span>
        )}
      </div>

      <ul className="arcade-stage-grid">
        {islandsList.map((island) => {
          const world = arcadeWorlds[island.id];
          const isSelected = selectedIsland?.id === island.id;
          return (
            <li key={island.id}>
              <button
                type="button"
                className={clsx('arcade-stage-btn', accentClass[world.accent], isSelected && 'is-selected')}
                aria-pressed={isSelected}
                aria-label={`World ${world.number}: ${world.name} (${island.name})`}
                onClick={() => { sound.playSelect(); onSelectIsland(isSelected ? null : island); }}
                onMouseEnter={() => sound.playHover()}
              >
                <span className="arcade-stage-num" aria-hidden="true">{world.number}</span>
                <span className="arcade-stage-text" aria-hidden="true">
                  <span className="arcade-stage-world">World {world.number}</span>
                  <span className="arcade-stage-name">{world.name}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
