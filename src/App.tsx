import { useState, useEffect, useRef, lazy, Suspense, useCallback, Component, type ReactNode } from 'react';
import { IslandMeta } from './types/portfolio';
import { portfolioCore } from './data/portfolioCore';
import { IntroGate, type LoadStage } from './components/ui/IntroGate';
import { ArcadeProvider } from './components/arcade/ArcadeProvider';
import { useWorldRoute } from './components/world/useWorldRoute';
import { useWorldRide } from './components/world/rideKits';
import { resetRide } from './components/world/rideStore';
import { sound } from './utils/soundEffects';
import { LiteModeOffer, type LiteReason } from './components/ui/LiteModeOffer';
import { rememberPlayAnyway, wantsPlayAnyway } from './utils/deviceCheck';

// What loads when (so the boot screen paints right away):
//   1. this file + the boot screen (small)
//   2. once it is on screen, in the background: the 3D world (three.js, the big one)
//      and the HUD shown after PRESS START (GameHud)
//   3. a world's ride, only when someone enters that world (world/rideKits.ts)
// On a slow device the 3D world only starts once the visitor says "play anyway".
let worldImport: Promise<typeof import('./components/canvas/WorldCanvas')> | null = null;
const loadWorld = () => (worldImport ??= import('./components/canvas/WorldCanvas'));
const WorldCanvas = lazy(() => loadWorld().then((m) => ({ default: m.WorldCanvas })));
const loadHud = () => import('./components/GameHud');
const GameHud = lazy(() => loadHud().then((m) => ({ default: m.GameHud })));

// Was the site opened on a world link (site.com/#career) or from Recruiter Mode's "Play the game"
// (site.com/?play)? Then the intro skips the mode question.
const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const openedOnWorldLink = typeof window !== 'undefined' && (/^#./.test(window.location.hash) || !!params?.has('play'));
if (params?.has('play')) {
  // "Play the game" from Recruiter Mode: forget the saved Recruiter choice, then tidy the address.
  try { localStorage.removeItem('arcade-intro'); } catch { /* storage blocked: fine */ }
  params.delete('play');
  const q = params.toString();
  history.replaceState(history.state, '', window.location.pathname + (q ? `?${q}` : '') + window.location.hash);
}

/** If the world is still loading after this long, offer Recruiter Mode. */
const SLOW_LOAD_MS = 25000;
/** Below this frame rate on the map, offer Recruiter Mode (once). */
const SLOW_FPS = 20;

/** A crash inside the 3D world (e.g. WebGL fails to start) offers Recruiter Mode instead of a blank page. */
class WorldErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: unknown) { console.error('[3D world]', error); this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function App({ lowEndDevice = false }: { lowEndDevice?: boolean }) {
  const { world, enterWorld, leaveWorld } = useWorldRoute();
  const activeIsland: IslandMeta | null = world ? portfolioCore.islands[world] : null;

  const [resetKey, setResetKey] = useState(0);
  const [loadStage, setLoadStage] = useState<LoadStage>(0);
  const [started, setStarted] = useState(false);
  useEffect(() => { loadHud(); }, []); // fetch the HUD while the boot screen is up

  // Slow / old device: ask before downloading the 3D world (DeviceCheck in main.tsx).
  const [allow3d, setAllow3d] = useState(() => !lowEndDevice || wantsPlayAnyway());
  const [liteOffer, setLiteOffer] = useState<LiteReason | null>(allow3d ? null : 'lowend');
  const liteDismissed = useRef(wantsPlayAnyway());
  const offerLite = useCallback((reason: LiteReason) => {
    if (reason !== 'broken' && liteDismissed.current) return;
    setLiteOffer(reason);
  }, []);
  const stayIn3d = useCallback(() => {
    liteDismissed.current = true;
    rememberPlayAnyway();
    setLiteOffer(null);
    setAllow3d(true);
  }, []);

  // The open world's ride (downloaded on entry). If it fails to download, go back to the map.
  const ride = useWorldRide(world, useCallback(() => { console.warn('[ride] download failed: back to the map'); leaveWorld(); }, [leaveWorld]));

  useEffect(() => {
    if (!allow3d) return;
    let alive = true;
    loadWorld().then(
      () => { if (alive) setLoadStage((s) => (s < 1 ? 1 : s)); },
      () => { if (alive) offerLite('broken'); }, // the 3D code didn't download
    );
    return () => { alive = false; };
  }, [allow3d, offerLite]);

  // Still loading after 25 s: probably a slow phone or connection.
  useEffect(() => {
    if (!allow3d || loadStage >= 3) return;
    const id = window.setTimeout(() => offerLite('slow'), SLOW_LOAD_MS);
    return () => window.clearTimeout(id);
  }, [allow3d, loadStage, offerLite]);

  // Once playing: measure the frame rate for 4 s (after a short warm-up). Very low = offer once.
  useEffect(() => {
    if (!started || liteDismissed.current) return;
    let raf = 0, frames = 0, t0 = 0, cancelled = false;
    const tick = (t: number) => {
      if (cancelled) return;
      if (document.visibilityState !== 'visible') return; // background tab: browsers slow it down on purpose
      if (!t0) t0 = t;
      frames += 1;
      if (t - t0 >= 4000) {
        const fps = (frames * 1000) / (t - t0);
        if (fps < SLOW_FPS) { console.info('[3D check] low frame rate', fps.toFixed(1)); offerLite('slow'); }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const warmup = window.setTimeout(() => { raf = requestAnimationFrame(tick); }, 1500);
    return () => { cancelled = true; window.clearTimeout(warmup); cancelAnimationFrame(raf); };
  }, [started, offerLite]);

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


  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#060911]">
      {/* World, intro and HUD share one set of arcade settings (sound, CRT, reduced motion / Recruiter Mode) */}
      <ArcadeProvider className="h-full w-full">
        {/* 3D world; inside a world, scrolling over it drives the ride */}
        {allow3d && (
          <WorldErrorBoundary onError={() => offerLite('broken')}>
            <Suspense fallback={null}>
              <WorldCanvas
                activeIsland={activeIsland}
                ride={ride}
                onEnterIsland={(island) => enterWorld(island.id)}
                onLeave={leaveWorld}
                resetKey={resetKey}
                onLoadStage={handleLoadStage}
                onContextLost={() => offerLite('broken')}
              />
            </Suspense>
          </WorldErrorBoundary>
        )}

        {/* Mode select + boot / loading screen, on top until the player starts */}
        <IntroGate loadStage={loadStage} skipModeSelect={openedOnWorldLink} onDone={() => setStarted(true)} />

        {/* HUD only after PRESS START, so 1–6 / Esc shortcuts can't fire behind the intro */}
        {started && (
          <Suspense fallback={null}>
            <GameHud
              world={world}
              activeIsland={activeIsland}
              ride={ride}
              loadingRide={!!world && !ride}
              onSelectIsland={handleSelectIsland}
              onEnterWorld={enterWorld}
              onLeaveWorld={leaveWorld}
              onResetView={handleResetView}
            />
          </Suspense>
        )}
        {/* Slow / old device or a 3D failure: offer Recruiter Mode instead of a broken world */}
        {liteOffer && <LiteModeOffer reason={liteOffer} onStay={stayIn3d} />}
      </ArcadeProvider>
    </main>
  );
}

export default App;
