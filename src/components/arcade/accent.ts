// World/component accent colours (DESIGN.md §2). Full class names are written out
// so Tailwind keeps them in the build.
export type Accent = 'pink' | 'cyan' | 'yellow' | 'green' | 'purple' | 'dim';

export const accentClass: Record<Accent, string> = {
  pink: 'arcade-accent-pink',
  cyan: 'arcade-accent-cyan',
  yellow: 'arcade-accent-yellow',
  green: 'arcade-accent-green',
  purple: 'arcade-accent-purple',
  dim: 'arcade-accent-dim',
};

/** text colour for an accent; purple uses its lighter readable shade */
export const accentTextClass: Record<Accent, string> = {
  pink: 'text-arcade-pink',
  cyan: 'text-arcade-cyan',
  yellow: 'text-arcade-yellow',
  green: 'text-arcade-green',
  purple: 'text-arcade-purple-text',
  dim: 'text-arcade-muted',
};
