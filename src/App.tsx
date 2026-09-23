import { useState } from 'react';
import { IslandMeta } from './types/portfolio';
import { WorldCanvas } from './components/canvas/WorldCanvas';
import { Navbar } from './components/ui/Navbar';
import { IslandDock } from './components/ui/IslandDock';
import { IslandDossierModal } from './components/ui/IslandDossierModal';

export function App() {
  const [selectedIsland, setSelectedIsland] = useState<IslandMeta | null>(null);

  const handleSelectIsland = (island: IslandMeta | null) => {
    setSelectedIsland(island);
  };

  const handleResetView = () => {
    setSelectedIsland(null);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#060911]">
      {/* 3D Interactive Isometric Canvas */}
      <WorldCanvas
        selectedIsland={selectedIsland}
        onSelectIsland={handleSelectIsland}
      />

      {/* Top Navbar HUD */}
      <Navbar
        isIslandFocused={!!selectedIsland}
        onResetView={handleResetView}
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
