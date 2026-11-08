// Ride script for one world (see common.ts for how rides work). Loaded only when that world opens.
import { portfolioData } from '../portfolioData';
import {
  type RideChapter, type RideHotspot, type Vec3, type WorldRide, story, BOSS_ROCKET,
} from './common';
export * from './common';

// ---------- WORLD 3: BOSS BATTLES ----------
// The rocket on the launchpad (ProjectsIsland.tsx, pad at island [-1.1, 0, -0.7]) counts down,
// lifts off and climbs through 6 sky layers. Every project in portfolioData is a "boss" floating
// beside the rocket's path: its HP drains as the rocket arrives, then it shows DEFEATED + LOOT
// (the project's own stats.metric) or CLEARED when the data has no result.
// BossBattleRide.tsx reads BOSS_* and bossAltitude below.

const projectList = portfolioData.projects.projects;
function project(id: string) {
  const p = projectList.find((x) => x.id === id);
  if (!p) throw new Error(`worldRides: no project "${id}" in portfolioData`);
  return p;
}

const ROCKET_MID = BOSS_ROCKET.padTop + 1.2;

export interface BossInfo {
  id: string;
  /** label above the boss, e.g. "Flipkart GRID 2.0" */
  short: string;
  /** LOOT banner lines from stats.metric; null = no result on file → CLEARED */
  loot: string[] | null;
  /** chapter where the rocket reaches this boss */
  chapter: number;
  position: Vec3;
  radius: number;
  color: string;
  ring: boolean;
}

interface BossLayer {
  id: string;
  label: string;
  heading: string;
  sub: string;
  /** rocket climb above the pad at this chapter */
  alt: number;
  bosses: string[];
}

const BOSS_LAYERS: BossLayer[] = [
  { id: 'low-sky', label: 'Low sky · IIT Ropar engineering', heading: 'Low sky', sub: 'IIT Ropar · engineering bosses', alt: 7, bosses: ['hy-contest', 'flipkart-grid', 'ubreathe-life'] },
  { id: 'clouds-1', label: 'Cloud layer · IIT Ropar workshop', heading: 'Cloud layer', sub: 'IIT Ropar · workshop bosses (1/2)', alt: 14, bosses: ['cadathon', 'robowars'] },
  { id: 'clouds-2', label: 'Cloud layer · IIT Ropar workshop', heading: 'Cloud layer', sub: 'IIT Ropar · workshop bosses (2/2)', alt: 21, bosses: ['micro-pin-fin', 'vehicle-body'] },
  { id: 'high-1', label: 'High sky · Case competitions', heading: 'High sky', sub: 'Case competitions (1/2)', alt: 28, bosses: ['airtel-icreate', 'dataviz-iimb'] },
  { id: 'high-2', label: 'High sky · Case competitions', heading: 'High sky', sub: 'Case competitions (2/2)', alt: 35, bosses: ['pwc-challenge', 'thoucentric-bottoms-up'] },
  { id: 'edge-1', label: 'Edge of space · Case competitions', heading: 'Edge of space', sub: 'Case competitions (1/2)', alt: 42, bosses: ['salaryse', 'asian-paints-canvas'] },
  { id: 'edge-2', label: 'Edge of space · Case competitions', heading: 'Edge of space', sub: 'Case competitions (2/2)', alt: 49, bosses: ['sun-pharma-prism', 'itc-interrobang'] },
  { id: 'belt', label: 'Asteroid belt · Case competitions', heading: 'Asteroid belt', sub: 'Case competitions', alt: 56, bosses: ['bajaj-atom', 'flipkart-quick-commerce', 'reckitt-veet'] },
  { id: 'approach', label: 'Orbit approach · Product & live projects', heading: 'Orbit approach', sub: 'Product & live projects: the big bosses', alt: 63, bosses: ['adpilot', 'swasthiq', 'vivnovation'] },
];
const ORBIT_ALT = 70;

// Every project must be a boss exactly once (a new project in the data file needs a slot here).
{
  const used = BOSS_LAYERS.flatMap((l) => l.bosses);
  const missing = projectList.filter((p) => !used.includes(p.id)).map((p) => p.id);
  const twice = used.filter((id, i) => used.indexOf(id) !== i);
  if (missing.length || twice.length) throw new Error(`worldRides: Boss Battles slots out of date. Missing: ${missing.join(', ') || '-'} · twice: ${twice.join(', ') || '-'}`);
}

/** Where bosses float around the rocket's centre (x = screen right, y = up), 2 or 3 per layer */
const SLOTS: Record<number, Vec3[]> = {
  2: [[-2.2, -0.7, 0.2], [2.2, 0.7, -0.2]],
  // third boss top-right: top-left is under the HUD's progress panel
  3: [[-2.2, -0.6, 0.2], [2.2, -1.5, -0.2], [2.0, 1.6, -0.5]],
};
const BOSS_COLORS = ['#ff2e88', '#9d4dff', '#00c2d1', '#ff8a3d', '#e0c400', '#c03cff'];
const LAYER_CHAPTER0 = 2; // chapters 0–1 are the pad and the countdown

const shortName = (title: string) => title.split(':')[0].trim();
const lootLines = (metric?: string) => (metric ? metric.split(' · ') : null);

