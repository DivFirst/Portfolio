import type { ReactNode } from 'react';
import clsx from 'clsx';

/**
 * Hard on/off blink for "PRESS START", cursors and "SCROLL ▼" (DESIGN.md §4).
 * Stays visible and still when reduced motion is on (handled in index.css).
 */
export function BlinkingText({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={clsx('inline-block animate-arcade-blink', className)}>{children}</span>;
}
