import { useEffect, useState } from 'react';
import type { IslandId } from '../../types/portfolio';
import { loadRide, type WorldRide } from '../../data/worldRides';

/**
 * Each world's ride comes in two small downloads, fetched only when someone enters that world:
 *   - its ride script (chapters, "?" text, cameras): data/rides/<world>.ts, used by the HUD and the 3D ride
 *   - its "ride kit" (the 3D pieces that only exist inside the ride): canvas/islands/<world>/kit.ts
 * The map and the boot screen never wait for them.
 */

// (type-only imports: these don't pull any 3D code into this file's download)
type Kits = {
  life: typeof import('../canvas/islands/origin/kit');
  professional: typeof import('../canvas/islands/career/kit');
  projects: typeof import('../canvas/islands/bosses/kit');
  hobby: typeof import('../canvas/islands/hobby/kit');
  bookstagram: typeof import('../canvas/islands/library/kit');
  travel: typeof import('../canvas/islands/travel/kit');
};

const kitFiles: { [K in IslandId]: () => Promise<Kits[K]> } = {
  life: () => import('../canvas/islands/origin/kit'),
  professional: () => import('../canvas/islands/career/kit'),
  projects: () => import('../canvas/islands/bosses/kit'),
  hobby: () => import('../canvas/islands/hobby/kit'),
  bookstagram: () => import('../canvas/islands/library/kit'),
  travel: () => import('../canvas/islands/travel/kit'),
};

const kits: Partial<Kits> = {};

/**
 * A world's ride kit. Only call it while that world's ride is on (`rideActive`):
 * useWorldRide() below hands out a ride only once its kit has arrived.
 */
export function rideKit<K extends IslandId>(id: K): Kits[K] {
  const kit = kits[id];
  if (!kit) throw new Error(`rideKit: "${id}" used before it loaded`);
  return kit;
}

const loading = new Map<IslandId, Promise<WorldRide>>();
function loadWorldRide(id: IslandId): Promise<WorldRide> {
  let p = loading.get(id);
  if (!p) {
    p = Promise.all([loadRide(id), kitFiles[id]().then((k) => { (kits as Record<IslandId, unknown>)[id] = k; })])
      .then(([ride]) => ride);
    p.catch(() => loading.delete(id)); // a failed download can be retried on the next visit
    loading.set(id, p);
  }
  return p;
}

/**
 * The open world's ride, once its script and 3D pieces have downloaded (null until then, and on the map).
 * `onError`: the download failed (offline, flaky connection).
 */
export function useWorldRide(world: IslandId | null, onError?: () => void): WorldRide | null {
  const [state, setState] = useState<{ id: IslandId; ride: WorldRide } | null>(null);
  useEffect(() => {
    if (!world) return;
    let alive = true;
    loadWorldRide(world).then(
      (ride) => { if (alive) setState({ id: world, ride }); },
      (err) => { console.error('[ride download]', err); if (alive) onError?.(); },
    );
    return () => { alive = false; };
  }, [world, onError]);
  return state && state.id === world ? state.ride : null;
}
