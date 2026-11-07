import type { IslandId } from '../types/portfolio';
import { portfolioData } from './portfolioData';

/**
 * Scroll rides, one per world (BUILD_GUIDE Part 2, "ENTERING A WORLD").
 *
 * Every ride is an ordered list of CHAPTERS. Scrolling moves through them from 0% to 100%:
 * the camera glides from one chapter's camera to the next, and each chapter's
 * hotspots ("?" blocks) show while that chapter is on screen.
 *
 * Positions are in island space: [0, 0, 0] is the centre of the island's top surface,
 * +Y is up. (The skyscraper on World 2 stands at about [-1.2, 0, -1.0], 3.6 tall.)
 *
 * TRUTH RULE: hotspot text is pulled from portfolioData.ts, never typed in here.
 */

export type Vec3 = [number, number, number];

export interface HotspotContent {
  title: string;
  /** 2–3 short lines */
  lines: string[];
  image?: { src: string; alt: string };
  link?: { href: string; label: string };
}

export interface RideHotspot {
  id: string;
  /** Screen-reader label for the "?" button */
  label: string;
  /** Pin to a point in island space ... */
  anchor?: Vec3;
  /** ... or to a fixed spot on screen (0–1 of width/height) */
  screen?: { x: number; y: number };
  /** Part of the scroll (0–1) where it shows. Default: its chapter's part. */
  show?: [number, number];
  content: HotspotContent;
}

/** One number on a ride screen. Counts up as its chapter arrives, back down when scrolling up. */
export interface RideMetric {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Small line under the number, e.g. "2 hrs → 5 mins" */
  note?: string;
  /** Write thousands with commas, e.g. 5,515 */
  grouped?: boolean;
}

/** How a ride number is written on screen (also used by the truth check). */
export function formatNumber(m: RideMetric, v: number) {
  const d = m.decimals ?? 0;
  return m.grouped
    ? v.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d })
    : v.toFixed(d);
}
export const formatMetric = (m: RideMetric, v: number) => `${m.prefix ?? ''}${formatNumber(m, v)}${m.suffix ?? ''}`;

/**
 * Where the ride is between two chapter keyframes: chapter a → b, t = 0…1.
 * Same maths as the camera, so 3D animations always match it. Reduced motion: a hard cut halfway.
 */
export function chapterBlend(p: number, n: number, reduced: boolean) {
  if (n <= 1) return { a: 0, b: 0, t: 0 };
  const x = Math.min(1, Math.max(0, p)) * (n - 1);
  const a = Math.min(n - 2, Math.floor(x));
  const f = x - a;
  return { a, b: a + 1, t: reduced ? (f < 0.5 ? 0 : 1) : f * f * (3 - 2 * f) };
}

/**
 * A solid pixel panel shown beside the 3D scene while its chapter is on screen
 * (text never sits directly on the 3D scene: DESIGN.md §8).
 */
export interface RideScreen {
  heading: string;
  /** e.g. role · dates · city */
  sub?: string;
  metrics?: RideMetric[];
  /** Skill groups shown as "unlocked" chips (Career Mode roof) */
  groups?: { title: string; items: string[] }[];
}

export interface RideChapter {
  id: string;
  /** Shown in the world HUD, e.g. "Floor 1 · ICICI Bank" */
  label: string;
  camera: { position: Vec3; target: Vec3 };
  /** Optional camera for tall phone screens (used only when every chapter of the ride has one) */
  cameraPortrait?: { position: Vec3; target: Vec3 };
  hotspots: RideHotspot[];
  screen?: RideScreen;
}

export interface WorldRide {
  islandId: IslandId;
  /** Web address: site.com/#career */
  slug: string;
  /** Screens of scrolling for the whole ride (default: chapters + 1) */
  pages?: number;
  /**
   * Tall phone screens: extra pull-back (× the default) and a nudge of the whole camera
   * (island space) so the subject sits centred above the bottom floor-screen panel.
   */
  portrait?: { pull?: number; shift?: Vec3 };
  chapters: RideChapter[];
}

