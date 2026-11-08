import { useEffect, useRef, useState } from 'react';
import { ArcadeButton, ArcadeModal, Badge, BlinkingText, useArcade } from '../arcade';
import { achievementTrophies, caseCompetitionTrophies } from '../../data/trophies';
import { portfolioData } from '../../data/portfolioData';

const { profile } = portfolioData;
const emailUrl = profile.socials.find((s) => s.icon === 'Mail')?.url ?? 'mailto:divgarg03@gmail.com';
const linkedInUrl = profile.socials.find((s) => s.icon === 'Linkedin')?.url ?? 'https://www.linkedin.com/in/divgarg03/';
const emailAddress = emailUrl.replace(/^mailto:/, '');

/* ------------------------------------------------------------------ */
/* 1. TROPHY ROOM                                                       */
/* ------------------------------------------------------------------ */

export function TrophyRoom({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <ArcadeModal open={open} onClose={onClose} title="🏆 Trophy room" accent="yellow" wide openSound="levelUp">
      <h3 className="arcade-display mb-3 text-[10px] text-arcade-pink">Achievements · {achievementTrophies.length} unlocked</h3>
      <div className="arcade-trophy-grid">
        {achievementTrophies.map((t) => <Badge key={t.id} icon={t.icon} title={t.title} detail={t.detail} />)}
      </div>

      <h3 className="arcade-display mb-1 mt-7 text-[10px] text-arcade-pink">
        Case competitions · {caseCompetitionTrophies.length} finals reached
      </h3>
      <p className="mb-3 text-[14px] text-arcade-muted">Each badge shows the actual result.</p>
      <div className="arcade-trophy-grid">
        {caseCompetitionTrophies.map((t) => <Badge key={t.id} icon={t.icon} title={t.title} detail={t.detail} />)}
      </div>
    </ArcadeModal>
  );
}

/* ------------------------------------------------------------------ */
/* 2. CONTINUE? contact screen                                          */
/* ------------------------------------------------------------------ */

const COUNT_FROM = 10;

/**
 * Game-over style contact screen: "CONTINUE? 10 … 0" then "INSERT COIN TO CONTINUE".
 * The contact buttons are there from the first second (nobody has to wait for them).
 * Reduced motion: no countdown, the end screen shows straight away. No phone number.
 */
export function ContinueScreen({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { play, reducedMotion } = useArcade();
  const [count, setCount] = useState(COUNT_FROM);

  useEffect(() => {
    if (!open) return;
    if (reducedMotion) { setCount(0); return; }
    setCount(COUNT_FROM);
    const id = window.setInterval(() => {
      setCount((c) => {
        const next = Math.max(0, c - 1);
        if (next === 0) { window.clearInterval(id); }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [open, reducedMotion]);

  // a blip each second, a coin at zero (only when sound is on)
  useEffect(() => {
    if (!open || reducedMotion || count === COUNT_FROM) return;
    play(count === 0 ? 'coin' : 'tick');
  }, [count, open, reducedMotion, play]);

  const done = count === 0;

  return (
    <ArcadeModal open={open} onClose={onClose} title="Contact · Player 1" accent="pink">
      <div className="text-center">
        <p className="arcade-display arcade-glow arcade-accent-pink text-[18px] text-arcade-pink md:text-[28px]">Continue?</p>
        <div className="arcade-continue-count" aria-live="polite">
          {done ? (
            <BlinkingText className="arcade-display text-[12px] leading-relaxed text-arcade-yellow md:text-[16px]">
              Insert coin to continue
            </BlinkingText>
          ) : (
            <span className="arcade-score arcade-glow arcade-accent-yellow text-[96px] text-arcade-yellow md:text-[120px]" aria-label={`${count} seconds`}>
              {count}
            </span>
          )}
        </div>
        <p className="mx-auto mb-6 max-w-[34ch] text-[15px] leading-relaxed text-arcade-text">
          Want to keep playing? Let's talk about product roles, case studies or anything in between.
        </p>

        <div className="arcade-continue-buttons">
          <ArcadeButton variant="coin" href={emailUrl} sound="coin">✉ Email</ArcadeButton>
          <ArcadeButton variant="secondary" href={linkedInUrl} target="_blank" rel="noopener noreferrer">LinkedIn ▶</ArcadeButton>
          <ArcadeButton variant="primary" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">▶ Resume</ArcadeButton>
        </div>
        <p className="mt-3 text-[14px] text-arcade-muted">
          Or write to <a href={emailUrl} className="inline-flex min-h-[44px] items-center">{emailAddress}</a>
        </p>
      </div>
    </ArcadeModal>
  );
}

/* ------------------------------------------------------------------ */
/* 3. KONAMI CODE ↑↑↓↓←→←→ B A                                           */
/* ------------------------------------------------------------------ */

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

/** Calls onUnlock when the Konami code is typed (only while `enabled`). */
export function useKonamiCode(enabled: boolean, onUnlock: () => void) {
  const progress = useRef(0);
  const unlock = useRef(onUnlock);
  unlock.current = onUnlock;

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === KONAMI[progress.current]) {
        progress.current += 1;
        if (progress.current === KONAMI.length) { progress.current = 0; unlock.current(); }
      } else {
        progress.current = key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}

/** "Cheat code accepted!": confetti (skipped with reduced motion) + one of Divyanshu's fun facts. */
export function KonamiCelebration({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { play, reducedMotion } = useArcade();
  const facts = portfolioData.life.funFacts;
  const [fact, setFact] = useState(facts[0]);

  useEffect(() => {
    if (!open) return;
    setFact(facts[Math.floor(Math.random() * facts.length)]);
    play('stageClear');
    if (!reducedMotion) {
      const colors = ['#ff2e88', '#00f0ff', '#ffe600', '#39ff14', '#9d4dff'];
      // the confetti library is only downloaded the first time the cheat code is entered
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount: 90, spread: 75, origin: { x: 0.2, y: 0.7 }, colors, shapes: ['square'], zIndex: 120, disableForReducedMotion: true });
        confetti({ particleCount: 90, spread: 75, origin: { x: 0.8, y: 0.7 }, colors, shapes: ['square'], zIndex: 120, disableForReducedMotion: true });
      }).catch(() => { /* no confetti offline: the fun fact still shows */ });
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ArcadeModal open={open} onClose={onClose} title="Cheat code accepted!" accent="green" openSound={null}>
      <div className="text-center">
        <p className="arcade-display arcade-glow arcade-accent-green mb-1 text-[14px] text-arcade-green md:text-[18px]">+30 lives</p>
        <p className="mb-5 text-[14px] text-arcade-muted">↑ ↑ ↓ ↓ ← → ← → B A</p>
        <p className="arcade-display mb-2 text-[10px] text-arcade-yellow">Secret fun fact</p>
        <p className="mx-auto max-w-[40ch] text-[16px] leading-relaxed text-arcade-text">{fact}</p>
        <div className="mt-6">
          <ArcadeButton variant="success" onClick={onClose}>Continue ▶</ArcadeButton>
        </div>
      </div>
    </ArcadeModal>
  );
}
