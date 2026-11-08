import { useCallback, useEffect, useRef, useState } from 'react';
import { portfolioData } from '../data/portfolioData';
import { ArcadeProvider, SoundToggle } from '../components/arcade';
import { ProjectCard } from '../components/projects/ProjectCard';
import { FlipOverlay } from '../components/projects/FlipOverlay';

/**
 * PROJECTS (/projects): hand-picked projects as cards in rows. Clicking a card flips it over
 * into a big panel with the full story and its files (decks, reports: Google Drive links).
 * Reached from the game's top bar (?from=game) and from Recruiter Mode's tabs (?from=cv).
 * Pick projects with `showOnProjectsPage: true` (and `order`) in portfolioData.ts.
 * /projects#<id> opens that project's card straight away.
 */

const picked = portfolioData.projects.projects
  .filter((p) => p.showOnProjectsPage)
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

const from = new URLSearchParams(window.location.search).get('from');

export function ProjectsPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const cardRefs = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    document.title = 'Projects · Divyanshu Garg Journey';
    document.body.classList.remove('overflow-hidden', 'select-none');
    document.body.classList.add('arcade-page');
  }, []);

  const open = useCallback((id: string) => {
    setOpenId(id);
    history.replaceState(history.state, '', `${window.location.pathname}${window.location.search}#${id}`);
  }, []);

  const returnFocusTo = useRef<string | null>(null);
  const closed = useCallback(() => {
    returnFocusTo.current = openId;
    setOpenId(null);
    history.replaceState(history.state, '', window.location.pathname + window.location.search);
  }, [openId]);

  // After closing, keyboard focus goes back to that card's Flip button (once the card is visible again)
  useEffect(() => {
    if (openId || !returnFocusTo.current) return;
    cardRefs.current.get(returnFocusTo.current)?.querySelector<HTMLElement>('.pj-flip-btn')?.focus({ preventScroll: true });
    returnFocusTo.current = null;
  }, [openId]);

  // Opened on a link to one project (/projects#adpilot): scroll to its card, then flip it
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const el = id && cardRefs.current.get(id);
    if (!el) return;
    el.scrollIntoView({ block: 'center' });
    const t = window.setTimeout(() => setOpenId(id), 250);
    return () => window.clearTimeout(t);
  }, []);

  const getOriginRect = useCallback(
    () => (openId ? cardRefs.current.get(openId)?.getBoundingClientRect() ?? null : null),
    [openId],
  );

  const openProject = picked.find((p) => p.id === openId);

  return (
    <ArcadeProvider className="cv-page pj-page">
      <a href="#pj-main" className="cv-skip">Skip to projects</a>

      <header className="cv-topbar cv-no-print">
        <nav className="pj-tabs" aria-label="Pages">
          <a href="/cv" className="pj-tab">📄 CV</a>
          <a href="/projects" className="pj-tab is-active" aria-current="page">🚀 Projects</a>
        </nav>
        <div className="pj-topbar-right">
          <SoundToggle />
          <a href="/?play" className="arcade-btn arcade-btn-ghost cv-play" aria-label={from === 'game' ? 'Back to the arcade game' : 'Play my portfolio as an arcade game'}>
            {from === 'game' ? <>◀ <span className="hidden min-[400px]:inline">Back to</span> game</> : <>🕹️ <span className="hidden min-[400px]:inline">Play the</span> game ▶</>}
          </a>
        </div>
      </header>

      <main id="pj-main" className="pj-wrap">
        <p className="arcade-display text-[10px] text-arcade-pink">Select your stage</p>
        <h1 className="cv-h1 arcade-display">Projects</h1>
        <p className="cv-body">{portfolioData.projects.summary} Click a card to flip it for the full story and files.</p>

        {picked.length === 0 ? (
          <p className="cv-notice" role="status">No projects picked yet. Set <code>showOnProjectsPage: true</code> on a project in portfolioData.ts.</p>
        ) : (
          <ul className="pj-grid">
            {picked.map((p) => (
              <li key={p.id}>
                <ProjectCard
                  ref={(el) => { if (el) cardRefs.current.set(p.id, el); else cardRefs.current.delete(p.id); }}
                  project={p}
                  away={p.id === openId}
                  onOpen={() => open(p.id)}
                />
              </li>
            ))}
          </ul>
        )}

        <footer className="cv-footer cv-no-print">
          <a href="/cv">📄 Want it all on one page? See my CV (Recruiter Mode) ▶</a>
        </footer>
      </main>

      {openProject && (
        <FlipOverlay key={openProject.id} project={openProject} getOriginRect={getOriginRect} onClosed={closed} />
      )}
    </ArcadeProvider>
  );
}
