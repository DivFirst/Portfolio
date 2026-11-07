// 8-bit sound engine for the whole site (DESIGN.md §6, BUILD_GUIDE step 3.6).
// Every sound is made in code with square / triangle oscillators — no audio files.
//
// Rules:
//  - Quiet: sound effects peak at gain 0.05, music at 0.03.
//  - Off until the visitor picks Fun Mode, which switches sound + music on (Recruiter Mode: off).
//    The 🔊 toggle (ArcadeProvider) calls setMuted(); music has its own 🎵 toggle. Both are remembered.
//  - Never before a click: nothing plays (and no AudioContext is created) until the visitor
//    has clicked, tapped or pressed a key on the page.

export type Sfx =
  | 'hover' | 'select' | 'press' | 'open' | 'close' | 'coin'
  | 'bonk' | 'stageClear' | 'levelUp' | 'whoosh' | 'tick';

type Wave = 'square' | 'triangle';

const SFX_GAIN = 0.05;
const MUSIC_KEY = 'arcade-music';
const readMusicPref = () => { try { return localStorage.getItem(MUSIC_KEY) === 'on'; } catch { return false; } };
const saveMusicPref = (on: boolean) => { try { localStorage.setItem(MUSIC_KEY, on ? 'on' : 'off'); } catch { /* fine */ } };
const MUSIC_GAIN = 0.03;

// ---------- "has the visitor interacted yet?" ----------
let unlocked = false;
if (typeof window !== 'undefined') {
  const unlock = () => {
    unlocked = true;
    window.removeEventListener('pointerdown', unlock, true);
    window.removeEventListener('keydown', unlock, true);
    window.removeEventListener('touchstart', unlock, true);
  };
  window.addEventListener('pointerdown', unlock, true);
  window.addEventListener('keydown', unlock, true);
  window.addEventListener('touchstart', unlock, true);
}

