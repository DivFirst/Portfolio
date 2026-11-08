import { forwardRef, type MouseEvent } from 'react';
import clsx from 'clsx';
import type { ProjectItem } from '../../types/portfolio';
import { Tag, accentClass } from '../arcade';
import { fileIcon, fileTypeLabel, projectKind } from './projectMeta';

/**
 * The front of a project card: what you see in the grid. The flip overlay shows a copy of it
 * (interactive = false) while the card turns over.
 */
export function ProjectCardFront({ project, onOpen }: { project: ProjectItem; onOpen?: () => void }) {
  const kind = projectKind(project);
  const files = project.files ?? [];
  const interactive = !!onOpen;
  return (
    <div className="pj-front">
      {project.cover && <img className="pj-cover" src={project.cover} alt="" loading="lazy" decoding="async" />}
      <div className="pj-front-head">
        <Tag accent={kind.accent}>{kind.label}</Tag>
        {project.year && <span className="pj-year">{project.year}</span>}
      </div>
      <h3 className="pj-title">{project.title}</h3>
      <p className="pj-tagline">{project.tagline}</p>
      <p className="pj-desc">{project.description}</p>
      {project.stats?.metric && <p className="pj-metric">{project.stats.metric}</p>}
      <ul className="pj-tags" aria-label="Skills">
        {project.tags.slice(0, 4).map((t) => <li key={t}>{t}</li>)}
      </ul>
      <div className="pj-front-foot">
        {files.length > 0 && (
          <ul className="pj-files" aria-label="Files">
            {files.map((f) => (
              <li key={f.url}>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pj-file-chip"
                  tabIndex={interactive ? undefined : -1}
                  title={f.label}
                >
                  <span aria-hidden="true">{fileIcon[f.type]}</span> {fileTypeLabel[f.type]}
                  <span className="sr-only">: {f.label} (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
        {interactive ? (
          <button type="button" className="pj-flip-btn arcade-display" aria-haspopup="dialog" aria-label={`Flip ${project.title} for details`} onClick={onOpen}>
            ▶ Flip
          </button>
        ) : (
          <span className="pj-flip-btn arcade-display" aria-hidden="true">▶ Flip</span>
        )}
      </div>
    </div>
  );
}

/** A card in the grid. A click anywhere on it (except a link or the button) flips it open too. */
export const ProjectCard = forwardRef<HTMLElement, { project: ProjectItem; away: boolean; onOpen: () => void }>(
  function ProjectCard({ project, away, onOpen }, ref) {
    const kind = projectKind(project);
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button')) return; // file chips open the file; the button handles itself
      if (window.getSelection()?.toString()) return; // selecting text, not clicking
      onOpen();
    };
    return (
      <article
        ref={ref}
        id={`project-${project.id}`}
        className={clsx('pj-card', accentClass[kind.accent], away && 'pj-card-away')}
        onClick={onClick}
        aria-label={project.title}
      >
        <ProjectCardFront project={project} onOpen={onOpen} />
      </article>
    );
  },
);