// ---------- helpers that pull real content from portfolioData ----------

const { profile, professional, islands } = portfolioData;

function findJob(company: string) {
  const job = professional.experiences.find((e) => e.company === company);
  if (!job) throw new Error(`worldRides: no job "${company}" in portfolioData`);
  return job;
}

/**
 * "?" block on one resume bullet: problem → what I did → result, straight from portfolioData.
 * `topic` is only the short box title (e.g. "Extraction engine"); every fact comes from the data.
 */
function jobHotspot(company: string, highlightIndex: number, topic: string, extra: Omit<RideHotspot, 'label' | 'content'>): RideHotspot {
  const job = findJob(company);
  const h = job.highlights[highlightIndex];
  if (!h) throw new Error(`worldRides: no highlight ${highlightIndex} for ${company}`);
  const m = h.moreInfo;
  const lines = m
    ? ([m.problem && `The problem: ${m.problem}`, m.action && `What I did: ${m.action}`, m.result && `Result: ${m.result}`].filter(Boolean) as string[])
    : [h.text];
  return {
    ...extra,
    label: `Open: ${company}, ${topic}`,
    content: { title: `${company} · ${topic}`, lines },
  };
}

/**
 * Truth check for the numbers on ride screens: every number must appear in the
 * resume bullet it comes from. A typo here stops the dev build instead of going live.
 */
function checked(source: string, metrics: RideMetric[]): RideMetric[] {
  for (const m of metrics) {
    const n = formatNumber(m, m.value);
    if (!new RegExp(`(^|[^0-9.,])${n.replace(/[.,]/g, '\\$&')}(?![0-9])`).test(source)) {
      throw new Error(`worldRides: "${m.label} ${n}" is not in the source text: ${source}`);
    }
  }
  return metrics;
}

const bullets = (company: string, ...idx: number[]) => {
  const job = findJob(company);
  return idx.map((i) => {
    const h = job.highlights[i];
    return [h.text, h.moreInfo?.problem, h.moreInfo?.action, h.moreInfo?.result].filter(Boolean).join(' ');
  }).join(' ');
};

function jobScreen(company: string, metrics: RideMetric[], ...idx: number[]): RideScreen {
  const job = findJob(company);
  return {
    heading: company,
    sub: [job.role, job.period, job.location?.replace(', India', '')].filter(Boolean).join(' · '),
    metrics: checked(bullets(company, ...idx), metrics),
  };
}

/** Placeholder ride until Phase 5: the camera holds on the island's existing close-up. */
function simpleRide(islandId: IslandId, slug: string): WorldRide {
  const meta = islands[islandId];
  const rel = (p: Vec3): Vec3 => [p[0] - meta.coordinates[0], p[1] - meta.coordinates[1], p[2] - meta.coordinates[2]];
  return {
    islandId,
    slug,
    pages: 2,
    chapters: [
      {
        id: 'arrive',
        label: 'Full ride coming in Phase 5',
        camera: { position: rel(meta.cameraPosition), target: rel(meta.cameraTarget) },
        hotspots: [],
      },
    ],
  };
}

// ---------- the rides ----------

// ---------- WORLD 1: ORIGIN STORY ----------
// The winged book lands and opens flat (FlyingBookIsland.tsx reads ORIGIN_* below).
// Open book, island space: spine along z at x = -1.8, pages on top at y ≈ 0.4, z from -2.25 (north) to 2.25.
//   right page x -1.5 … 1.7 = hand-drawn map of India (north = -z)
//   left page  x -5.3 … -2.1 = the chapter page that turns

