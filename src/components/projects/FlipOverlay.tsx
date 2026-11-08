import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import type { ProjectItem } from '../../types/portfolio';
import { Tag, accentClass, useArcade } from '../arcade';
import { drivePreviewUrl, driveDownloadUrl, driveId } from '../../utils/drive';
import { ProjectCardFront } from './ProjectCard';
import { fileIcon, fileTypeLabel, projectKind } from './projectMeta';

const FLIP_MS = 560;
const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)';
const PERSPECTIVE = 'perspective(2200px)';

/**
 * The open card: it lifts out of the grid, turns over and grows into a big centred panel
 * (the back of the card, with the full story and the files). Closing plays it backwards
 * into the card's spot. With reduced motion it just appears / disappears.
 *
 * How the motion works: the panel sits at its final size and place; the animation starts it
 * squeezed onto the card's rectangle (translate + scale between the two centres) and turns it
 * 180° on the way. The front face is a copy of the card, laid out at the card's own size.
 */
export function FlipOverlay({ project, getOriginRect, onClosed }: {
  project: ProjectItem;
  /** where the card is in the grid right now (null if it can't be found) */
  getOriginRect: () => DOMRect | null;
  onClosed: () => void;
}) {
  const { play, reducedMotion } = useArcade();
  const flipRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const [settled, setSettled] = useState(false); // open animation finished
  const titleId = useId();

  const kind = projectKind(project);
  const files = project.files ?? [];
  const previewable = files.filter((f) => drivePreviewUrl(f.url));
  const [viewing, setViewing] = useState<string | null>(previewable[0]?.url ?? null);

  /** transform that squeezes the panel onto `from` (the card) */
  const squeezeOnto = (from: DOMRect, to: DOMRect) => {
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    return `${PERSPECTIVE} translate(${dx}px, ${dy}px) scale(${from.width / to.width}, ${from.height / to.height})`;
  };

  // Open: animate from the card to the centre
  useLayoutEffect(() => {
    const flip = flipRef.current, front = frontRef.current;
    if (!flip || !front) return;
    play('open');
    const origin = getOriginRect();
    if (reducedMotion || !origin || typeof flip.animate !== 'function') { setSettled(true); return; }
    const target = flip.getBoundingClientRect();
    // the front copy keeps the card's size, stretched to fill the panel (so it looks exact at the start)
    front.style.width = `${origin.width}px`;
    front.style.height = `${origin.height}px`;
    front.style.transform = `scale(${target.width / origin.width}, ${target.height / origin.height})`;
    const a = flip.animate(
      [
        { transform: `${squeezeOnto(origin, target)} rotateY(0deg)` },
        { transform: `${PERSPECTIVE} translate(0px, 0px) scale(1, 1) rotateY(180deg)` },
      ],
      { duration: FLIP_MS, easing: EASE },
    );
    backdropRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FLIP_MS * 0.6, easing: 'ease-out' });
    a.onfinish = () => setSettled(true);
    return () => a.cancel();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (settled) closeRef.current?.focus({ preventScroll: true }); }, [settled]);

  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    play('close');
    const flip = flipRef.current;
    const origin = getOriginRect();
    const onScreen = origin && origin.bottom > 0 && origin.top < window.innerHeight;
    if (reducedMotion || !flip || !origin || !onScreen || typeof flip.animate !== 'function') { onClosed(); return; }
    const target = flip.getBoundingClientRect();
    // getBoundingClientRect includes the current 3D turn; the panel is flat-on at rest, so it's the real size
    const a = flip.animate(
      [
        { transform: `${PERSPECTIVE} translate(0px, 0px) scale(1, 1) rotateY(180deg)` },
        { transform: `${squeezeOnto(origin, target)} rotateY(0deg)` },
      ],
      { duration: FLIP_MS * 0.85, easing: EASE, fill: 'forwards' },
    );
    backdropRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: FLIP_MS * 0.85, fill: 'forwards' });
    a.onfinish = onClosed;
  }, [getOriginRect, onClosed, play, reducedMotion]);

  // Esc closes; Tab stays inside the panel; the page behind doesn't scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab' || !flipRef.current) return;
      const items = [...flipRef.current.querySelectorAll<HTMLElement>('.pj-back a[href], .pj-back button:not([disabled]), .pj-back iframe')];
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey, true);
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey, true);
      html.style.overflow = before;
      document.body.style.overflow = '';
    };
  }, [close]);

  const info = project.moreInfo;
  const links = [
    project.liveUrl && { label: 'Open live project', url: project.liveUrl },
    project.githubUrl && { label: 'Code on GitHub', url: project.githubUrl },
    info?.link && info.link !== project.liveUrl && { label: 'Read more', url: info.link },
  ].filter((l): l is { label: string; url: string } => !!l);
  const viewingFile = files.find((f) => f.url === viewing);

  return (
    <div className="pj-overlay" onPointerDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div ref={backdropRef} className="pj-backdrop" aria-hidden="true" />
      <div
        ref={flipRef}
        className={clsx('pj-flip', accentClass[kind.accent], settled && 'is-settled')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="pj-face pj-face-front" aria-hidden="true">
          <div ref={frontRef} className="pj-front-copy pj-card">
            <ProjectCardFront project={project} />
          </div>
        </div>

        <div className="pj-face pj-face-back pj-back">
          <div className="arcade-panel-title pj-back-bar">
            <span id={titleId} className="pj-back-title">{project.title}</span>
            <button ref={closeRef} type="button" className="arcade-panel-close pj-close" aria-label="Close and flip back" onClick={close}>✕</button>
          </div>

          <div className="pj-back-body">
            <div className="pj-front-head">
              <Tag accent={kind.accent}>{kind.label}</Tag>
              {project.year && <span className="pj-year">{project.year}</span>}
              {project.role && <span className="pj-year">· {project.role}</span>}
            </div>
            <p className="pj-back-lead">{project.tagline}</p>
            {project.stats?.metric && <p className="pj-metric pj-metric-big">{project.stats.metric}</p>}

            <div className="pj-story">
              {info?.problem && (
                <section>
                  <h4 className="pj-h4 arcade-display">The challenge</h4>
                  <p>{info.problem}</p>
                </section>
              )}
              <section>
                <h4 className="pj-h4 arcade-display">What I did</h4>
                <p>{info?.action ?? project.description}</p>
              </section>
              {info?.result && (
                <section>
                  <h4 className="pj-h4 arcade-display">Result</h4>
                  <p>{info.result}</p>
                </section>
              )}
            </div>

            {info?.photo && <img className="pj-photo" src={info.photo} alt={`${project.title}`} loading="lazy" />}

            {files.length > 0 && (
              <section className="pj-files-section">
                <h4 className="pj-h4 arcade-display">Files</h4>
                <ul className="pj-file-list">
                  {files.map((f) => {
                    const canView = !!drivePreviewUrl(f.url);
                    const isDrive = !!driveId(f.url);
                    return (
                      <li key={f.url} className={clsx('pj-file-row', viewing === f.url && 'is-viewing')}>
                        <span className="pj-file-name">
                          <span aria-hidden="true">{fileIcon[f.type]}</span> {f.label}
                          <span className="pj-file-type"> · {fileTypeLabel[f.type]}</span>
                        </span>
                        <span className="pj-file-actions">
                          {canView && (
                            <button
                              type="button"
                              className="arcade-toggle"
                              aria-pressed={viewing === f.url}
                              onClick={() => { play('press'); setViewing(viewing === f.url ? null : f.url); }}
                            >
                              {viewing === f.url ? 'Hide' : 'View here'}
                            </button>
                          )}
                          <a href={f.url} className="arcade-toggle pj-toggle-link" target="_blank" rel="noopener noreferrer">
                            Open ↗<span className="sr-only"> {f.label} in a new tab</span>
                          </a>
                          {isDrive && (
                            <a href={driveDownloadUrl(f.url)} className="arcade-toggle pj-toggle-link" rel="noopener noreferrer">
                              ⬇<span className="sr-only"> Download {f.label}</span>
                            </a>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {/* The preview only loads once the card has finished opening (keeps the flip smooth) */}
                {viewingFile && settled && (
                  <div className="pj-viewer">
                    <iframe
                      key={viewingFile.url}
                      src={drivePreviewUrl(viewingFile.url)}
                      title={`${viewingFile.label} preview`}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  </div>
                )}
              </section>
            )}

            <section>
              <h4 className="pj-h4 arcade-display">Skills</h4>
              <ul className="pj-tags">
                {project.tags.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </section>

            {links.length > 0 && (
              <div className="pj-links">
                {links.map((l) => (
                  <a key={l.url} href={l.url} className="arcade-btn arcade-btn-secondary" target="_blank" rel="noopener noreferrer">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
