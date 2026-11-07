import { useSyncExternalStore } from 'react';

/**
 * Tiny shared store between the 3D scene (writes every frame) and the DOM HUD (reads).
 * - progress: ride position 0–1. Listeners are only told when the whole % changes,
 *   so the HUD re-renders at most ~100 times per ride, not 60 times a second.
 * - positions: where each pinned hotspot is on screen right now. The hotspot layer
 *   reads these in its own animation loop (no React re-render).
 */

export interface ScreenPos { x: number; y: number; onScreen: boolean }

let percent = 0;
let progress = 0;
const listeners = new Set<() => void>();
export const hotspotPositions = new Map<string, ScreenPos>();

/** Lets the HUD scroll the ride (keyboard, "scroll" hint). Set by the 3D ride controller. */
export const rideScroll: { el: HTMLElement | null } = { el: null };

export function setRideProgress(p: number) {
  progress = Math.min(1, Math.max(0, p));
  const next = Math.round(progress * 100);
  if (next !== percent) {
    percent = next;
    listeners.forEach((l) => l());
  }
}

export function resetRide() {
  hotspotPositions.clear();
  progress = 0;
  if (percent !== 0) { percent = 0; listeners.forEach((l) => l()); }
}

export function getRideProgress() { return progress; }

const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };

/** Whole-number ride percent (0–100) for React components. */
export function useRidePercent() {
  return useSyncExternalStore(subscribe, () => percent);
}
