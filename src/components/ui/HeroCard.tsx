import React, { useEffect, useRef, useState } from 'react';
import { ArcadeButton, PixelPanel, useArcade } from '../arcade';
import { portfolioData } from '../../data/portfolioData';

interface HeroCardProps {
  isIslandFocused: boolean;
}

const PHONE_QUERY = '(max-width: 759px)';
const isPhone = () => typeof window !== 'undefined' && window.matchMedia(PHONE_QUERY).matches;

/**
 * "PLAYER 1" card (DESIGN.md §4): photo in a pixel frame, name, headline, short bio,
 * Resume / Email buttons and links. Starts collapsed on phones so the world is visible;
 * collapses itself while an island is open.
 */
export const HeroCard: React.FC<HeroCardProps> = ({ isIslandFocused }) => {
  const { profile } = portfolioData;
  const { play } = useArcade();
  const [open, setOpen] = useState(() => !isPhone());
  const [imageError, setImageError] = useState(false);
  const tabRef = useRef<HTMLButtonElement>(null);
  const firstRender = useRef(true);
  const focusTabNext = useRef(false);

  // After the visitor hides the card, keep keyboard focus on the "P1" tab.
  useEffect(() => {
    if (!open && focusTabNext.current) { focusTabNext.current = false; tabRef.current?.focus(); }
  }, [open]);

  // Island opened → tuck the card away. Back to the map → bring it back (desktop only).
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    if (isIslandFocused) setOpen(false);
    else if (!isPhone()) setOpen(true);
  }, [isIslandFocused]);

  const email = profile.socials.find((s) => s.icon === 'Mail')?.url ?? 'mailto:divgarg03@gmail.com';
  const otherLinks = profile.socials.filter((s) => s.icon !== 'Mail');

  const photo = (size: string) =>
    !imageError ? (
      <img
        src={profile.avatarUrl}
        alt=""
        onError={() => setImageError(true)}
        className={`${size} object-cover bg-arcade-panel-2`}
      />
    ) : (
      <span className={`${size} grid place-items-center bg-arcade-panel-2 font-pixel text-[10px] text-arcade-text`}>DG</span>
    );

  if (!open) {
    return (
      <button
        ref={tabRef}
        type="button"
        className="arcade-p1-tab"
        aria-label="Show Player 1 card"
        aria-expanded={false}
        onClick={() => { play('open'); setOpen(true); }}
      >
        <span className="arcade-p1-frame arcade-accent-cyan">{photo('w-8 h-8')}</span>
        <span className="arcade-display text-[9px] text-arcade-cyan">P1 ▶</span>
      </button>
    );
  }

  return (
    <aside className="arcade-p1-card" aria-label="Player 1: about Divyanshu">
      <PixelPanel
        title="Player 1"
        accent="cyan"
        onClose={() => { play('close'); focusTabNext.current = true; setOpen(false); }}
        closeLabel="Hide Player 1 card"
        closeSymbol="◀"
        bodyClassName="arcade-p1-body"
      >
        <div className="flex items-start gap-4">
          <span className="arcade-p1-frame arcade-accent-cyan shrink-0">{photo('w-16 h-16 md:w-20 md:h-20')}</span>
          <div className="min-w-0">
            <h2 className="arcade-display text-[12px] leading-relaxed text-arcade-text md:text-[13px]">{profile.name}</h2>
            <p className="mt-1 text-[14px] leading-snug text-arcade-cyan">{profile.title}</p>
            <p className="mt-1 text-[14px] leading-snug text-arcade-muted">📍 {profile.location}</p>
          </div>
        </div>

        <p className="mt-4 text-[14px] leading-snug text-arcade-text">
          <span className="text-arcade-cyan" aria-hidden="true">● </span>Available for high-impact roles
        </p>

        <p className="mt-3 text-[15px] leading-[1.6] text-arcade-text">{profile.bio || profile.tagline}</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <ArcadeButton variant="coin" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" sound="coin">
            Resume ▶
          </ArcadeButton>
          <ArcadeButton variant="ghost" href={email}>Email</ArcadeButton>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
          {otherLinks.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
          ))}
          <a href="/?intro" className="ml-auto">◀ Change mode</a>
        </div>
      </PixelPanel>
    </aside>
  );
};
