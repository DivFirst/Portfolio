import { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { IslandMeta } from './types/portfolio';
import { portfolioData } from './data/portfolioData';
import { arcadeWorlds } from './data/arcadeWorlds';
import { worldRides } from './data/worldRides';
import { Navbar } from './components/ui/Navbar';
import { HeroCard } from './components/ui/HeroCard';
import { IslandDock } from './components/ui/IslandDock';
import { IntroGate, type LoadStage } from './components/ui/IntroGate';
import { ArcadeProvider, CRTOverlay } from './components/arcade';
import { useWorldRoute } from './components/world/useWorldRoute';
import { WorldHud } from './components/world/WorldHud';
import { HotspotLayer } from './components/world/HotspotLayer';
import { resetRide } from './components/world/rideStore';
import { sound } from './utils/soundEffects';
import { TrophyRoom, ContinueScreen, KonamiCelebration, useKonamiCode } from './components/ui/ArcadeExtras';

// The 3D world (three.js, ~1 MB) is its own download, so the intro screens paint
// right away and the world loads behind them. Started at startup, not on first render.
const worldImport = import('./components/canvas/WorldCanvas');
const WorldCanvas = lazy(() => worldImport.then((m) => ({ default: m.WorldCanvas })));

// Was the site opened on a world link (site.com/#career)? Then the intro skips the mode question.
const openedOnWorldLink = typeof window !== 'undefined' && /^#./.test(window.location.hash);

export function App() {
  const { world, enterWorld, leaveWorld } = useWorldRoute();
  const activeIsland: IslandMeta | null = world ? portfolioData.islands[world] : null;
  const ride = world ? worldRides[world] : null;

  const [resetKey, setResetKey] = useState(0);
  const [loadStage, setLoadStage] = useState<LoadStage>(0);
  const [started, setStarted] = useState(false);
  // Pop-up windows: Trophy Room, CONTINUE? contact screen, Konami cheat code
  const [popup, setPopup] = useState<'trophies' | 'contact' | 'konami' | null>(null);
  const closePopup = useCallback(() => setPopup(null), []);
  useKonamiCode(started, () => setPopup('konami'));

  useEffect(() => {
    let alive = true;
    worldImport.then(() => { if (alive) setLoadStage((s) => (s < 1 ? 1 : s)); });
    return () => { alive = false; };
  }, []);

  // New world (or back to the map): start its ride from 0%.
  useEffect(() => {
    resetRide();
    if (world) sound.play('coin'); // entering a world = insert coin
  }, [world]);

  const handleLoadStage = useCallback((stage: 'created' | 'ready') => {
    const next: LoadStage = stage === 'created' ? 2 : 3;
    setLoadStage((s) => (s < next ? next : s));
  }, []);

  const handleSelectIsland = useCallback((island: IslandMeta | null) => {
    if (island) enterWorld(island.id);
    else leaveWorld();
  }, [enterWorld, leaveWorld]);

  // "Reset view" on the map, or "back to map" inside a world
  const handleResetView = useCallback(() => {
    if (world) leaveWorld();
    setResetKey((k) => k + 1);
  }, [world, leaveWorld]);

  // Esc: leave the world / reset the view. An open info box handles Esc first (defaultPrevented).
  useEffect(() => {
    if (!started) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented && !popup) handleResetView();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [started, handleResetView, popup]);

  const accent = world ? arcadeWorlds[world].accent : 'cyan';

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#060911]">
      {/* World, intro and HUD share one set of arcade settings (sound, CRT, reduced motion / Recruiter Mode) */}
      <ArcadeProvider className="h-full w-full">
        {/* 3D world; inside a world, scrolling over it drives the ride */}
        <Suspense fallback={null}>
          <WorldCanvas
            activeIsland={activeIsland}
            onEnterIsland={(island) => enterWorld(island.id)}
            onLeave={leaveWorld}
            resetKey={resetKey}
            onLoadStage={handleLoadStage}
          />
        </Suspense>

        {/* Mode select + boot / loading screen, on top until the player starts */}
        <IntroGate loadStage={loadStage} skipModeSelect={openedOnWorldLink} onDone={() => setStarted(true)} />

        {/* HUD only after PRESS START, so 1–6 / Esc shortcuts can't fire behind the intro */}
        {started && (
          <>
            <Navbar
              isIslandFocused={!!world}
              onResetView={handleResetView}
              onOpenTrophies={() => setPopup('trophies')}
              onOpenContact={() => setPopup('contact')}
            />
            {/* Map mode: Player 1 card + stage select. World mode: world HUD + hotspots. */}
            {!world && <HeroCard isIslandFocused={false} />}
            <IslandDock
              selectedIsland={activeIsland}
              onSelectIsland={handleSelectIsland}
              hidden={!!world || !!popup}
              onOpenTrophies={() => setPopup('trophies')}
              onOpenContact={() => setPopup('contact')}
            />
            {ride && (
              <>
                <HotspotLayer key={ride.slug} ride={ride} accent={accent} />
                <WorldHud key={`hud-${ride.slug}`} ride={ride} accent={accent} onBack={leaveWorld} onNext={enterWorld} />
              </>
            )}
            <TrophyRoom open={popup === 'trophies'} onClose={closePopup} />
            <ContinueScreen open={popup === 'contact'} onClose={closePopup} />
            <KonamiCelebration open={popup === 'konami'} onClose={closePopup} />
            {/* CRT scanlines over the whole site (the boot screen has its own) */}
            <CRTOverlay soft />
          </>
        )}
      </ArcadeProvider>
    </main>
  );
}

export default App;
