import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import clsx from 'clsx';
import { playArcadeSfx, type ArcadeSfx } from './arcadeSound';
import { sound as worldSound } from '../../utils/soundEffects';

/**
 * Shared arcade settings: sound (muted by default), CRT overlay, and a
 * "reduced motion" switch (Recruiter Mode turns it on). Wrap arcade UI in
 * <ArcadeProvider>; it renders the `.arcade-root` wrapper that scopes the styles.
 */
interface ArcadeSettings {
  soundOn: boolean;
  setSoundOn: (on: boolean) => void;
  crtOn: boolean;
  setCrtOn: (on: boolean) => void;
  forceReducedMotion: boolean;
  setForceReducedMotion: (on: boolean) => void;
  /** true when the device asks for less motion OR forceReducedMotion is on */
  reducedMotion: boolean;
  /** plays a chiptune sound, only when sound is on */
  play: (sfx: ArcadeSfx) => void;
}

const ArcadeContext = createContext<ArcadeSettings | null>(null);

const SOUND_KEY = 'arcade-sound';

function readSound() {
  try { return localStorage.getItem(SOUND_KEY) === 'on'; } catch { return false; }
}

function useSystemReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

export function ArcadeProvider({ children, className }: { children: ReactNode; className?: string }) {
  const [soundOn, setSoundOn] = useState(readSound);
  const [crtOn, setCrtOn] = useState(true);
  const [forceReducedMotion, setForceReducedMotion] = useState(false);
  const systemReduced = useSystemReducedMotion();
  const reducedMotion = systemReduced || forceReducedMotion;

  useEffect(() => {
    try { localStorage.setItem(SOUND_KEY, soundOn ? 'on' : 'off'); } catch { /* storage blocked: fine */ }
    // One switch for all sound effects: also mute/unmute the 3D world's sound engine.
    worldSound.setMuted(!soundOn);
  }, [soundOn]);

  const play = useCallback((sfx: ArcadeSfx) => { if (soundOn) playArcadeSfx(sfx); }, [soundOn]);

  const value = useMemo(
    () => ({ soundOn, setSoundOn, crtOn, setCrtOn, forceReducedMotion, setForceReducedMotion, reducedMotion, play }),
    [soundOn, crtOn, forceReducedMotion, reducedMotion, play],
  );

  return (
    <ArcadeContext.Provider value={value}>
      <div className={clsx('arcade-root', forceReducedMotion && 'arcade-reduce-motion', className)}>{children}</div>
    </ArcadeContext.Provider>
  );
}

export function useArcade(): ArcadeSettings {
  const ctx = useContext(ArcadeContext);
  if (!ctx) throw new Error('Arcade components must be used inside <ArcadeProvider>.');
  return ctx;
}

/** true when animations should be skipped (device setting or Recruiter Mode) */
export function useReducedMotion() {
  return useArcade().reducedMotion;
}