const { life } = portfolioData;
const lifeCities = life.cities ?? [];
function milestone(titleStart: string) {
  const m = life.milestones.find((x) => x.title.startsWith(titleStart));
  if (!m) throw new Error(`worldRides: no life milestone "${titleStart}" in portfolioData`);
  return { ...m, subtitle: m.subtitle ?? '', location: m.location ?? '', highlights: m.highlights ?? [] };
}
function city(name: string) {
  const c = lifeCities.find((x) => x.name === name);
  if (!c) throw new Error(`worldRides: no city "${name}" in portfolioData`);
  return c;
}

export const ORIGIN_PAGE_Y = 0.4;
const MAP_SCALE = 0.1017; // island units per degree
/** longitude/latitude → a point on the map page (island space). */
export function mapPoint(lon: number, lat: number, lift = 0): Vec3 {
  return [0.1 + (lon - 82.75) * MAP_SCALE, ORIGIN_PAGE_Y + lift, -(lat - 22.5) * MAP_SCALE];
}
/** u, v = 0…1 across / down the left (chapter) page → island space */
export function leftPagePoint(u: number, v: number, lift = 0.05): Vec3 {
  return [-5.325 + u * 3.25, ORIGIN_PAGE_Y + lift, -2.25 + v * 4.5];
}

export type OriginStopKind = 'city' | 'home' | 'study' | 'work' | 'now';
export interface OriginStop {
  id: string;
  name: string;
  /** map position. Places around Delhi are nudged apart a little so their pins don't overlap (it's a hand-drawn map) */
  lonLat: [number, number];
  kind: OriginStopKind;
  labelSide: 'left' | 'right';
}

const shortTitle = (t: string) => t.split(' — ')[0];
const ropar = milestone('IIT Ropar');
const icici = milestone('ICICI Bank');
const xlriLife = milestone('XLRI');
const kotak = milestone('Kotak Private');
const icse = milestone('Nomadic Roots');
const jee = milestone('Senior School');

const CITY_MAP: Record<string, { lonLat: [number, number]; labelSide: 'left' | 'right' }> = {
  Ghaziabad: { lonLat: [78.2, 28.75], labelSide: 'right' },
  Delhi: { lonLat: [76.9, 29.1], labelSide: 'left' },
  Gorakhpur: { lonLat: [83.37, 26.76], labelSide: 'right' },
  Muzaffarpur: { lonLat: [85.39, 26.12], labelSide: 'right' },
  Jamnagar: { lonLat: [70.06, 22.47], labelSide: 'right' },
  Ranchi: { lonLat: [85.31, 23.34], labelSide: 'right' },
};

/** The train's route, in order: the 6 childhood cities, then college and work. */
export const ORIGIN_STOPS: OriginStop[] = [
  ...lifeCities.map((c): OriginStop => ({
    id: c.name.toLowerCase(),
    name: c.name,
    lonLat: CITY_MAP[c.name]?.lonLat ?? [80, 23],
    labelSide: CITY_MAP[c.name]?.labelSide ?? 'right',
    kind: c.isHome ? 'home' : 'city',
  })),
  { id: 'ropar', name: shortTitle(ropar.title), lonLat: [76.53, 30.97], kind: 'study', labelSide: 'right' },
  { id: 'icici', name: shortTitle(icici.title), lonLat: [77.59, 12.97], kind: 'work', labelSide: 'right' },
  { id: 'xlri', name: shortTitle(xlriLife.title), lonLat: [76.3, 28.15], kind: 'study', labelSide: 'left' },
  { id: 'kotak', name: shortTitle(kotak.title), lonLat: [72.88, 19.08], kind: 'now', labelSide: 'left' },
];
const stopIndex = (id: string) => {
  const i = ORIGIN_STOPS.findIndex((s) => s.id === id);
  if (i < 0) throw new Error(`worldRides: no origin stop "${id}"`);
  return i;
};

/** Text drawn on the left (chapter) page, in order of turning. Decoration: the readable version is the side panel. */
export interface OriginPage { kicker: string; title: string; lines: string[] }
const agesFrom = (a: string, b: string) => `Ages ${city(a).ages.split(' – ')[0]} – ${city(b).ages.split(' – ')[1]}`;
const stateCount = new Set(lifeCities.map((c) => c.state)).size;
const yearStart = (m: { year: string }) => m.year.split(' – ')[0];

