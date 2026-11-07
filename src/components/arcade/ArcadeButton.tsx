import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import clsx from 'clsx';
import { useArcade } from './ArcadeProvider';
import type { ArcadeSfx } from './arcadeSound';

export type ArcadeButtonVariant = 'primary' | 'secondary' | 'coin' | 'success' | 'ghost';

const variantClass: Record<ArcadeButtonVariant, string> = {
  primary: '',
  secondary: 'arcade-btn-secondary',
  coin: 'arcade-btn-coin',
  success: 'arcade-btn-success',
  ghost: 'arcade-btn-ghost',
};

interface CommonProps {
  variant?: ArcadeButtonVariant;
  /** Sound played on click (if sound is on). Default "press". Use null for none. */
  sound?: ArcadeSfx | null;
  children: ReactNode;
  className?: string;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** Arcade button that presses down when clicked (DESIGN.md §4). Pass `href` to render a link. */
export function ArcadeButton(props: ButtonProps | LinkProps) {
  const { play } = useArcade();
  const { variant = 'primary', sound = 'press', className, children } = props;
  const classes = clsx('arcade-btn', variantClass[variant], className);

  if (props.href !== undefined) {
    const { variant: _v, sound: _s, className: _c, children: _ch, onClick, ...rest } = props as LinkProps;
    return (
      <a
        {...rest}
        className={classes}
        onClick={(e: MouseEvent<HTMLAnchorElement>) => { if (sound) play(sound); onClick?.(e); }}
      >
        {children}
      </a>
    );
  }

  const { variant: _v, sound: _s, className: _c, children: _ch, onClick, type = 'button', ...rest } = props as ButtonProps;
  return (
    <button
      {...rest}
      type={type}
      className={classes}
      onClick={(e: MouseEvent<HTMLButtonElement>) => { if (sound) play(sound); onClick?.(e); }}
    >
      {children}
    </button>
  );
}
