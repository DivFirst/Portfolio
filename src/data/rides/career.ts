// Ride script for one world (see common.ts for how rides work). Loaded only when that world opens.
import {
  type RideChapter, type RideHotspot, type Vec3, type WorldRide,
} from './common';
import { jobHotspot, jobScreen, professional, profile } from './jobHelpers';
export * from './common';

// ---------- WORLD 2: CAREER MODE ----------
// The glass tower's 5 window rows are its floors (island space, front face z ≈ -0.34):
//   y 0.6 lobby · 1.2 ICICI Bank · 1.8 XLRI (study) · 2.4 Centrum Broking · 3.0 Kotak Private penthouse
// Roof pad at y ≈ 3.7. ProfessionalIsland.tsx reads CAREER_FLOORS to light rows and move the elevator.

const TOWER: Vec3 = [-1.2, 0, -0.34];
export const CAREER_FLOORS = { lobby: 0.6, icici: 1.2, xlri: 1.8, centrum: 2.4, kotak: 3.0, roof: 3.75 } as const;
const floorCam = (y: number): { position: Vec3; target: Vec3 } => ({
  // front-left of the tower, so the server rack in front of it never blocks the view
  position: [TOWER[0] - 0.9, y + 0.9, TOWER[2] + 5.1],
  target: [TOWER[0] + 0.5, y, TOWER[2]],
});
/** Pin a "?" to a window on a floor: side -1 = left column, 1 = right column */
const windowPin = (y: number, side: -1 | 0 | 1 = 0): Vec3 => [TOWER[0] + side * 0.4, y + 0.05, TOWER[2] + 0.02];

const xlri = professional.education.find((e) => e.institution.startsWith('XLRI'));
const groups = professional.coreCompetencies.map((c) => ({ title: c.category, items: c.skills }));

