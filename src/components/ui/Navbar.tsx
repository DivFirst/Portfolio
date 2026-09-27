import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, RotateCcw, FileText, Github, Linkedin, Mail } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import { sound } from '../../utils/soundEffects';

interface NavbarProps {
  isIslandFocused: boolean;
  onResetView: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isIslandFocused, onResetView }) => {
  const { profile } = portfolioData;
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [isBgmActive, setIsBgmActive] = useState(true);

  // Automatically start ambient music on mount, and handle browser autoplay policy unlocks
  useEffect(() => {
    sound.startAmbientMusic();

    const handleFirstGesture = () => {
      if (!sound.hasUserStoppedBgm()) {
        sound.startAmbientMusic();
        setIsBgmActive(true);
      }
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, []);

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playSelect();
    }
  };

  const handleToggleBgm = () => {
    sound.playSelect();
    const playing = sound.toggleAmbientMusic();
    setIsBgmActive(playing);
  };

  const [imageError, setImageError] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-30 p-4 pointer-events-none flex items-start justify-between">
      {/* Player Profile Card */}
      <div className="glass-panel px-4 py-2.5 rounded-2xl flex items-center gap-3.5 pointer-events-auto border border-white/10 shadow-xl max-w-sm">
        <div className="relative">
          {!imageError ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              onError={() => setImageError(true)}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/50 bg-slate-900"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-500 ring-2 ring-indigo-500/50 flex items-center justify-center font-bold text-white text-xs tracking-wider">
              DG
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900 animate-pulse" />
        </div>

        <div className="overflow-hidden">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-extrabold text-white tracking-tight truncate">
              {profile.name}
            </h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
              LVL. 99
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            {profile.title}
          </p>
        </div>
      </div>

      {/* Control Actions & Audio Hub */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Reset Camera to World View / Default Angle Button */}
        <button
          onClick={() => {
            sound.playWhoosh();
            onResetView();
          }}
          className={`glass-panel px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border shadow-lg ${
            isIslandFocused
              ? 'text-white border-indigo-500/40 shadow-indigo-500/20 bg-indigo-600/20 hover:bg-indigo-600/30'
              : 'text-slate-400 border-white/10 hover:text-white hover:bg-white/5'
          }`}
          title={isIslandFocused ? "Return to World View (Esc)" : "Reset Camera to Default Angle (Esc)"}
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isIslandFocused ? 'text-indigo-400' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">{isIslandFocused ? 'World Overview' : 'Reset View'}</span>
        </button>

        {/* Generative Lofi Ambient Music Toggle */}
        <button
          onClick={handleToggleBgm}
          className={`glass-panel p-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${
            isBgmActive
              ? 'bg-indigo-600/40 text-indigo-300 border-indigo-500/60 shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5 border-white/10'
          }`}
          title={isBgmActive ? "Stop Ambient Music" : "Play Generative Ambient Music"}
        >
          <Music className={`w-4 h-4 ${isBgmActive ? 'animate-pulse text-indigo-300' : ''}`} />
          {isBgmActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping hidden sm:inline-block" />
          )}
        </button>

        {/* Master Sound Effects Toggle */}
        <button
          onClick={handleToggleMute}
          className={`glass-panel p-2.5 rounded-xl border transition-all ${
            isMuted
              ? 'text-rose-400 border-rose-500/30 bg-rose-500/10'
              : 'text-slate-300 hover:text-white hover:bg-white/5 border-white/10'
          }`}
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Social / Resume links */}
        <div className="hidden md:flex items-center gap-1.5 glass-panel p-1 rounded-xl border border-white/10">
          <a
            href={profile.socials.find(s => s.icon === 'Github')?.url || 'https://github.com/DivFirst'}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={profile.socials.find(s => s.icon === 'Linkedin')?.url || 'https://www.linkedin.com/in/divgarg03/'}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={profile.socials.find(s => s.icon === 'Mail')?.url || 'mailto:divgarg03@gmail.com'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume</span>
          </a>
        </div>
      </div>
    </header>
  );
};
