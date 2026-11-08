import { useEffect, useState } from 'react';
import { useArcade, BootScreen, ModeSelect, type ArcadeMode } from '../arcade';
import { portfolioCore } from '../../data/portfolioCore';
import { sound } from '../../utils/soundEffects';

/**
 * What a visitor sees before the 3D world (DESIGN.md §4, BUILD_GUIDE Part 2 step 1):
 *   first visit:     Mode select → (Fun) boot screen with PRESS START
 *                                 → (Recruiter) Recruiter Mode page at /cv
 *   returning visit: a short loading bar only, then straight into the world
 *                    (a returning Recruiter Mode visitor is sent to /cv by main.tsx)
 * Add ?intro to the address to see the full intro again; ?play (handled in App) skips straight to PRESS START.
 *
 * The 3D world loads in the background the whole time; `loadStage` reports how far it got.
 */

/** 0 = starting, 1 = 3D code downloaded, 2 = 3D scene created, 3 = first frames drawn */
export type LoadStage = 0 | 1 | 2 | 3;

const STORAGE_KEY = 'arcade-intro';

function readSavedMode(): ArcadeMode | null {
  try {
    if (new URLSearchParams(window.location.search).has('intro')) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const mode = (JSON.parse(raw) as { mode?: string }).mode;
    return mode === 'fun' || mode === 'recruiter' ? mode : null;
  } catch {
    return null; // storage blocked (private window etc.): show the full intro
  }
}

function saveMode(mode: ArcadeMode) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, at: Date.now() })); } catch { /* fine */ }
}

/**
 * Turns the coarse load stages into a smooth, honest bar: it creeps toward each stage's
 * ceiling while waiting and only reaches 100% when the world has really drawn.
 */
function useLoadPercent(stage: LoadStage) {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    const ceiling = [60, 80, 94, 100][stage];
    const id = window.setInterval(() => {
      setPercent((p) => {
        if (p >= ceiling) return p;
        const step = stage === 3 ? 12 : Math.max(1, Math.round((ceiling - p) * 0.08));
        return Math.min(ceiling, p + step);
      });
    }, 80);
    return () => window.clearInterval(id);
  }, [stage]);
  return percent;
}

type Phase = 'mode' | 'boot' | 'quick' | 'done';

function IntroFlow({ loadStage, onDone, skipModeSelect = false }: { loadStage: LoadStage; onDone: (mode: ArcadeMode) => void; skipModeSelect?: boolean }) {
  const { setCrtOn, setForceReducedMotion, setSoundOn } = useArcade();
  const [savedMode] = useState(readSavedMode);
  const [mode, setMode] = useState<ArcadeMode>(savedMode ?? 'fun');
  // Opened on a world link (site.com/#career): skip the mode question, go straight to the boot screen.
  const [phase, setPhase] = useState<Phase>(savedMode ? 'quick' : skipModeSelect ? 'boot' : 'mode');
  const percent = useLoadPercent(loadStage);
  const { profile } = portfolioCore;

  // Recruiter Mode = same content with CRT and animation off (DESIGN.md §4).
  useEffect(() => {
    setCrtOn(mode === 'fun');
    setForceReducedMotion(mode === 'recruiter');
  }, [mode, setCrtOn, setForceReducedMotion]);

  const finish = () => { setPhase('done'); onDone(mode); };

  // Fun Mode = the full arcade: sound effects + music on. The click that picks it is what lets
  // the browser start audio, so nothing plays before the visitor clicks. Recruiter Mode = silent.
  const setAudioFor = (m: ArcadeMode) => {
    setSoundOn(m === 'fun');
    sound.setMusic(m === 'fun');
  };

  const pick = (m: ArcadeMode) => {
    setMode(m);
    setAudioFor(m);
    if (m === 'recruiter') {
      // Recruiter Mode = the fast /cv page (no 3D). Remembered, so next time /cv opens directly.
      saveMode('recruiter');
      window.location.assign('/cv');
    } else {
      setPhase('boot');
    }
  };

  if (phase === 'done') return null;

  if (phase === 'mode') {
    return (
      <div className="arcade-intro-layer arcade-intro-modeselect">
        <ModeSelect onPick={pick} />
      </div>
    );
  }

  return (
    <BootScreen
      variant={phase === 'quick' ? 'quick' : 'full'}
      progress={percent}
      name={profile.name}
      headline={profile.title}
      recruiterHref="/cv"
      onRecruiter={() => saveMode('recruiter')}
      onStart={() => {
        // Opened on a world link: the mode question was skipped, so PRESS START counts as picking Fun Mode.
        if (skipModeSelect && !savedMode && phase === 'boot') setAudioFor('fun');
        saveMode(mode);
        finish();
      }}
    />
  );
}

/** Must sit inside <ArcadeProvider> (App provides it for the intro and the HUD). */
export function IntroGate(props: { loadStage: LoadStage; onDone: (mode: ArcadeMode) => void; skipModeSelect?: boolean }) {
  const [done, setDone] = useState(false);
  if (done) return null;
  return <IntroFlow {...props} onDone={(m) => { setDone(true); props.onDone(m); }} />;
}
