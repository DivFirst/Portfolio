import { useState, useEffect } from 'react';
import { IslandMeta } from './types/portfolio';
import { WorldCanvas } from './components/canvas/WorldCanvas';
import { Navbar } from './components/ui/Navbar';
import { HeroCard } from './components/ui/HeroCard';
import { IslandDock } from './components/ui/IslandDock';
import { IslandDossierModal } from './components/ui/IslandDossierModal';

export function App() {
  const [selectedIsland, setSelectedIsland] = useState<IslandMeta | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const handleSelectIsland = (island: IslandMeta | null) => {
    setSelectedIsland(island);
  };

  const handleResetView = () => {
    setSelectedIsland(null);
    setResetKey((k) => k + 1);
  };

  // Global ESC shortcut to reset view to default overview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleResetView();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#060911]">
      {/* 3D Interactive Isometric Canvas */}
      <WorldCanvas
        selectedIsland={selectedIsland}
        onSelectIsland={handleSelectIsland}
        resetKey={resetKey}
      />

      {/* Top Navbar HUD */}
      <Navbar
        isIslandFocused={!!selectedIsland}
        onResetView={handleResetView}
      />

      {/* Left-Docked Glassmorphic Hero Card */}
      <HeroCard
        isIslandFocused={!!selectedIsland}
      />

      {/* Bottom Floating Island Dock */}
      <IslandDock
        selectedIsland={selectedIsland}
        onSelectIsland={handleSelectIsland}
      />

      {/* Slide-over Dossier Modal */}
      <IslandDossierModal
        island={selectedIsland}
        onClose={handleResetView}
      />
    </main>
  );
}

export default App;
