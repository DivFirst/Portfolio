import React, { useState, useEffect } from 'react';
import { X, Sparkles, Briefcase, Terminal, Gamepad2, BookOpen, Compass, Layers } from 'lucide-react';
import { IslandMeta } from '../../types/portfolio';
import { sound } from '../../utils/soundEffects';
import { MyLifeDossier } from './dossier/MyLifeDossier';
import { ProfessionalDossier } from './dossier/ProfessionalDossier';
import { ProjectsDossier } from './dossier/ProjectsDossier';
import { HobbyDossier } from './dossier/HobbyDossier';
import { BookstagramDossier } from './dossier/BookstagramDossier';
import { TravelDossier } from './dossier/TravelDossier';
import { MiniGameStage } from './MiniGameStage';

interface IslandDossierModalProps {
  island: IslandMeta | null;
  onClose: () => void;
}

const iconMap: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  Sparkles,
  Briefcase,
  Terminal,
  Gamepad2,
  BookOpen,
  Compass,
};

export const IslandDossierModal: React.FC<IslandDossierModalProps> = ({
  island,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'dossier' | 'game'>('dossier');

  // Reset tab when island changes
  useEffect(() => {
    setActiveTab('dossier');
  }, [island?.id]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && island) {
        sound.playClose();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [island, onClose]);

  if (!island) return null;

  const IconComponent = iconMap[island.iconName] || Sparkles;

  const handleClose = () => {
    sound.playClose();
    onClose();
  };

  const handleTabChange = (tab: 'dossier' | 'game') => {
    sound.playSelect();
    setActiveTab(tab);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-xl p-4 sm:p-6 flex flex-col pointer-events-none animate-in slide-in-from-right duration-300">
      <div className="w-full h-full glass-panel rounded-3xl overflow-hidden flex flex-col pointer-events-auto border border-white/15 shadow-2xl relative">
        {/* Top Header */}
        <div
          className="p-5 border-b border-white/10 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${island.accentColor}18, rgba(15, 23, 42, 0.9))`,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg"
                style={{
                  backgroundColor: `${island.accentColor}25`,
                  borderColor: `${island.accentColor}60`,
                  boxShadow: `0 8px 20px -4px ${island.accentColor}40`,
                }}
              >
                <IconComponent
                  className="w-6 h-6"
                  style={{ color: island.accentColor }}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    {island.name}
                  </h2>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase"
                    style={{
                      backgroundColor: `${island.accentColor}20`,
                      borderColor: `${island.accentColor}40`,
                      color: island.accentColor,
                    }}
                  >
                    Island 0{island.index}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  {island.subtitle}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 mt-5 p-1 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <button
              onClick={() => handleTabChange('dossier')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'dossier'
                  ? 'bg-white/10 text-white shadow-md border border-white/15'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Quick View Dossier</span>
            </button>

            <button
              onClick={() => handleTabChange('game')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'game'
                  ? 'text-white shadow-md border'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{
                backgroundColor: activeTab === 'game' ? `${island.accentColor}35` : undefined,
                borderColor: activeTab === 'game' ? `${island.accentColor}60` : undefined,
              }}
            >
              <Gamepad2 className="w-3.5 h-3.5" style={{ color: island.accentColor }} />
              <span>Play Mini-Game</span>
            </button>
          </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {activeTab === 'dossier' ? (
            <>
              {island.id === 'life' && <MyLifeDossier />}
              {island.id === 'professional' && <ProfessionalDossier />}
              {island.id === 'projects' && <ProjectsDossier />}
              {island.id === 'hobby' && <HobbyDossier />}
              {island.id === 'bookstagram' && <BookstagramDossier />}
              {island.id === 'travel' && <TravelDossier />}
            </>
          ) : (
            <MiniGameStage island={island} />
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-950/70 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Press [Esc] to exit island view</span>
          <span className="text-slate-500">{island.badge}</span>
        </div>
      </div>
    </div>
  );
};
