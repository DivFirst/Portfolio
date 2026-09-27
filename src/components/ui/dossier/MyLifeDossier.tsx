import React from 'react';
import {
  Sparkles,
  Compass,
  Lightbulb,
  Quote,
  MapPin,
  Award,
  GraduationCap,
  TrendingUp,
  Briefcase,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { portfolioData } from '../../../data/portfolioData';

// Helper icon resolver for milestone and value items
const renderMilestoneIcon = (iconName?: string) => {
  switch (iconName) {
    case 'MapPin':
      return <MapPin className="w-4 h-4 text-amber-400" />;
    case 'Award':
      return <Award className="w-4 h-4 text-amber-400" />;
    case 'GraduationCap':
      return <GraduationCap className="w-4 h-4 text-amber-400" />;
    case 'TrendingUp':
      return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    case 'Briefcase':
      return <Briefcase className="w-4 h-4 text-sky-400" />;
    case 'ShieldAlert':
    case 'ShieldCheck':
      return <ShieldCheck className="w-4 h-4 text-amber-400" />;
    case 'Cpu':
      return <Cpu className="w-4 h-4 text-indigo-400" />;
    default:
      return <Sparkles className="w-4 h-4 text-amber-400" />;
  }
};

const renderValueIcon = (iconName: string) => {
  switch (iconName) {
    case 'Compass':
      return <Compass className="w-4 h-4 text-amber-400" />;
    case 'Cpu':
      return <Cpu className="w-4 h-4 text-sky-400" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    case 'Sparkles':
      return <Sparkles className="w-4 h-4 text-amber-400" />;
    default:
      return <Layers className="w-4 h-4 text-amber-400" />;
  }
};

export const MyLifeDossier: React.FC = () => {
  const { life, profile } = portfolioData;

  const journeyRoute = [
    'Ghaziabad',
    'Delhi',
    'Gorakhpur',
    'Muzaffarpur',
    'Jamnagar',
    'Ranchi',
    'Rupnagar',
    'Mumbai',
  ];

  return (
    <div className="space-y-8 text-slate-200">
      {/* Quote Banner */}
      <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-amber-950/20 border border-amber-500/30 shadow-lg shadow-amber-950/30 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
          <Quote className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm md:text-base italic text-amber-100/95 leading-relaxed font-serif">
            "{life.quote}"
          </p>
          <span className="text-xs text-amber-400/80 font-mono mt-1.5 block tracking-wide">
            — {profile.name}'s Guiding Philosophy
          </span>
        </div>
      </div>

      {/* Quick Stats Strip */}
      {life.stats && life.stats.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {life.stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 group shadow-sm hover:shadow-amber-500/5"
              >
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  {stat.label}
                </span>
                <div className="text-lg md:text-xl font-bold font-mono text-amber-300 group-hover:text-amber-200 transition-colors">
                  {stat.value}
                </div>
                {stat.subtext && (
                  <p className="text-[11px] text-slate-400/90 mt-0.5 leading-snug line-clamp-1">
                    {stat.subtext}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Origin Story & Nomadic Route */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase tracking-wider font-bold text-amber-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            The Origin & Nomadic Roots
          </h4>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
            6 States / Cities
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed">
            {life.origin}
          </p>

          {/* Breadcrumb Route */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-1.5">
              The Path Across India:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {journeyRoute.map((city, idx) => (
                <React.Fragment key={city}>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    idx === journeyRoute.length - 1
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                      : 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
                  }`}>
                    {city}
                  </span>
                  {idx < journeyRoute.length - 1 && (
                    <span className="text-slate-600 text-xs">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Life Journey Milestones Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase tracking-wider font-bold text-amber-400 flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            Life Journey & Milestones
          </h4>
          <span className="text-[11px] font-mono text-slate-400">
            7 Pivotal Chapters
          </span>
        </div>

        <div className="relative pl-6 md:pl-8 space-y-6 before:absolute before:left-3 md:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-amber-500/50 before:to-amber-500/10">
          {life.milestones.map((m, idx) => (
            <div
              key={idx}
              className="relative group transition-all duration-300"
            >
              {/* Timeline Node Pin */}
              <div className="absolute -left-[30px] md:-left-[38px] top-1.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-amber-400/80 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-115 group-hover:border-amber-300 transition-transform">
                <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:bg-amber-300 transition-colors" />
              </div>

              {/* Milestone Card */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 space-y-2.5 shadow-sm hover:shadow-md hover:shadow-amber-500/5">
                {/* Header row: Year, Tag, Location */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      {m.year}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-amber-200/90 border border-slate-700 font-mono font-medium">
                      {m.tag}
                    </span>
                  </div>

                  {m.location && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <MapPin className="w-3 h-3 text-amber-400/70" />
                      {m.location}
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h5 className="text-sm md:text-base font-semibold text-slate-100 flex items-center gap-2">
                    {renderMilestoneIcon(m.icon)}
                    {m.title}
                  </h5>
                  {m.subtitle && (
                    <p className="text-xs text-amber-300/80 font-medium mt-0.5">
                      {m.subtitle}
                    </p>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm text-slate-300/95 leading-relaxed">
                  {m.description}
                </p>

                {/* Key Highlights list */}
                {m.highlights && m.highlights.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    {m.highlights.map((highlight, hIdx) => (
                      <div
                        key={hIdx}
                        className="text-xs text-slate-300 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Guiding Values Grid */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider font-bold text-amber-400 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          Guiding Values & Principles
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {life.values.map((v, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/40 transition-colors space-y-1"
            >
              <div className="flex items-center gap-2">
                {renderValueIcon(v.icon)}
                <h5 className="text-sm font-semibold text-amber-200">{v.title}</h5>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Beyond Work & Fun Facts */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider font-bold text-amber-400 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          Beyond The Resume & Anecdotes
        </h4>
        <div className="grid grid-cols-1 gap-2.5">
          {life.funFacts.map((fact, idx) => (
            <div
              key={idx}
              className="text-xs text-slate-300 p-3 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700/80 flex items-start gap-3 transition-colors"
            >
              <span className="text-amber-400 font-mono font-bold shrink-0 text-sm">
                0{idx + 1}.
              </span>
              <span className="leading-relaxed">{fact}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
