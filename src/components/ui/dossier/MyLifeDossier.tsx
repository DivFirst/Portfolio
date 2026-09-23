import React from 'react';
import { Sparkles, Heart, Compass, Lightbulb, Quote } from 'lucide-react';
import { portfolioData } from '../../../data/portfolioData';

export const MyLifeDossier: React.FC = () => {
  const { life, profile } = portfolioData;

  return (
    <div className="space-y-6 text-slate-200">
      {/* Quote Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
        <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm italic text-amber-200/90 leading-relaxed font-serif">
            "{life.quote}"
          </p>
          <span className="text-xs text-amber-400/80 font-mono mt-1 block">
            — {profile.name}'s Core Motto
          </span>
        </div>
      </div>

      {/* Origin Story */}
      <div className="space-y-2">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          The Origin Story
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-3.5 rounded-lg border border-slate-800">
          {life.origin}
        </p>
      </div>

      {/* Core Values Grid */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-amber-400" />
          Guiding Values
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {life.values.map((v, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:border-amber-500/40 transition-colors"
            >
              <h5 className="text-sm font-semibold text-amber-300 mb-1">{v.title}</h5>
              <p className="text-xs text-slate-400 leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Life Milestones Timeline */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          Journey Milestones
        </h4>
        <div className="relative pl-5 border-l-2 border-amber-500/30 space-y-4">
          {life.milestones.map((m, idx) => (
            <div key={idx} className="relative group">
              <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-500/20 group-hover:scale-125 transition-transform" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400">{m.year}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                  {m.tag}
                </span>
              </div>
              <h5 className="text-sm font-semibold text-slate-100 mt-0.5">{m.title}</h5>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fun Facts */}
      <div className="space-y-2">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          Random Fun Facts
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {life.funFacts.map((fact, idx) => (
            <div
              key={idx}
              className="text-xs text-slate-300 p-2.5 rounded-lg bg-slate-800/30 border border-slate-800 flex items-start gap-2"
            >
              <span className="text-amber-400 font-mono font-bold">0{idx + 1}.</span>
              <span>{fact}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
