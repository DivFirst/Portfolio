// 8-bit square-wave sounds made in code (DESIGN.md §6). No audio files.
// Call through useArcade().play(), which respects the sound toggle (muted by default).

let ctx: AudioContext | null = null;

function beep(notes: number[], ms: number) {
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  if (!ctx) ctx = new AudioCtx();
  if (ctx.state === 'suspended') void ctx.resume();
  const audio = ctx;
  const t0 = audio.currentTime;
  notes.forEach((freq, i) => {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    const start = t0 + (i * ms) / 1000;
    gain.gain.setValueAtTime(0.06, start);
    gain.gain.setValueAtTime(0, start + ms / 1000 - 0.005);
    osc.connect(gain).connect(audio.destination);
    osc.start(start);
    osc.stop(start + ms / 1000);
  });
}

const SFX = {
  hover: () => beep([880], 30),
  press: () => beep([660, 990], 60),
  open: () => beep([523, 659, 784], 55),
  close: () => beep([784, 523], 55),
  coin: () => beep([988, 1319], 90),
  stageClear: () => beep([523, 659, 784, 1047, 1319], 110),
};

export type ArcadeSfx = keyof typeof SFX;

export function playArcadeSfx(sfx: ArcadeSfx) {
  try { SFX[sfx](); } catch { /* audio unavailable: stay silent */ }
}
