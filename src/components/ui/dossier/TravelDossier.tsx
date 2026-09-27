import React from 'react';
import { Compass, Globe, MapPin, Sparkles, Plane } from 'lucide-react';
import { portfolioData } from '../../../data/portfolioData';

export const TravelDossier: React.FC = () => {
  const { travel } = portfolioData;
  if (!travel) return null;

  return (
    <div className="space-y-6 text-slate-200">
      {/* Travel Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
          <Globe className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <span className="text-2xl font-bold font-mono text-white block">
            {travel.countriesVisited}
          </span>
          <span className="text-xs text-cyan-300 font-mono">Countries Explored</span>
        </div>

        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
          <MapPin className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <span className="text-2xl font-bold font-mono text-white block">
            {travel.citiesExplored}+
          </span>
          <span className="text-xs text-cyan-300 font-mono">Cities & Valleys</span>
        </div>
      </div>

      {/* Next On Wishlist */}
      <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
          <Plane className="w-3.5 h-3.5" />
          <span>Next Expedition Wishlist</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {travel.nextWishlist.map((dest, idx) => (
            <span
              key={idx}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono"
            >
              📍 {dest}
            </span>
          ))}
        </div>
      </div>

      {/* Destinations List */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          Travel Memories & Expedition Highlights
        </h4>

        <div className="space-y-3">
          {travel.destinations.map((dest, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{dest.flag}</span>
                  <div>
                    <h5 className="text-base font-bold text-white">{dest.city}</h5>
                    <span className="text-xs text-cyan-400">{dest.country}</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                  {dest.year}
                </span>
              </div>

              <div className="text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                <p className="italic text-slate-300 leading-relaxed mb-1">
                  "{dest.highlight}"
                </p>
                <div className="text-[11px] text-cyan-300/80 flex items-center gap-1 mt-1 font-mono">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Vibe: {dest.vibe}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {dest.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800/70 text-slate-400 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
