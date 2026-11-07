import { portfolioData } from './portfolioData';

/**
 * Trophy Room badges (BUILD_GUIDE Part 2, step 4).
 * TRUTH RULE: every value below appears in portfolioData.ts (life chapters + projects),
 * which comes from the resume. Case competitions are read straight from the data file.
 */
export interface Trophy {
  id: string;
  icon: string;
  title: string;
  detail: string;
}

export const achievementTrophies: Trophy[] = [
  { id: 'jee', icon: '🎯', title: 'JEE Advanced', detail: 'AIR 5,515 · top 2.4% of 2.31L+ candidates' },
  { id: 'cat', icon: '🏆', title: 'CAT', detail: '99.60 %ile · rank 1,152 of 2.88L+' },
  { id: 'xat', icon: '🧠', title: 'XAT Decision Making', detail: '99.92 %ile' },
  { id: 'icse', icon: '📜', title: 'ICSE Class X', detail: 'All-India rank 33 of 1.68L+ candidates' },
  { id: 'cswp', icon: '⚙️', title: 'CSWP', detail: 'Certified SolidWorks Professional' },
  { id: 'patent', icon: '🌿', title: 'uBreathe Life', detail: 'Patent pending · +60% purification efficiency' },
];

/**
 * Case competitions where Divyanshu reached the finals or better. The badge shows the
 * real result from the data file (e.g. "Finalist", "National 2nd Prize"), never "winner"
 * unless the data says so. Earlier-round results are left out of the trophy wall.
 */
const FINALS_OR_BETTER = /finalist|prize|winner|won|1st|2nd|3rd/i;
const NOT_FINALS = /quarter|semi|round|shortlist/i;

const medal = (result: string) =>
  /1st|winner|won/i.test(result) ? '🥇' : /2nd/i.test(result) ? '🥈' : /3rd/i.test(result) ? '🥉' : '🎖️';

export const caseCompetitionTrophies: Trophy[] = portfolioData.projects.projects.flatMap((p) => {
  const result = p.stats?.metric ?? '';
  if (p.kind !== 'case-competition' || !FINALS_OR_BETTER.test(result) || NOT_FINALS.test(result)) return [];
  return [{ id: p.id, icon: medal(result), title: p.title, detail: result }];
});
