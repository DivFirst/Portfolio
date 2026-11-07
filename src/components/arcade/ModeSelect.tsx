import clsx from 'clsx';
import { accentClass } from './accent';

export type ArcadeMode = 'fun' | 'recruiter';

interface ModeSelectProps {
  onPick: (mode: ArcadeMode) => void;
  kicker?: string;
}

const options = [
  {
    mode: 'fun' as const,
    accent: 'pink' as const,
    icon: '🕹️',
    name: 'Fun Mode',
    nameClass: 'text-arcade-pink',
    goClass: 'bg-arcade-pink shadow-[inset_-3px_-3px_0_0_#a3104f]',
    desc: 'Play through my story as an arcade game, with animations and sound.',
    go: 'Start ▶',
  },
  {
    mode: 'recruiter' as const,
    accent: 'cyan' as const,
    icon: '📄',
    name: 'Recruiter Mode',
    nameClass: 'text-arcade-cyan',
    goClass: 'bg-arcade-cyan shadow-[inset_-3px_-3px_0_0_#007a85]',
    desc: 'Skip the game. A quick, clean view of my experience and resume.',
    go: 'Open ▶',
  },
];

/**
 * First screen: "How would you like to explore?" with Fun Mode / Recruiter Mode.
 * Uses the readable body font, no CRT or animation (DESIGN.md §4).
 */
export function ModeSelect({ onPick, kicker = 'Divyanshu Garg · Portfolio' }: ModeSelectProps) {
  return (
    <main className="flex min-h-screen min-h-[100dvh] flex-col items-center justify-center px-4 py-10 text-center">
      <p className="arcade-display mb-4 text-[10px] tracking-[0.08em] text-arcade-pink">{kicker}</p>
      <h1 className="mb-8 max-w-[20ch] font-arcade text-[26px] font-bold leading-tight text-arcade-text sm:max-w-none md:mb-11 md:text-[34px]">
        How would you like to explore?
      </h1>
      <div className="grid w-full max-w-[760px] grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-9">
        {options.map((o) => (
          <button key={o.mode} type="button" className={clsx('arcade-mode-card', accentClass[o.accent])} onClick={() => onPick(o.mode)}>
            <span className="text-[36px] leading-none" aria-hidden="true">{o.icon}</span>
            <span className={clsx('text-[26px] font-bold leading-tight', o.nameClass)}>{o.name}</span>
            <span className="text-[17px] leading-normal text-arcade-text">{o.desc}</span>
            <span className={clsx('mt-2 px-3.5 py-2.5 text-base font-bold text-arcade-bg', o.goClass)} aria-hidden="true">{o.go}</span>
          </button>
        ))}
      </div>
      <p className="mt-9 text-[15px] text-arcade-muted">You can switch modes at any time.</p>
    </main>
  );
}
