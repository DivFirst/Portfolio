// Ride script for one world (see common.ts for how rides work). Loaded only when that world opens.
import { portfolioData } from '../portfolioData';
import {
  type RideChapter, type RideHotspot, type Vec3, type WorldRide, story,
} from './common';
import { checked, profile } from './jobHelpers';
export * from './common';

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


// WORLD 1: ORIGIN STORY: the winged book lands and opens; a train crosses the map of India
// through the 6 childhood cities, then IIT Ropar, ICICI, XLRI and Kotak; the book closes.
export const ride: WorldRide = {
  islandId: 'life',
  slug: 'origin',
  pages: 10,
  chapters: originChapters.map(({ key: _k, ...c }) => c),
};
