import type { IslandId } from '../types/portfolio';
import type { Accent } from '../components/arcade/accent';
import { portfolioData } from './portfolioData';

/**
 * Arcade names and accent colours for the six islands
 * (BUILD_GUIDE.md Part 2 worlds table; DESIGN.md §2 "Each world owns one accent").
 */
export interface ArcadeWorld {
  number: number;
  name: string;
  accent: Accent;
  icon: string;
}

export const arcadeWorlds: Record<IslandId, ArcadeWorld> = {
  life:         { number: 1, name: 'Origin Story', accent: 'yellow', icon: '📖' },
  professional: { number: 2, name: 'Career Mode',  accent: 'cyan',   icon: '🏢' },
  projects:     { number: 3, name: 'Boss Battles', accent: 'pink',   icon: '🚀' },
  hobby:        { number: 4, name: 'Side Quests',  accent: 'green',  icon: '🕹️' },
  bookstagram:  { number: 5, name: 'Lore Library', accent: 'purple', icon: '📚' },
  travel:       { number: 6, name: 'Map Explorer', accent: 'yellow', icon: '✈️' },
};

/** Neon hex values (DESIGN.md §2), for places that can't use CSS variables, like the 3D world. */
export const accentHex: Record<Accent, string> = {
  pink: '#ff2e88',
  cyan: '#00f0ff',
  yellow: '#ffe600',
  green: '#39ff14',
  purple: '#9d4dff',
  dim: '#6b6b8f',
};

/** Coins in the HUD = case competitions in the data file (counted, never typed in by hand). */
export const caseCompetitionCount = portfolioData.projects.projects.filter(
  (p) => p.kind === 'case-competition',
).length;