// ---------- notes ----------
const NOTE: Record<string, number> = {
  A2: 110, C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196, A3: 220, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392, A4: 440, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880, B5: 987.77,
  C6: 1046.5, E6: 1318.51,
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private sfxBus: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private isMuted = true;
  private lastHover = 0;

  // music state
  private musicOn = false;
  private musicTimer: number | null = null;
  private nextStepTime = 0;
  private step = 0;
  /** the visitor wants music (remembered); it starts at their first click if needed */
  private musicWanted = readMusicPref();
  private listeners = new Set<() => void>();

  constructor() {
    // Returning visitor who left music on: start it after their first click/tap/key has been
    // handled (window bubble phase runs last), so a click that turns music off wins.
    if (typeof window === 'undefined') return;
    const resume = () => {
      window.removeEventListener('click', resume);
      window.removeEventListener('keydown', resume);
      if (this.musicWanted && !this.musicOn) this.startAmbientMusic();
    };
    window.addEventListener('click', resume);
    window.addEventListener('keydown', resume);
  }

  private notify() { this.listeners.forEach((l) => l()); }
  /** for React (useSyncExternalStore): re-render when music starts/stops */
  public subscribe = (l: () => void) => { this.listeners.add(l); return () => { this.listeners.delete(l); }; };

  /** Music switch: remembers the choice; starts now if audio is allowed, else at the first click. */
  public setMusic(on: boolean) {
    this.musicWanted = on;
    saveMusicPref(on);
    if (on) this.startAmbientMusic(); else this.stopAmbientMusic();
    this.notify();
  }

  /** AudioContext, created lazily and only after the first click/tap/key. */
  private audio(): AudioContext | null {
    if (!unlocked) return null;
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return null;
      this.ctx = new Ctx();
      this.sfxBus = this.ctx.createGain();
      this.sfxBus.gain.value = 1;
      this.sfxBus.connect(this.ctx.destination);
      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = 0;
      this.musicBus.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  /** One chiptune note with a tiny attack/release so it doesn't click. */
  private tone(bus: GainNode, freq: number, start: number, dur: number, wave: Wave, peak: number, slideTo?: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, start);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(peak, start + 0.004);
    g.gain.setValueAtTime(peak, start + Math.max(0.005, dur - 0.02));
    g.gain.linearRampToValueAtTime(0, start + dur);
    osc.connect(g).connect(bus);
    osc.start(start);
    osc.stop(start + dur + 0.01);
  }

  /** notes = [freq, beats]; one beat = `beat` seconds */
  private seq(notes: [number, number][], beat: number, wave: Wave = 'square', peak = SFX_GAIN, offset = 0) {
    const ctx = this.ctx!;
    let t = ctx.currentTime + 0.01 + offset;
    for (const [f, beats] of notes) {
      if (f > 0) this.tone(this.sfxBus!, f, t, beats * beat, wave, peak);
      t += beats * beat;
    }
  }

  private sounds: Record<Sfx, () => void> = {
    hover: () => this.seq([[NOTE.A5, 1]], 0.03, 'square', SFX_GAIN * 0.6),
    select: () => this.seq([[NOTE.E5, 1], [NOTE.B5, 1]], 0.05),
    press: () => this.seq([[NOTE.E5, 1], [NOTE.B5, 1]], 0.05),
    open: () => this.seq([[NOTE.C5, 1], [NOTE.E5, 1], [NOTE.G5, 1]], 0.05),
    close: () => this.seq([[NOTE.G5, 1], [NOTE.C5, 1]], 0.05),
    tick: () => this.seq([[NOTE.A4, 1]], 0.04, 'square', SFX_GAIN * 0.7),
    // classic coin: short B5, then a held E6
    coin: () => this.seq([[NOTE.B5, 1], [NOTE.E6, 3.5]], 0.07),
    // "?" block bonk: a quick downward thud on triangle + a short square knock
    bonk: () => {
      const t = this.ctx!.currentTime + 0.01;
      this.tone(this.sfxBus!, 330, t, 0.09, 'triangle', SFX_GAIN * 1.6, 110);
      this.tone(this.sfxBus!, NOTE.C5, t, 0.04, 'square', SFX_GAIN * 0.6);
    },
    // STAGE CLEAR: rising fanfare with a triangle bass under it (< 1.2 s)
    stageClear: () => {
      this.seq([[NOTE.C5, 1], [NOTE.E5, 1], [NOTE.G5, 1], [NOTE.C6, 2], [NOTE.G5, 1], [NOTE.C6, 4]], 0.1);
      this.seq([[NOTE.C3, 3], [NOTE.G3, 3], [NOTE.C4, 4]], 0.1, 'triangle', SFX_GAIN * 1.2);
    },
    // LEVEL UP (Trophy Room): quick climbing arpeggio
    levelUp: () => this.seq(
      [[NOTE.C5, 1], [NOTE.E5, 1], [NOTE.G5, 1], [NOTE.C6, 1], [NOTE.E5, 1], [NOTE.G5, 1], [NOTE.C6, 1], [NOTE.E6, 3]],
      0.06,
    ),
    // camera fly: an 8-bit sweep instead of a noise whoosh
    whoosh: () => {
      const t = this.ctx!.currentTime + 0.01;
      this.tone(this.sfxBus!, 220, t, 0.16, 'triangle', SFX_GAIN * 1.2, 880);
    },
  };

  /** Play a sound effect (respects the 🔊 toggle). */
  public play(sfx: Sfx) {
    if (this.isMuted) return;
    this.playNow(sfx);
  }

  /** Play even if the engine still thinks it's muted (the arcade kit checks the toggle itself). */
  public playNow(sfx: Sfx) {
    if (sfx === 'hover') {
      const now = performance.now();
      if (now - this.lastHover < 70) return; // no machine-gun blips when sweeping across buttons
      this.lastHover = now;
    }
    try {
      if (!this.audio()) return;
      this.sounds[sfx]();
    } catch { /* audio unavailable: stay silent */ }
  }

  // ---------- older names used around the 3D world ----------
  public playHover() { this.play('hover'); }
  public playSelect() { this.play('select'); }
  public playWhoosh() { this.play('whoosh'); }
  public playClose() { this.play('close'); }

  public getMuted() { return this.isMuted; }
  public setMuted(muted: boolean) { this.isMuted = muted; }
  public toggleMute() { this.isMuted = !this.isMuted; return this.isMuted; }

  // ---------- chiptune music loop ----------
  // Original 4-bar loop in A minor (Am · F · C · G), 132 BPM, 16th-note steps.
  // Lead on square, bass on triangle. Scheduled slightly ahead so it never stutters.
  private static STEP = 60 / 132 / 4;
  private static LEAD: (number | 0)[] = [
    // bar 1: Am
    NOTE.A4, 0, NOTE.C5, 0, NOTE.E5, 0, NOTE.C5, 0, NOTE.A4, 0, NOTE.E5, NOTE.D5, NOTE.C5, 0, NOTE.B4, 0,
    // bar 2: F
    NOTE.A4, 0, NOTE.C5, 0, NOTE.F5, 0, NOTE.C5, 0, NOTE.A4, 0, NOTE.F5, NOTE.E5, NOTE.D5, 0, NOTE.C5, 0,
    // bar 3: C
    NOTE.G4, 0, NOTE.C5, 0, NOTE.E5, 0, NOTE.G5, 0, NOTE.E5, 0, NOTE.C5, 0, NOTE.D5, 0, NOTE.E5, 0,
    // bar 4: G
    NOTE.D5, 0, NOTE.B4, 0, NOTE.G4, 0, NOTE.B4, 0, NOTE.D5, 0, NOTE.G5, 0, NOTE.F5, NOTE.E5, NOTE.D5, NOTE.B4,
  ];
  // bass per bar: [root, octave] for Am, F, C, G
  private static BASS: number[] = [110, 220, 87.31, 174.61, 130.81, 261.63, 98, 196];

  private scheduleMusic = () => {
    const ctx = this.ctx;
    if (!ctx || !this.musicOn) return;
    const S = SoundEngine.STEP;
    while (this.nextStepTime < ctx.currentTime + 0.15) {
      const i = this.step % 64;
      const lead = SoundEngine.LEAD[i];
      if (lead) this.tone(this.musicBus!, lead, this.nextStepTime, S * 0.9, 'square', 0.5);
      // bass: eighth notes, root then octave, per bar
      if (i % 2 === 0) {
        const bar = Math.floor(i / 16);
        const f = SoundEngine.BASS[bar * 2 + ((i / 2) % 2)];
        this.tone(this.musicBus!, f, this.nextStepTime, S * 1.8, 'triangle', 0.9);
      }
      this.nextStepTime += S;
      this.step += 1;
    }
  };

  public isBgm() { return this.musicOn; }
  /** what the music switch should show: on if playing or waiting for the first click */
  public isMusicWanted() { return this.musicWanted; }
  public hasUserStoppedBgm() { return !this.musicOn; }

  public startAmbientMusic(): boolean {
    const ctx = this.audio();
    if (!ctx || !this.musicBus) return false;
    if (this.musicOn) return true;
    this.musicOn = true;
    this.step = 0;
    this.nextStepTime = ctx.currentTime + 0.05;
    this.musicBus.gain.cancelScheduledValues(ctx.currentTime);
    this.musicBus.gain.setValueAtTime(MUSIC_GAIN, ctx.currentTime);
    this.scheduleMusic();
    this.musicTimer = window.setInterval(this.scheduleMusic, 40);
    this.notify();
    return true;
  }

  public stopAmbientMusic(): boolean {
    this.musicOn = false;
    if (this.musicTimer) { window.clearInterval(this.musicTimer); this.musicTimer = null; }
    if (this.ctx && this.musicBus) this.musicBus.gain.setTargetAtTime(0, this.ctx.currentTime, 0.03);
    this.notify();
    return false;
  }

  public toggleAmbientMusic(start?: boolean): boolean {
    if (start === true) return this.startAmbientMusic();
    if (start === false) return this.stopAmbientMusic();
    return this.musicOn ? this.stopAmbientMusic() : this.startAmbientMusic();
  }
}

export const sound = new SoundEngine();
