import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Mail, 
  Linkedin, 
  Github, 
  MapPin, 
  Sparkles,
  ExternalLink,
  Compass
} from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import { sound } from '../../utils/soundEffects';

interface HeroCardProps {
  isIslandFocused: boolean;
  onExploreIsland?: () => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({ isIslandFocused }) => {
  const { profile } = portfolioData;
  const [isMinimized, setIsMinimized] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Auto-minimize when an island is focused, auto-restore when returning to overview
  useEffect(() => {
    if (isIslandFocused) {
      setIsMinimized(true);
    } else {
      setIsMinimized(false);
    }
  }, [isIslandFocused]);

  const toggleMinimize = () => {
    sound.playSelect();
    setIsMinimized(!isMinimized);
  };

  return (
    <aside 
      className={`fixed top-24 left-4 sm:left-6 z-20 transition-all duration-500 ease-out pointer-events-auto ${
        isMinimized 
          ? '-translate-x-[calc(100%-2.75rem)] sm:-translate-x-[calc(100%-3rem)]' 
          : 'translate-x-0'
      }`}
      aria-label="Personal Introduction"
    >
      <div className="relative flex items-center">
        {/* Main Glassmorphic Card */}
        <div className="glass-panel w-[320px] sm:w-[360px] p-5 sm:p-6 rounded-3xl border border-white/15 shadow-2xl backdrop-blur-xl relative overflow-hidden bg-slate-950/75">
          {/* Subtle Ambient Color Glow inside Card */}
          <div className="absolute -top-16 -left-16 w-40 h-40 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Status & Location Badges */}
          <div className="flex items-center justify-between gap-2 mb-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available for High-Impact Roles
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <MapPin className="w-3 h-3 text-indigo-400" />
              {profile.location}
            </span>
          </div>

          {/* Profile Header (Avatar + Name + Title) */}
          <div className="flex items-start gap-3.5 mb-4">
            {/* Avatar with gradient ring and initials fallback */}
            <div className="relative flex-shrink-0">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl p-0.5 bg-gradient-to-tr from-indigo-500 via-sky-400 to-amber-400 shadow-lg">
                {!imageError ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    onError={() => setImageError(true)}
                    className="w-full h-full rounded-[14px] object-cover bg-slate-900"
                  />
                ) : (
                  <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center font-extrabold text-white text-base tracking-wider">
                    DG
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-slate-900 border border-indigo-500/40 text-[9px] font-mono font-bold text-indigo-300">
                IIT • XL
              </div>
            </div>

            {/* Name & Headline */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-extrabold text-white tracking-tight truncate">
                  {profile.name}
                </h2>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              </div>
              <p className="text-xs font-medium text-indigo-300 line-clamp-2 mt-0.5">
                {profile.title}
              </p>
            </div>
          </div>

          {/* Bio / Strategic Elevator Pitch */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 mb-4 text-xs text-slate-300 leading-relaxed font-sans">
            {profile.bio || profile.tagline}
          </div>

          {/* Quick Action CTAs */}
          <div className="flex items-center gap-2 mb-4">
            {/* Resume Button */}
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playSelect()}
              onMouseEnter={() => sound.playHover()}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 group"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-200" />
              <span>Resume</span>
              <ExternalLink className="w-3 h-3 text-indigo-300 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Contact Email CTA */}
            <a
              href={`mailto:${profile.socials.find(s => s.icon === 'Mail')?.url.replace('mailto:', '') || 'divgarg03@gmail.com'}`}
              onClick={() => sound.playSelect()}
              onMouseEnter={() => sound.playHover()}
              className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              title="Send Email"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Contact</span>
            </a>
          </div>

          {/* Social Links Row & Island Navigation Hint */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              {profile.socials.map((social) => {
                const Icon = social.icon === 'Linkedin' ? Linkedin :
                             social.icon === 'Github' ? Github : Mail;
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.playSelect()}
                    onMouseEnter={() => sound.playHover()}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    title={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono text-indigo-300">
              <Compass className="w-3 h-3 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Select an Island</span>
            </div>
          </div>
        </div>

        {/* Floating Toggle Tab (Attached to the card edge) */}
        <button
          onClick={toggleMinimize}
          onMouseEnter={() => sound.playHover()}
          className="ml-1 p-2 rounded-r-2xl glass-panel border border-l-0 border-white/15 text-slate-300 hover:text-white hover:bg-white/10 shadow-lg transition-all"
          title={isMinimized ? "Expand Profile Card" : "Minimize Profile Card"}
          aria-label={isMinimized ? "Expand Profile Card" : "Minimize Profile Card"}
        >
          {isMinimized ? (
            <ChevronRight className="w-4 h-4 text-indigo-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>
    </aside>
  );
};