const careerChapters: (RideChapter & { elevator: number })[] = [
  {
    id: 'lobby',
    label: 'Lobby · Career summary',
    elevator: CAREER_FLOORS.lobby,
    camera: { position: [3.3, 1.75, 3.9], target: [0.1, 1.0, -0.2] },
    screen: { heading: 'Career Mode', sub: `${professional.yearsOfExperience} · ${profile.title.split(' | ')[0]}` },
    hotspots: [{
      id: 'career-summary',
      label: 'Open: career summary',
      anchor: [0.9, 1.4, 0.3], // the two desk monitors
      content: { title: 'Career summary', lines: [professional.headline, professional.summary] },
    }],
  },
  {
    id: 'icici-a',
    label: 'Floor 1 · ICICI Bank',
    elevator: CAREER_FLOORS.icici,
    camera: floorCam(CAREER_FLOORS.icici),
    screen: jobScreen('ICICI Bank', [
      { label: 'User interactions', value: 40, prefix: '+', suffix: '%' },
      { label: 'CTR', value: 5, prefix: '+', suffix: '%' },
    ], 0),
    hotspots: [jobHotspot('ICICI Bank', 0, 'K-means personalisation', { id: 'icici-kmeans', anchor: windowPin(CAREER_FLOORS.icici) })],
  },
  {
    id: 'icici-b',
    label: 'Floor 1 · ICICI Bank',
    elevator: CAREER_FLOORS.icici,
    camera: floorCam(CAREER_FLOORS.icici + 0.05),
    screen: jobScreen('ICICI Bank', [
      { label: 'Engagement', value: 30, prefix: '+', suffix: '%' },
      { label: 'Bounce rate', value: 12, prefix: '−', suffix: '%' },
      { label: 'Retention', value: 10, prefix: '+', suffix: '%' },
      { label: 'Page views', value: 15, prefix: '+', suffix: '%' },
    ], 1, 2),
    hotspots: [
      jobHotspot('ICICI Bank', 1, 'Competitor study & page redesign', { id: 'icici-ia', anchor: windowPin(CAREER_FLOORS.icici, -1) }),
      jobHotspot('ICICI Bank', 2, 'Campaigns (IPL, Holi, Diwali, New Year)', { id: 'icici-campaigns', anchor: windowPin(CAREER_FLOORS.icici, 1) }),
    ],
  },
  {
    id: 'xlri',
    label: 'Floor 2 · XLRI Delhi-NCR',
    elevator: CAREER_FLOORS.xlri,
    camera: floorCam(CAREER_FLOORS.xlri),
    screen: { heading: xlri?.institution ?? 'XLRI', sub: xlri ? `${xlri.degree} · ${xlri.year}` : undefined },
    hotspots: [],
  },
  {
    id: 'centrum',
    label: 'Floor 3 · Centrum Broking',
    elevator: CAREER_FLOORS.centrum,
    camera: floorCam(CAREER_FLOORS.centrum),
    screen: jobScreen('Centrum Broking', [
      { label: 'Initiatives approved', value: 10, suffix: '+' },
      { label: 'Opportunity sized', value: 5, prefix: 'USD ', suffix: 'M' },
    ], 0, 1),
    hotspots: [
      jobHotspot('Centrum Broking', 0, 'GenAI roadmap', { id: 'centrum-genai', anchor: windowPin(CAREER_FLOORS.centrum, -1) }),
      jobHotspot('Centrum Broking', 1, 'Kite MCP evaluation', { id: 'centrum-mcp', anchor: windowPin(CAREER_FLOORS.centrum, 1) }),
    ],
  },
  {
    id: 'kotak-a',
    label: 'Penthouse · Kotak Private',
    elevator: CAREER_FLOORS.kotak,
    camera: floorCam(CAREER_FLOORS.kotak),
    screen: jobScreen('Kotak Private', [
      { label: 'Turnaround', value: 95, prefix: '−', suffix: '%', note: '2 hrs → 5 mins' },
      { label: 'Accuracy', value: 99.4, decimals: 1, suffix: '%' },
      { label: 'Provider formats', value: 21 },
    ], 0),
    hotspots: [jobHotspot('Kotak Private', 0, 'Extraction engine', { id: 'kotak-extraction', anchor: windowPin(CAREER_FLOORS.kotak) })],
  },
  {
    id: 'kotak-b',
    label: 'Penthouse · Kotak Private',
    elevator: CAREER_FLOORS.kotak,
    camera: floorCam(CAREER_FLOORS.kotak + 0.05),
    screen: jobScreen('Kotak Private', [
      { label: 'Features delivered', value: 37 },
      { label: 'Sprint velocity', value: 26, prefix: '+', suffix: '%' },
      { label: 'Test cases', value: 700, suffix: '+' },
      { label: 'Defects fixed', value: 100, suffix: '+' },
    ], 1, 2),
    hotspots: [
      jobHotspot('Kotak Private', 1, 'Dubai (DIFC) customisations', { id: 'kotak-difc', anchor: windowPin(CAREER_FLOORS.kotak, -1) }),
      jobHotspot('Kotak Private', 2, 'QA framework', { id: 'kotak-qa', anchor: windowPin(CAREER_FLOORS.kotak, 1) }),
    ],
  },
  {
    id: 'kotak-c',
    label: 'Penthouse · Kotak Private',
    elevator: CAREER_FLOORS.kotak,
    camera: floorCam(CAREER_FLOORS.kotak + 0.1),
    screen: jobScreen('Kotak Private', [
      { label: 'Regression time', value: 78, prefix: '−', suffix: '%', note: '8 hrs → 1 hr' },
      { label: 'Playwright scripts', value: 36 },
    ], 3),
    hotspots: [jobHotspot('Kotak Private', 3, 'Playwright scripts', { id: 'kotak-playwright', anchor: windowPin(CAREER_FLOORS.kotak) })],
  },
  ...[[0, 1], [2, 3], [4]].map((g, i) => ({
    id: `roof-${i + 1}`,
    label: 'Roof · Player stats',
    elevator: CAREER_FLOORS.roof,
    camera: { position: [TOWER[0] - 1.6, 5.7 + i * 0.1, TOWER[2] + 3.9] as Vec3, target: [TOWER[0] + 0.4, 3.9, TOWER[2] - 0.6] as Vec3 },
    screen: { heading: 'Player stats', sub: `Skills unlocked · ${i + 1}/3`, groups: g.map((k) => groups[k]) },
    hotspots: [] as RideHotspot[],
  })),
  {
    id: 'clear',
    label: 'Roof · Stage clear',
    elevator: CAREER_FLOORS.roof,
    camera: { position: [TOWER[0] - 3.4, 5.4, TOWER[2] + 10.2], target: [TOWER[0] + 1.2, 2.9, TOWER[2] - 0.3] },
    hotspots: [],
  },
];

// Resume "?" sits on the roof from the last stats page to the end.
careerChapters[careerChapters.length - 2].hotspots.push({
  id: 'career-resume',
  label: 'Open: resume',
  anchor: [TOWER[0], CAREER_FLOORS.roof + 0.15, TOWER[2] - 0.66],
  show: [(careerChapters.length - 2.5) / (careerChapters.length - 1), 1],
  content: { title: 'Resume', lines: [profile.title], link: { href: profile.resumeUrl, label: 'Full resume ▶' } },
});

/** Elevator height per chapter, same order as the ride's chapters */
export const careerElevator = careerChapters.map((c) => c.elevator);


// WORLD 2: CAREER MODE: an elevator ride up the tower, one floor per step of the career
// (ICICI → XLRI → Centrum → Kotak penthouse), then PLAYER STATS on the roof.
export const ride: WorldRide = {
  islandId: 'professional',
  slug: 'career',
  pages: 10,
  portrait: { pull: 1.25, shift: [-0.45, -0.55, 0] },
  chapters: careerChapters.map(({ elevator: _e, ...c }) => c),
};
