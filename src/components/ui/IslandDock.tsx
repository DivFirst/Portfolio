import React, { useEffect } from 'react';
import { Sparkles, Briefcase, Terminal, Gamepad2, BookOpen, Compass } from 'lucide-react';
import { IslandMeta } from '../../types/portfolio';
import { portfolioData } from '../../data/portfolioData';
import { sound } from '../../utils/soundEffects';

interface IslandDockProps {
  selectedIsland: IslandMeta | null;
  onSelectIsland: (island: IslandMeta | null) => void;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Briefcase,
  Terminal,
  Gamepad2,
  BookOpen,
  Compass,
};

export const IslandDock: React.FC<IslandDockProps> = ({
  selectedIsland,
  onSelectIsland,
}) => {
  const islandsList = Object.values(portfolioData.islands);

  // Keyboard navigation shortcuts: 1-6 selects islands, Esc returns to overview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= islandsList.length) {
        const target = islandsList[num - 1];
        sound.playSelect();
        onSelectIsland(target);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [islandsList, onSelectIsland]);

  return (
    <footer className="fixed bottom-4 inset-x-0 z-30 pointer-events-none flex flex-col items-center gap-2 px-4">
      {/* Navigation Hint banner */}
      <div className="glass-panel px-3 py-1 rounded-full text-[11px] font-mono text-slate-400 border border-white/5 shadow-lg hidden sm:flex items-center gap-2">
        <span>🖱️ Drag to rotate view</span>
        <span>•</span>
        <span>🔍 Scroll to zoom</span>
        <span>•</span>
        <span>⌨️ Keys 1-6</span>
      </div>

      {/* Main Island Dock */}
      <div className="glass-panel p-1.5 rounded-2xl flex items-center gap-1.5 pointer-events-auto border border-white/10 shadow-2xl overflow-x-auto max-w-full">
        {islandsList.map((island) => {
          const isSelected = selectedIsland?.id === island.id;
          const IconComponent = iconMap[island.iconName] || Sparkles;

          return (
            <button
              key={island.id}
              onClick={() => {
                sound.playSelect();
                onSelectIsland(isSelected ? null : island);
              }}
              onMouseEnter={() => sound.playHover()}
              className={`relative px-3 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 group whitespace-nowrap ${
                isSelected
                  ? 'bg-white/15 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              style={{
                boxShadow: isSelected ? `0 0 20px -5px ${island.accentColor}50` : undefined,
              }}
            >
              {/* Number Tag */}
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors ${
                  isSelected
                    ? 'bg-white/20 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                }`}
              >
                {island.index}
              </span>

              {/* Icon */}
              <IconComponent
                className="w-4 h-4 transition-transform group-hover:scale-110"
              />

              {/* Name */}
              <span className="text-xs font-semibold">
                {island.name}
              </span>

              {/* Glowing active indicator dot */}
              {isSelected && (
                <span
                  className="w-1.5 h-1.5 rounded-full animate-ping"
                  style={{ backgroundColor: island.accentColor }}
                />
              )}
            </button>
          );
        })}
      </div>
    </footer>
  );
};
