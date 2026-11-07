import { useCallback, useEffect, useState } from 'react';
import type { IslandId } from '../../types/portfolio';
import { rideForSlug, worldRides } from '../../data/worldRides';

/**
 * The web address decides which world is open: site.com/#career = World 2.
 * - Entering from the map adds a history entry, so the browser Back button returns to the map.
 * - Switching world-to-world replaces it, so Back still goes to the map (not through every world).
 * - Leaving goes back if we came from the map; if the visitor arrived on a world link,
 *   it swaps the address for the plain map instead of leaving the site.
 */

const readWorld = (): IslandId | null => rideForSlug(window.location.hash)?.islandId ?? null;
const base = () => window.location.pathname + window.location.search;

export function useWorldRoute() {
  const [world, setWorld] = useState<IslandId | null>(readWorld);

  useEffect(() => {
    const sync = () => setWorld(readWorld());
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  const enterWorld = useCallback((id: IslandId) => {
    const url = `${base()}#${worldRides[id].slug}`;
    if (readWorld() === id) return;
    if (readWorld()) {
      const fromMap = (history.state as { fromMap?: boolean } | null)?.fromMap ?? false;
      history.replaceState({ fromMap }, '', url);
    } else {
      history.pushState({ fromMap: true }, '', url);
    }
    setWorld(id);
  }, []);

  const leaveWorld = useCallback(() => {
    if (!readWorld()) return;
    if ((history.state as { fromMap?: boolean } | null)?.fromMap) {
      history.back(); // popstate brings us to the map
    } else {
      history.replaceState(null, '', base());
      setWorld(null);
    }
  }, []);

  return { world, enterWorld, leaveWorld };
}