export const BOSSES: BossInfo[] = BOSS_LAYERS.flatMap((layer, li) =>
  layer.bosses.map((id, k) => {
    const p = project(id);
    const [sx, sy, sz] = SLOTS[layer.bosses.length][k];
    const big = layer.id === 'approach';
    return {
      id,
      short: shortName(p.title),
      loot: lootLines(p.stats?.metric),
      chapter: LAYER_CHAPTER0 + li,
      position: [BOSS_ROCKET.x + sx, BOSS_ROCKET.padTop + layer.alt + 1.2 + sy, BOSS_ROCKET.z + sz] as Vec3,
      radius: big ? 0.66 : 0.58,
      color: BOSS_COLORS[(li * 2 + k) % BOSS_COLORS.length],
      ring: big || k === 1,
    };
  }),
);

const bossHotspot = (b: BossInfo): RideHotspot => {
  const p = project(b.id);
  const link = p.liveUrl ? { href: p.liveUrl, label: 'Try the prototype ▶' } : undefined;
  return {
    id: `boss-${b.id}`,
    label: `Open: ${p.title}`,
    anchor: b.position,
    // only while the boss is well inside the shot (not while it's still under the HUD or leaving)
    show: [Math.max(0, (b.chapter - 0.35) / (bossAltitude.length - 1)), (b.chapter + 0.45) / (bossAltitude.length - 1)],
    content: { title: p.title, lines: story(p.moreInfo), ...(link ? { link } : {}) },
  };
};

/** Side camera that follows the rocket. Desktop: rocket left of centre (panel sits on the right). */
const flightCam = (alt: number) => {
  const c = ROCKET_MID + alt;
  const t: Vec3 = [BOSS_ROCKET.x + 1.3, c + 0.5, BOSS_ROCKET.z]; // a little high: the HUD covers the top of the screen
  const tp: Vec3 = [BOSS_ROCKET.x, c + 0.1, BOSS_ROCKET.z];
  return {
    camera: { position: [t[0] + 3.0, t[1] + 2.8, t[2] + 11.8] as Vec3, target: t },
    // phones: further back so both side bosses fit between the HUD (top) and the floor panel (bottom)
    cameraPortrait: { position: [tp[0] + 6.0, tp[1] + 5.75, tp[2] + 23.0] as Vec3, target: tp },
  };
};

const bossCount = BOSSES.length;
/** Rocket climb (above the pad) per chapter, same order as the ride's chapters */
export const bossAltitude: number[] = [0, 0, ...BOSS_LAYERS.map((l) => l.alt), ORBIT_ALT];

const bossChapters: RideChapter[] = [
  {
    id: 'pad',
    label: 'Launchpad · Mission brief',
    // from the left-front: the terminal and dish never stand between the visitor and the rocket
    camera: { position: [-6.6, 4.7, 7.3], target: [0, 1.5, 0.3] },
    cameraPortrait: { position: [-13.4, 13.6, 16.7], target: [-0.6, 1.6, -0.3] },
    screen: { heading: 'Boss Battles', sub: portfolioData.projects.summary },
    hotspots: [{
      id: 'boss-brief',
      label: 'Open: mission brief',
      anchor: [1.1, 2.15, 0.6], // above the floating crystal
      content: { title: 'Mission brief', lines: [portfolioData.projects.summary, `${bossCount} bosses ahead, in ${new Set(BOSS_LAYERS.map((l) => l.heading)).size} sky layers.`] },
    }],
  },
  {
    id: 'countdown',
    label: 'Countdown · 3 · 2 · 1',
    camera: { position: [-3.4, 2.7, 5.2], target: [0.2, 2.0, -0.4] },
    cameraPortrait: { position: [-12.9, 9.7, 16.2], target: [-0.8, 2.0, -0.5] },
    screen: { heading: 'Countdown', sub: `${bossCount} bosses ahead · ${new Set(BOSS_LAYERS.map((l) => l.heading)).size} sky layers` },
    hotspots: [],
  },
  ...BOSS_LAYERS.map((layer, li): RideChapter => {
    const bosses = BOSSES.filter((b) => b.chapter === LAYER_CHAPTER0 + li);
    return {
      id: layer.id,
      label: layer.label,
      ...flightCam(layer.alt),
      screen: {
        heading: layer.heading,
        sub: layer.sub,
        groups: [{ title: 'Loot', items: bosses.map((b) => `${b.short}: ${b.loot ? b.loot.join(' · ') : 'cleared'}`) }],
      },
      hotspots: bosses.map(bossHotspot),
    };
  }),
  {
    id: 'orbit',
    label: 'Orbit · Stage clear',
    // pull right back: the whole route, every defeated boss, and the dish beaming up to the rocket.
    // Desktop: the column sits right of centre, clear of the progress panel (top left) and STAGE CLEAR (bottom centre).
    camera: { position: [33.5, 70.5, 131.6], target: [-26.7, 44, 13.5] },
    cameraPortrait: { position: [78, 69.3, 153], target: [0, 35, 0] },
    hotspots: [],
  },
];

export const BOSS_ORBIT = { alt: ORBIT_ALT, dish: [-0.3, 1.15, 1.5] as Vec3 };


// WORLD 3: BOSS BATTLES: countdown and launch; scroll = altitude; one boss per project,
// DEFEATED + LOOT as the rocket passes; ends in orbit with the dish beaming "MORE COMING".
export const ride: WorldRide = {
  islandId: 'projects',
  slug: 'bosses',
  pages: 12,
  chapters: bossChapters,
};