export const ORIGIN_PAGES: OriginPage[] = [
  { kicker: 'World 1', title: 'Origin Story', lines: [profile.name, `${lifeCities.length} cities · ${stateCount} states`] },
  { kicker: 'Chapter 1', title: 'Early years', lines: ['Ghaziabad', 'Delhi', 'Gorakhpur', agesFrom('Ghaziabad', 'Gorakhpur')] },
  { kicker: 'Chapter 2', title: 'Home & away', lines: ['Muzaffarpur ★', 'Jamnagar', agesFrom('Muzaffarpur', 'Jamnagar')] },
  { kicker: 'Chapter 3', title: 'Ranchi', lines: ['ICSE AIR 33', 'JEE AIR 5,515', agesFrom('Ranchi', 'Ranchi')] },
  { kicker: 'Chapter 4', title: 'IIT Ropar', lines: ['B.Tech', 'Mechanical', ropar.year] },
  { kicker: 'Chapter 5', title: 'Work & B-school', lines: ['ICICI Bank', 'XLRI', 'Kotak Private', `${yearStart(icici)} – Present`] },
  { kicker: 'Unlocked', title: 'Values', lines: life.values.map((v) => v.title) },
];

/** 3D state at each chapter keyframe (same order as the chapters). */
export interface OriginKey {
  /** 0 = flying, 1 = landed */
  land: number;
  /** 0 = closed, 1 = open flat */
  open: number;
  /** train position: index into ORIGIN_STOPS (fractions = between stops) */
  stop: number;
  /** left page shown: index into ORIGIN_PAGES */
  page: number;
  /** 1 = the whole route glows */
  glow: number;
  /** 0 = map not drawn yet, 1 = the ink map is fully drawn (stays drawn while the book closes) */
  ink: number;
}

/** "?" sits just above (north of) its pin, so the pin and its label stay visible */
const pinAnchor = (s: OriginStop): Vec3 => { const [x, y, z] = mapPoint(s.lonLat[0], s.lonLat[1], 0.45); return [x, y, z - 0.3]; };
const cityHotspot = (name: string, extra: Partial<RideHotspot> = {}): RideHotspot => {
  const c = city(name);
  const s = ORIGIN_STOPS[stopIndex(name.toLowerCase())];
  return {
    id: `origin-${s.id}`,
    label: `Open: ${c.name}`,
    anchor: pinAnchor(s),
    content: { title: `${c.name}, ${c.state}${c.isHome ? ' ★ Home' : ''}`, lines: [`Ages ${c.ages}`, ...(c.memory ? [c.memory] : [])] },
    ...extra,
  };
};
const stopAnchor = (id: string): Vec3 => pinAnchor(ORIGIN_STOPS[stopIndex(id)]);
const story = (m: { problem?: string; action?: string; result?: string } | undefined) =>
  m ? ([m.problem && `The problem: ${m.problem}`, m.action && `What I did: ${m.action}`, m.result && `Result: ${m.result}`].filter(Boolean) as string[]) : [];
const toCareer = { href: `#career`, label: 'Full story in World 2 ▶' };

/** Camera looking down at the open book from the south (the visitor's side). */
const bookCam = (tx: number, tz: number, dist: number, ty = 0.4): { position: Vec3; target: Vec3 } => ({
  position: [tx, ty + dist * 0.82, tz + dist * 0.58],
  target: [tx, ty, tz],
});

/** Values "?" blocks leave a little early, before the cover starts closing over the page they sit on */
const valuesShow: [number, number] = [7.5 / 9, 8.25 / 9];

