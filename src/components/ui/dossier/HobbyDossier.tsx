import { Music, Camera, Gamepad2, Coffee, Sparkles } from 'lucide-react';
import { portfolioData } from '../../../data/portfolioData';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Music,
  Camera,
  Gamepad2,
  Coffee,
};

export const HobbyDossier: React.FC = () => {
  const { hobby } = portfolioData;

  return (
    <div className="space-y-6 text-slate-200">
      <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-between gap-3">
        <p className="text-xs text-pink-200/90 leading-relaxed">
          {hobby.summary}
        </p>
        <span className="text-[11px] font-mono text-pink-400 shrink-0 italic">
          "{hobby.creativeQuote}"
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hobby.hobbies.map((h) => {
          const IconComponent = iconMap[h.icon] || Sparkles;
          return (
            <div
              key={h.id}
              className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-pink-500/30 transition-all space-y-3"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{h.name}</h4>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {h.description}
              </p>

              {/* Current Obsession */}
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400 font-bold block mb-0.5">
                  Current Obsession
                </span>
                <span className="text-slate-300 italic">{h.currentObsession}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {h.stats.map((s, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 font-mono block">{s.label}</span>
                    <span className="text-xs font-semibold text-slate-200">{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {h.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-pink-300/80 border border-pink-900/40 font-mono"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
