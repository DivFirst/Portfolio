import { useCallback, useEffect, useState } from 'react';
import type { IslandId, IslandMeta } from '../types/portfolio';
import type { WorldRide } from '../data/worldRides';
import { arcadeWorlds } from '../data/arcadeWorlds';
import { Navbar } from './ui/Navbar';
import { HeroCard } from './ui/HeroCard';
import { IslandDock } from './ui/IslandDock';
import { CRTOverlay } from './arcade';
import { WorldHud } from './world/WorldHud';
import { HotspotLayer } from './world/HotspotLayer';
import { RideScreenPanel } from './world/RideScreenPanel';
import { TrophyRoom, ContinueScreen, KonamiCelebration, useKonamiCode } from './ui/ArcadeExtras';

/**
 * Everything on screen after PRESS START: menu bar, Player 1 card, stage select, the world HUD
 * and the pop-up windows. Its own download (App.tsx fetches it while the boot screen is up),
 * so the boot screen doesn't wait for it.
 */
export function GameHud({ world, activeIsland, ride, loadingRide, onSelectIsland, onEnterWorld, onLeaveWorld, onResetView }: {
  world: IslandId | null;
  activeIsland: IslandMeta | null;
  /** the open world's ride, once downloaded */
  ride: WorldRide | null;
  /** a world is open but its ride is still downloading */
  loadingRide: boolean;
  onSelectIsland: (island: IslandMeta | null) => void;
  onEnterWorld: (id: IslandId) => void;
  onLeaveWorld: () => void;
  onResetView: () => void;
}) {
  // Pop-up windows: Trophy Room, CONTINUE? contact screen, Konami cheat code
  const [popup, setPopup] = useState<'trophies' | 'contact' | 'konami' | null>(null);
  const closePopup = useCallback(() => setPopup(null), []);
  useKonamiCode(true, () => setPopup('konami'));

  // Esc: leave the world / reset the view. An open info box handles Esc first (defaultPrevented).
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented && !popup) onResetView();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onResetView, popup]);

  const accent = world ? arcadeWorlds[world].accent : 'cyan';

  return (
    <>
      <Navbar
        isIslandFocused={!!world}
        onResetView={onResetView}
        onOpenTrophies={() => setPopup('trophies')}
        onOpenContact={() => setPopup('contact')}
      />
      {/* Map mode: Player 1 card + stage select. World mode: world HUD + hotspots. */}
      {!world && <HeroCard isIslandFocused={false} />}
      <IslandDock
        selectedIsland={activeIsland}
        onSelectIsland={onSelectIsland}
        hidden={!!world || !!popup}
        onOpenTrophies={() => setPopup('trophies')}
        onOpenContact={() => setPopup('contact')}
      />
      {ride && (
        <>
          <RideScreenPanel key={`screen-${ride.slug}`} ride={ride} accent={accent} />
          <HotspotLayer key={ride.slug} ride={ride} accent={accent} />
          <WorldHud key={`hud-${ride.slug}`} ride={ride} accent={accent} onBack={onLeaveWorld} onNext={onEnterWorld} />
        </>
      )}
      {/* Slow connection: the world's ride is still on its way */}
      {loadingRide && (
        <div className="pointer-events-none fixed inset-x-0 bottom-10 z-30 flex justify-center" role="status">
          <span className="font-pixel text-[10px] tracking-widest text-white/80 animate-pulse">LOADING WORLD…</span>
        </div>
      )}
      <TrophyRoom open={popup === 'trophies'} onClose={closePopup} />
      <ContinueScreen open={popup === 'contact'} onClose={closePopup} />
      <KonamiCelebration open={popup === 'konami'} onClose={closePopup} />
      {/* CRT scanlines over the whole site (the boot screen has its own) */}
      <CRTOverlay soft />
    </>
  );
}
