import type { ProjectFile, ProjectItem } from '../../types/portfolio';
import type { Accent } from '../arcade';

type Kind = NonNullable<ProjectItem['kind']>;

/** Label + accent colour for each kind of project (DESIGN.md §2: max 2 neons per card). */
export const kindMeta: Record<Kind, { label: string; accent: Accent }> = {
  'case-competition': { label: 'Case competition', accent: 'pink' },
  'engineering-competition': { label: 'Engineering contest', accent: 'cyan' },
  'engineering-project': { label: 'Engineering project', accent: 'cyan' },
  internship: { label: 'Internship', accent: 'green' },
  'case-study': { label: 'Case study', accent: 'purple' },
  'live-project': { label: 'Live project', accent: 'green' },
  'product-build': { label: 'Product build', accent: 'purple' },
};

export const projectKind = (p: ProjectItem) => (p.kind ? kindMeta[p.kind] : { label: 'Project', accent: 'cyan' as Accent });

export const fileIcon: Record<ProjectFile['type'], string> = {
  ppt: '📊',
  pdf: '📄',
  doc: '📝',
  sheet: '📈',
  video: '🎬',
  link: '🔗',
};

export const fileTypeLabel: Record<ProjectFile['type'], string> = {
  ppt: 'Slides',
  pdf: 'PDF',
  doc: 'Doc',
  sheet: 'Sheet',
  video: 'Video',
  link: 'Link',
};