const originChapters: (RideChapter & { key: OriginKey })[] = [
  {
    id: 'arrive',
    label: 'Arrival · The book of origins',
    key: { land: 0, open: 0, stop: 0, page: 0, glow: 0, ink: 0 },
    camera: { position: [4.0, 6.4, 11.8], target: [0.9, 1.0, 0] },
    cameraPortrait: { position: [3.0, 9.6, 13.4], target: [0.3, 0.6, 1.4] },
    screen: { heading: 'Origin Story', sub: life.summary },
    hotspots: [{
      id: 'origin-start',
      label: 'Open: where it starts',
      anchor: [0, 2.1, 0.4], // on the front cover
      show: [0, 0.25 / 9], // gone before the cover starts to lift
      content: { title: 'Where it starts', lines: [life.origin] },
    }],
  },
  {
    id: 'open',
    label: 'The book opens',
    key: { land: 1, open: 1, stop: 0, page: 0, glow: 0, ink: 1 },
    camera: bookCam(-0.4, 0.3, 10.5),
    cameraPortrait: bookCam(-1.3, 1.0, 17),
    screen: { heading: 'Origin Story', sub: `${lifeCities.length} cities · ${stateCount} states · ${agesFrom(lifeCities[0]?.name ?? 'Ghaziabad', lifeCities[lifeCities.length - 1]?.name ?? 'Ranchi')}` },
    hotspots: [
      cityHotspot('Ghaziabad', { show: [0.8 / 9, 1.5 / 9] }), // once its pin is up
      // the quote, on the title page once the book lies open
      ...(life.quote ? [{
        id: 'origin-quote',
        label: 'Open: quote',
        anchor: leftPagePoint(0.95, 0.5),
        show: [0.8 / 9, 1.5 / 9] as [number, number],
        content: { title: 'Quote', lines: [`“${life.quote}”`, ...(life.quoteAuthor ? [`— ${life.quoteAuthor}`] : [])] },
      }] : []),
    ],
  },
  {
    id: 'early',
    label: 'Chapter 1 · Early years',
    key: { land: 1, open: 1, stop: stopIndex('gorakhpur'), page: 1, glow: 0, ink: 1 },
    camera: bookCam(0.8, -0.5, 4.0),
    cameraPortrait: bookCam(0.1, 0.55, 12),
    screen: { heading: 'Chapter 1 · Early years', sub: `Ghaziabad → Delhi → Gorakhpur · ${agesFrom('Ghaziabad', 'Gorakhpur')}` },
    hotspots: [cityHotspot('Delhi'), cityHotspot('Gorakhpur')],
  },
  {
    id: 'home',
    label: 'Chapter 2 · Home and away',
    key: { land: 1, open: 1, stop: stopIndex('jamnagar'), page: 2, glow: 0, ink: 1 },
    camera: bookCam(0.8, -0.2, 4.3),
    cameraPortrait: bookCam(0.1, 0.7, 12),
    screen: { heading: 'Chapter 2 · Home and away', sub: `Muzaffarpur → Jamnagar · ${agesFrom('Muzaffarpur', 'Jamnagar')}` },
    hotspots: [cityHotspot('Muzaffarpur'), cityHotspot('Jamnagar')],
  },
  {
    id: 'ranchi',
    label: 'Chapter 3 · Ranchi',
    key: { land: 1, open: 1, stop: stopIndex('ranchi'), page: 3, glow: 0, ink: 1 },
    camera: bookCam(-0.5, 0.25, 9.8),
    cameraPortrait: bookCam(-1.2, 1.0, 15),
    screen: {
      heading: 'Chapter 3 · Ranchi',
      sub: `Jharkhand · ${agesFrom('Ranchi', 'Ranchi')}`,
      metrics: checked([icse.subtitle, ...icse.highlights, jee.subtitle, ...jee.highlights].join(' '), [
        { label: 'ICSE Class X AIR', value: 33 },
        { label: 'ICSE Class X', value: 92.8, decimals: 2, suffix: '%' },
        { label: 'JEE Advanced AIR', value: 5515, grouped: true },
        { label: 'JEE Mains %ile', value: 98.41, decimals: 2 },
      ]),
    },
    hotspots: [
      cityHotspot('Ranchi'),
      { id: 'origin-icse', label: 'Open: ICSE All-India rank 33', anchor: leftPagePoint(0.95, 0.4), content: { title: 'ICSE Class X · AIR 33', lines: story(icse.moreInfo) } },
      { id: 'origin-jee', label: 'Open: JEE Advanced AIR 5,515', anchor: leftPagePoint(0.95, 0.68), content: { title: 'JEE Advanced · AIR 5,515', lines: story(jee.moreInfo) } },
    ],
  },
  {
    id: 'ropar',
    label: 'Chapter 4 · IIT Ropar',
    key: { land: 1, open: 1, stop: stopIndex('ropar'), page: 4, glow: 0, ink: 1 },
    camera: bookCam(-0.45, -0.1, 9.4),
    cameraPortrait: bookCam(-1.2, 0.9, 15),
    screen: {
      heading: 'Chapter 4 · IIT Ropar',
      sub: [ropar.subtitle.split(' | ')[0], ropar.year, ropar.location].join(' · '),
      metrics: checked([ropar.subtitle, ...ropar.highlights].join(' '), [
        { label: 'CGPA (out of 10)', value: 8.01, decimals: 2 },
        { label: 'uBreathe Life CADR', value: 60, prefix: '+', suffix: '%' },
      ]),
    },
    hotspots: [
      { id: 'origin-ropar', label: 'Open: IIT Ropar', anchor: stopAnchor('ropar'), content: { title: 'IIT Ropar', lines: ropar.highlights } },
      { id: 'origin-captain', label: 'Open: captain and event head', anchor: leftPagePoint(0.95, 0.5), content: { title: 'Captain & Event Head', lines: story(ropar.moreInfo) } },
    ],
  },
  {
    id: 'work',
    label: 'Chapter 5 · Work and B-school',
    key: { land: 1, open: 1, stop: stopIndex('xlri'), page: 5, glow: 0, ink: 1 },
    camera: bookCam(0.8, 0.1, 4.6),
    cameraPortrait: bookCam(0.1, 0.8, 12.5),
    screen: {
      heading: 'Chapter 5 · Work & B-school',
      sub: `${shortTitle(icici.title)}, ${icici.location.split(',')[0]} → ${shortTitle(xlriLife.title)} · ${yearStart(icici)} – ${xlriLife.year.split(' – ')[1]}`,
      metrics: checked(xlriLife.highlights[0], [
        { label: 'CAT %ile', value: 99.6, decimals: 2 },
        { label: 'XAT Decision Making %ile', value: 99.92, decimals: 2 },
      ]),
    },
    hotspots: [
      { id: 'origin-icici', label: 'Open: ICICI Bank', anchor: stopAnchor('icici'), content: { title: `${shortTitle(icici.title)} · ${icici.location.split(',')[0]}`, lines: [icici.subtitle, icici.highlights[0]], link: toCareer } },
      { id: 'origin-xlri', label: 'Open: XLRI Delhi-NCR', anchor: stopAnchor('xlri'), content: { title: shortTitle(xlriLife.title), lines: [story(xlriLife.moreInfo)[0], xlriLife.highlights[0], xlriLife.highlights[2]].filter(Boolean) } },
    ],
  },
  {
    id: 'now',
    label: 'Now · Kotak Private',
    key: { land: 1, open: 1, stop: stopIndex('kotak'), page: 5, glow: 0, ink: 1 },
    camera: bookCam(0.8, 0.15, 4.2),
    cameraPortrait: bookCam(0.0, 0.8, 12),
    screen: { heading: `Now · ${shortTitle(kotak.title)}`, sub: [kotak.subtitle, kotak.location, kotak.year].join(' · ') },
    hotspots: [{ id: 'origin-kotak', label: 'Open: Kotak Private', anchor: stopAnchor('kotak'), content: { title: `${shortTitle(kotak.title)} · Now`, lines: [kotak.subtitle, kotak.location], link: toCareer } }],
  },
  {
    id: 'values',
    label: 'The whole route · Values',
    key: { land: 1, open: 1, stop: stopIndex('kotak'), page: 6, glow: 1, ink: 1 },
    camera: bookCam(-0.4, 0.3, 10.5),
    cameraPortrait: bookCam(-2.3, 1.1, 14.5),
    screen: { heading: 'Values unlocked', groups: [{ title: 'Values', items: life.values.map((v) => v.title) }] },
    hotspots: [
      { id: 'origin-values', label: 'Open: values', anchor: leftPagePoint(0.95, 0.45), show: valuesShow, content: { title: 'Values', lines: life.values.map((v) => `${v.title}: ${v.description}`) } },
      { id: 'origin-funfacts', label: 'Open: fun facts', anchor: leftPagePoint(0.95, 0.8), show: valuesShow, content: { title: 'Fun facts', lines: life.funFacts } },
    ],
  },
  {
    id: 'clear',
    label: 'The book closes · Stage clear',
    key: { land: 1, open: 0, stop: stopIndex('kotak'), page: 6, glow: 1, ink: 1 },
    camera: { position: [3.6, 7.6, 11.0], target: [0.6, 0.3, 0.2] },
    cameraPortrait: { position: [3.0, 11.0, 14.5], target: [0.2, 0.3, 1.4] },
    hotspots: [],
  },
];

