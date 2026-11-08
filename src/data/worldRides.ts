import type { IslandId } from '../types/portfolio';
import type { WorldRide } from './rides/common';

/**
 * Scroll rides, one per world (BUILD_GUIDE Part 2, "ENTERING A WORLD").
 *
 * Each world's ride script lives in its own file under ./rides/ and is downloaded only when
 * someone enters that world, so the boot screen and the map don't wait for six rides of text.
 * This file only holds what the map needs: each world's web address and the 1–6 order.
 * Shared types and helpers: ./rides/common.ts.
 */

export * from './rides/common';

/** Web address per world: site.com/#career = World 2 */
export const worldSlugs: Record<IslandId, string> = {
  life: 'origin',
  professional: 'career',
  projects: 'bosses',
  hobby: 'quests',
  bookstagram: 'library',
  travel: 'explorer',
};

/** Worlds in order 1–6 */
export const worldOrder: IslandId[] = ['life', 'professional', 'projects', 'hobby', 'bookstagram', 'travel'];

export function worldForSlug(slug: string): IslandId | null {
  const s = slug.replace(/^#/, '').toLowerCase();
  return worldOrder.find((id) => worldSlugs[id] === s) ?? null;
}

const rideFiles: Record<IslandId, () => Promise<{ ride: WorldRide }>> = {
  life: () => import('./rides/origin'),
  professional: () => import('./rides/career'),
  projects: () => import('./rides/bosses'),
  hobby: () => import('./rides/quests'),
  bookstagram: () => import('./rides/library'),
  travel: () => import('./rides/explorer'),
};

/** Downloads one world's ride script (cached after the first time). */
export const loadRide = (id: IslandId): Promise<WorldRide> => rideFiles[id]().then((m) => m.ride);
