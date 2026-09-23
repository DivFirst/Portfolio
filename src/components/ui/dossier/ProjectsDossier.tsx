import React from 'react';
import { Terminal, ExternalLink, Github, Star, Sparkles } from 'lucide-react';
import { portfolioData } from '../../../data/portfolioData';

export const ProjectsDossier: React.FC = () => {
  const { projects } = portfolioData;

  return (
    <div className="space-y-6 text-slate-200">
      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <p className="text-xs text-emerald-200/90 leading-relaxed">
          {projects.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.projects.map((proj) => (
          <div
            key={proj.id}
            className={`p-4 rounded-xl border flex flex-col justify-between transition-all group ${
              proj.featured
                ? 'bg-slate-900/70 border-emerald-500/40 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10'
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {proj.title}
                  </h4>
                </div>
                {proj.featured && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Featured
                  </span>
                )}
              </div>

              <p className="text-xs font-medium text-emerald-400/90 mb-2">
                {proj.tagline}
              </p>

              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {proj.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {proj.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer with stats & links */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                {proj.stats?.stars && (
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400/40" />
                    {proj.stats.stars}
                  </span>
                )}
                {proj.stats?.metric && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                    {proj.stats.metric}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="GitHub Code"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                )}
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
                  >
                    <span>Live</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
