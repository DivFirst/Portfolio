import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Gamepad2, Trophy, Flame, Play, RotateCcw, Sparkles } from 'lucide-react';
import { IslandMeta } from '../../types/portfolio';
import { sound } from '../../utils/soundEffects';

interface MiniGameStageProps {
  island: IslandMeta;
}

export const MiniGameStage: React.FC<MiniGameStageProps> = ({ island }) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const handleTap = () => {
    sound.playSelect();
    const newScore = score + (10 * Math.max(1, combo));
    const newCombo = combo + 1;
    setScore(newScore);
    setCombo(newCombo);
    if (newScore > highScore) setHighScore(newScore);

    if (newCombo % 5 === 0) {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 },
        colors: [island.accentColor, '#ffffff', '#facc15']
      });
    }
  };

  const handleReset = () => {
    sound.playClose();
    setScore(0);
    setCombo(0);
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* Game Header / Briefing */}
      <div
        className="p-5 rounded-2xl border relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.7))`,
          borderColor: `${island.accentColor}55`,
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5" style={{ color: island.accentColor }} />
            <h3 className="text-lg font-bold text-white tracking-wide">
              {island.minigame.title}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span
              className="px-2.5 py-0.5 rounded-full border text-[11px] font-semibold"
              style={{
                backgroundColor: `${island.accentColor}20`,
                borderColor: `${island.accentColor}40`,
                color: island.accentColor,
              }}
            >
              {island.minigame.genre}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[11px]">
              {island.minigame.difficulty}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
          {island.minigame.description}
        </p>

        {/* Phase Indicator */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-amber-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Mini-Game Arena
          </span>
          <span className="text-slate-400">
            Pre-Game Stage
          </span>
        </div>
      </div>

      {/* Mini Interactive Arena */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
        {/* Score Display */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider block">
              Score
            </span>
            <span className="text-3xl font-extrabold font-mono text-white">
              {score}
            </span>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <div className="text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider block flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400 inline" /> High Score
            </span>
            <span className="text-3xl font-extrabold font-mono text-amber-400">
              {highScore}
            </span>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <div className="text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider block flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-400 inline" /> Combo
            </span>
            <span className="text-3xl font-extrabold font-mono text-rose-400">
              {combo}x
            </span>
          </div>
        </div>

        {/* Interactive Action Button */}
        <button
          onClick={handleTap}
          className="w-full max-w-xs py-4 rounded-xl font-bold text-white text-base shadow-xl transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${island.accentColor}, #4f46e5)`,
            boxShadow: `0 10px 25px -5px ${island.accentColor}40`,
          }}
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Charge Island Energy</span>
        </button>

        <p className="text-[11px] text-slate-400">
          Click rapidly to generate power and trigger combo celebrations!
        </p>

        {score > 0 && (
          <button
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 font-mono transition-colors pt-2"
          >
            <RotateCcw className="w-3 h-3" /> Reset Session
          </button>
        )}
      </div>

      {/* Idea Box Banner */}
      <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/80 text-xs text-slate-400 space-y-1">
        <span className="font-semibold text-slate-300 block">💡 Ready for Deep Game Design</span>
        <p className="leading-relaxed">
          When you're ready to build the full mechanics for this specific hexagon, we can flesh out custom physics, puzzles, and unlockable achievement rewards right inside this container!
        </p>
      </div>
    </div>
  );
};
