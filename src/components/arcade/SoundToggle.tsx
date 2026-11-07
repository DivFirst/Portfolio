import clsx from 'clsx';
import { useArcade } from './ArcadeProvider';
import { playArcadeSfx } from './arcadeSound';

/** "🔊 SOUND: OFF / ON" switch. Sound is muted by default and remembered (DESIGN.md §6). */
export function SoundToggle({ className }: { className?: string }) {
  const { soundOn, setSoundOn } = useArcade();
  return (
    <button
      type="button"
      className={clsx('arcade-toggle text-[9px]', className)}
      aria-pressed={soundOn}
      aria-label="Sound effects"
      onClick={() => {
        const next = !soundOn;
        setSoundOn(next);
        if (next) playArcadeSfx('coin');
      }}
    >
      <span aria-hidden="true">🔊 <span className="hidden sm:inline">Sound: </span>{soundOn ? 'On' : 'Off'}</span>
    </button>
  );
}