/** 3D state per chapter, same order as the ride's chapters */
export const originKeys: OriginKey[] = originChapters.map((c) => c.key);

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

/** Rocket centre line in island space; its base sits on the pad top at y 0.4 */
export const BOSS_ROCKET = { x: -1.1, z: -0.7, padTop: 0.4, height: 2.5 } as const;
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

export const worldRides: Record<IslandId, WorldRide> = {
  // WORLD 1: ORIGIN STORY: the winged book lands and opens; a train crosses the map of India
  // through the 6 childhood cities, then IIT Ropar, ICICI, XLRI and Kotak; the book closes.
  life: {
    islandId: 'life',
    slug: 'origin',
    pages: 10,
    chapters: originChapters.map(({ key: _k, ...c }) => c),
  },

  // WORLD 2: CAREER MODE: an elevator ride up the tower, one floor per step of the career
  // (ICICI → XLRI → Centrum → Kotak penthouse), then PLAYER STATS on the roof.
  professional: {
    islandId: 'professional',
    slug: 'career',
    pages: 10,
    portrait: { pull: 1.25, shift: [-0.45, -0.55, 0] },
    chapters: careerChapters.map(({ elevator: _e, ...c }) => c),
  },

  // WORLD 3: BOSS BATTLES: countdown and launch; scroll = altitude; one boss per project,
  // DEFEATED + LOOT as the rocket passes; ends in orbit with the dish beaming "MORE COMING".
  projects: {
    islandId: 'projects',
    slug: 'bosses',
    pages: 12,
    chapters: bossChapters,
  },
  hobby: simpleRide('hobby', 'quests'),
  bookstagram: simpleRide('bookstagram', 'library'),
  travel: simpleRide('travel', 'explorer'),
};

/** Worlds in order 1–6 */
export const worldOrder: IslandId[] = ['life', 'professional', 'projects', 'hobby', 'bookstagram', 'travel'];

export function rideForSlug(slug: string): WorldRide | null {
  const s = slug.replace(/^#/, '').toLowerCase();
  return Object.values(worldRides).find((r) => r.slug === s) ?? null;
}

/** Scroll part (0–1) that belongs to chapter i: centred on its camera keyframe. */
export function chapterRange(ride: WorldRide, i: number): [number, number] {
  const n = ride.chapters.length;
  if (n <= 1) return [0, 1];
  const step = 1 / (n - 1);
  return [Math.max(0, (i - 0.5) * step), Math.min(1, (i + 0.5) * step)];
}
