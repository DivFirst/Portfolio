import { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { IslandMeta } from './types/portfolio';
import { Navbar } from './components/ui/Navbar';
import { HeroCard } from './components/ui/HeroCard';
import { IslandDock } from './components/ui/IslandDock';
import { IslandDossierModal } from './components/ui/IslandDossierModal';
import { IntroGate, type LoadStage } from './components/ui/IntroGate';
import { ArcadeProvider, CRTOverlay } from './components/arcade';

// The 3D world (three.js, ~1 MB) is its own download, so the intro screens paint
// right away and the world loads behind them. Started at startup, not on first render.
const worldImport = import('./components/canvas/WorldCanvas');
const WorldCanvas = lazy(() => worldImport.then((m) => ({ default: m.WorldCanvas })));

export function App() {
  const [selectedIsland, setSelectedIsland] = useState<IslandMeta | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [loadStage, setLoadStage] = useState<LoadStage>(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let alive = true;
    worldImport.then(() => { if (alive) setLoadStage((s) => (s < 1 ? 1 : s)); });
    return () => { alive = false; };
  }, []);

  const handleLoadStage = useCallback((stage: 'created' | 'ready') => {
    const next: LoadStage = stage === 'created' ? 2 : 3;
    setLoadStage((s) => (s < next ? next : s));
  }, []);

  const handleSelectIsland = (island: IslandMeta | null) => {
    setSelectedIsland(island);
  };

  const handleResetView = () => {
    setSelectedIsland(null);
    setResetKey((k) => k + 1);
  };

  // Global ESC shortcut to reset view to default overview
  useEffect(() => {
    if (!started) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleResetView();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [started]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#060911]">
      {/* World, intro and HUD share one set of arcade settings (sound, CRT, reduced motion / Recruiter Mode) */}
      <ArcadeProvider className="h-full w-full">
        {/* 3D Interactive Isometric Canvas */}
        <Suspense fallback={null}>
          <WorldCanvas
            selectedIsland={selectedIsland}
            onSelectIsland={handleSelectIsland}
            resetKey={resetKey}
            onLoadStage={handleLoadStage}
          />
        </Suspense>

        {/* Mode select + boot / loading screen, on top until the player starts */}
        <IntroGate loadStage={loadStage} onDone={() => setStarted(true)} />

        {/* HUD only after PRESS START, so 1–6 / Esc shortcuts can't fire behind the intro */}
        {started && (
          <>
            <Navbar isIslandFocused={!!selectedIsland} onResetView={handleResetView} />
            <HeroCard isIslandFocused={!!selectedIsland} />
            <IslandDock selectedIsland={selectedIsland} onSelectIsland={handleSelectIsland} />
            {/* CRT scanlines over the whole site (the boot screen has its own) */}
            <CRTOverlay soft />
          </>
        )}
      </ArcadeProvider>

      {/* Slide-over dossier (old style; removed in step 3.4) */}
      {started && <IslandDossierModal island={selectedIsland} onClose={handleResetView} />}
    </main>
  );
}

export default App;
