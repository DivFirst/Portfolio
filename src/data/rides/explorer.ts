// Ride script for one world (see common.ts for how rides work). Loaded only when that world opens.
import { portfolioData } from '../portfolioData';
import {
  LIB_TOP, type RideChapter, type RideHotspot, type Vec3, type WorldRide, clamp01, smoothstep, window01, top,
} from './common';
export * from './common';

// ---------- WORLD 6: MAP EXPLORER ----------
// The paper plane waits by the campfire, takes off, and a parchment map of India and Vietnam
// unfolds above the island. The plane flies a dotted route stop by stop; at each trip a
// passport stamp slams onto the map. Ends with the whole map and every stamp.
// TravelIsland.tsx + travel/MapRide.tsx read TRAVEL_* and travelStateAt below.
// Route order is geographic (the data has no dates for the India trips).

const travel = portfolioData.travel!;
if (!travel) throw new Error('worldRides: no travel section in portfolioData');
const tripList = travel.destinations;
function trip(city: string) {
  const d = tripList.find((x) => x.city === city);
  if (!d) throw new Error(`worldRides: no trip "${city}" in portfolioData`);
  return d;
}

/** Map plane (island space): lon/lat → a flat parchment floating above the island */
export const TRAVEL_MAP = { y: 3.0, scale: 0.16, lon0: 89, lat0: 21.5, lonSpan: [66.5, 111.5] as [number, number], latSpan: [5, 38] as [number, number] };
export function travelMapPoint(lon: number, lat: number, lift = 0): Vec3 {
  return [(lon - TRAVEL_MAP.lon0) * TRAVEL_MAP.scale, TRAVEL_MAP.y + lift, -(lat - TRAVEL_MAP.lat0) * TRAVEL_MAP.scale];
}

interface TripPin { city: string; lonLat: [number, number]; /** where its stamp lands, offset from the pin (map units) */ stamp: [number, number] }
interface TravelStop {
  id: string;
  label: string;
  trips: TripPin[];
  /** where the plane parks, offset from the pin(s) (map units), clear of the stamps; default just south */
  plane?: [number, number];
  /** desktop camera: how far the shot leans right to leave room for the panel (default 0.8) */
  shift?: number;
}

const TRAVEL_STOPS: TravelStop[] = [
  { id: 'himachal', label: 'Stop 1 · Himachal Pradesh', trips: [
    { city: 'Manali', lonLat: [77.19, 32.24], stamp: [-0.52, -0.42] },
    { city: 'Kasol', lonLat: [77.31, 32.01], stamp: [0.55, -0.3] },
  ] },
  { id: 'goa', label: 'Stop 2 · Goa', trips: [{ city: 'Goa', lonLat: [74.0, 15.4], stamp: [-0.62, 0.05] }] },
  { id: 'hampi', label: 'Stop 3 · Srisailam & Hampi', trips: [{ city: 'Srisailam & Hampi', lonLat: [77.6, 15.7], stamp: [0.62, -0.12] }] },
  { id: 'varkala', label: 'Stop 4 · Varkala', trips: [{ city: 'Varkala', lonLat: [76.7, 8.73], stamp: [0.6, 0.08] }] },
  { id: 'meghalaya', label: 'Stop 5 · Meghalaya', trips: [{ city: 'Meghalaya', lonLat: [91.3, 25.5], stamp: [0.1, -0.6] }] },
  { id: 'vietnam', label: 'Stop 6 · Northern Vietnam', plane: [-0.55, -0.15], shift: 0.25, trips: [{ city: 'Northern Vietnam', lonLat: [105.9, 21.0], stamp: [0.3, 0.68] }] },
];

// Every trip in the data file must be on the route exactly once.
{
  const used = TRAVEL_STOPS.flatMap((s) => s.trips.map((t) => t.city));
  const missing = tripList.filter((d) => !used.includes(d.city)).map((d) => d.city);
  used.forEach(trip);
  if (missing.length) throw new Error(`worldRides: Map Explorer route out of date. Missing: ${missing.join(', ')}`);
}

/** Northern Vietnam's own stops, for the little dots on the map */
export const VIETNAM_STOPS: { name: string; lonLat: [number, number] }[] = [
  { name: 'Ha Giang', lonLat: [104.98, 22.82] },
  { name: 'Hanoi', lonLat: [105.85, 21.03] },
  { name: 'Ninh Binh', lonLat: [105.97, 20.25] },
  { name: 'Cat Ba', lonLat: [107.05, 20.73] },
];

export const TRAVEL_STAMP_SIZE = 0.78;
const STOP_CHAPTER0 = 2; // 0 campfire, 1 takeoff
export const TRAVEL_CHAPTERS = STOP_CHAPTER0 + TRAVEL_STOPS.length + 1;

export interface TravelStampInfo {
  city: string;
  country: string;
  year?: string;
  flag: string;
  /** where the stamp lies on the map (island space) */
  position: Vec3;
  /** the trip's true spot (pin) */
  pin: Vec3;
  chapter: number;
  tilt: number;
  ink: string;
}
const INKS = ['#c2185b', '#1565c0', '#2e7d32', '#6a1b9a', '#d84315', '#00838f', '#ad1457'];
export const TRAVEL_STAMPS: TravelStampInfo[] = TRAVEL_STOPS.flatMap((stop, si) =>
  stop.trips.map((t, k) => {
    const d = trip(t.city);
    const pin = travelMapPoint(t.lonLat[0], t.lonLat[1], 0.01);
    return {
      city: d.city, country: d.country, year: d.year, flag: d.flag,
      pin,
      position: [pin[0] + t.stamp[0], pin[1] + 0.02 + k * 0.004, pin[2] + t.stamp[1]] as Vec3,
      chapter: STOP_CHAPTER0 + si,
      tilt: (((si * 3 + k * 5) % 7) / 7 - 0.5) * 0.5,
      ink: INKS[(si + k) % INKS.length],
    };
  }),
);

/** Plane route (island space): by the campfire, up above the map, then one point per stop */
const PLANE_LIFT = 0.38;
export const TRAVEL_ROUTE: Vec3[] = [
  [0.95, 0.32, 0.15],
  [0.6, TRAVEL_MAP.y + 0.9, 0.9],
  ...TRAVEL_STOPS.map((s) => {
    const lon = s.trips.reduce((a, t) => a + t.lonLat[0], 0) / s.trips.length;
    const lat = s.trips.reduce((a, t) => a + t.lonLat[1], 0) / s.trips.length;
    const [px, pz] = s.plane ?? [0, 0.48];
    const p = travelMapPoint(lon, lat, PLANE_LIFT);
    return [p[0] + px, p[1], p[2] + pz] as Vec3;
  }),
];

export interface TravelState {
  x: number;
  /** position along TRAVEL_ROUTE in points (0 … points-1) */
  route: number;
  /** 0 → 1 the map unfolds */
  unfold: number;
  /** 0 → 1 per stamp (TRAVEL_STAMPS order): slammed onto the map */
  stamps: number[];
}

/** Everything the Map Explorer ride shows at progress p: a pure function, so scrolling up rewinds it. */
export function travelStateAt(p: number, reduced: boolean): TravelState {
  const raw = clamp01(p) * (TRAVEL_CHAPTERS - 1);
  const x = reduced ? Math.round(raw) : raw;
  const last = TRAVEL_ROUTE.length - 1;
  let route: number;
  if (x <= 1) route = window01(x, 0.05, 0.45);
  else {
    const seg = Math.min(last - 1, x - 1);
    const a = Math.floor(seg);
    route = Math.min(last, 1 + a + smoothstep(clamp01(seg - a)));
  }
  return {
    x,
    route,
    unfold: window01(x, 0.55, 0.45),
    stamps: TRAVEL_STAMPS.map((s) => window01(x, s.chapter - 0.35, 0.28)),
  };
}

const mid = (vs: Vec3[]): Vec3 => [0, 1, 2].map((i) => vs.reduce((a, v) => a + v[i], 0) / vs.length) as Vec3;

/** Looking down at a stop. Desktop: stop left of centre (panel on the right). Phones: higher up. */
function stopCam(c: Vec3, shift = 0.8) {
  const t: Vec3 = [c[0] + shift, c[1] + LIB_TOP, c[2]];
  const tp: Vec3 = [c[0], c[1] + LIB_TOP, c[2] - 0.15];
  return {
    camera: { position: [t[0], t[1] + 4.3, t[2] + 3.5] as Vec3, target: t },
    cameraPortrait: { position: [tp[0], tp[1] + 5.4, tp[2] + 4.3] as Vec3, target: tp },
  };
}

function tripHotspot(s: TravelStampInfo): RideHotspot {
  const d = trip(s.city);
  const where = [d.country, d.year, d.tags.join(', ')].filter(Boolean).join(' · ');
  const lines = [where, d.stops && `Route: ${d.stops.join(' → ')}`, d.highlight].filter(Boolean) as string[];
  const c = s.chapter;
  return {
    id: `trip-${s.city}`,
    label: `Open: ${s.city} trip`,
    anchor: top([s.position[0], s.position[1] + 0.12, s.position[2] - TRAVEL_STAMP_SIZE * 0.42]),
    show: [(c - 0.12) / (TRAVEL_CHAPTERS - 1), (c + 0.45) / (TRAVEL_CHAPTERS - 1)],
    content: {
      title: `${d.flag} ${d.city}`,
      lines,
      ...(d.photosUrl ? { link: { href: d.photosUrl, label: 'See the photos ▶' } } : {}),
    },
  };
}

const travelChapters: RideChapter[] = [
  {
    id: 'campfire',
    label: 'Campfire · Ready for takeoff',
    // from the front-left: the pines (right) never stand between the visitor and the fire
    camera: { position: top([-0.6, 2.1, 3.9]), target: top([0.75, 0.6, -0.4]) },
    cameraPortrait: { position: top([-0.4, 3.2, 5.8]), target: top([0.3, 0.3, -0.3]) },
    screen: { heading: 'Map Explorer', sub: travel.summary },
    hotspots: [{
      id: 'travel-log',
      label: 'Open: travel log',
      anchor: top([0.4, 1.0, -0.4]), // above the campfire
      content: { title: 'Travel log', lines: [travel.summary, `${tripList.length} trips on the map`] },
    }],
  },
  {
    id: 'takeoff',
    label: 'Takeoff',
    camera: { position: top([0.6, 7.0, 9.8]), target: top([0.4, 2.4, 0]) },
    cameraPortrait: { position: top([0.4, 10.5, 15.5]), target: top([0, 2.2, 0.4]) },
    screen: { heading: 'Takeoff', sub: `${tripList.length} trips · ${TRAVEL_STOPS.length} stops ahead` },
    hotspots: [],
  },
  ...TRAVEL_STOPS.map((stop, si): RideChapter => {
    const stamps = TRAVEL_STAMPS.filter((s) => s.chapter === STOP_CHAPTER0 + si);
    const d = trip(stop.trips[0].city);
    const vn = d.stops?.length;
    return {
      id: stop.id,
      label: stop.label,
      ...stopCam(mid(stamps.map((s) => s.position)), stop.shift),
      screen: {
        heading: stamps.map((s) => s.city).join(' & '),
        sub: [d.country, d.year, d.tags[0] !== stop.trips[0].city ? d.tags[0] : undefined].filter(Boolean).join(' · '),
        ...(vn ? { groups: [{ title: 'Route', items: d.stops! }] } : {}),
      },
      hotspots: stamps.map(tripHotspot),
    };
  }),
  {
    id: 'clear',
    label: 'Stage clear · Passport full',
    // the whole map from above, clear of the progress panel (top) and STAGE CLEAR (bottom)
    camera: { position: top([0.3, 11.2, 6.0]), target: top([0.3, 3.0, -0.1]) },
    // phones: high enough that the whole map's width fits the narrow screen
    cameraPortrait: { position: top([0.2, 22.5, 8.0]), target: top([0.2, 3.0, 1.5]) },
    hotspots: [],
  },
];
if (travelChapters.length !== TRAVEL_CHAPTERS) throw new Error('worldRides: Map Explorer chapter count is off');


// WORLD 6: MAP EXPLORER: the paper plane takes off from the campfire and flies a dotted
// route over a map of India and Vietnam; a passport stamp slams down at every trip.
export const ride: WorldRide = {
  islandId: 'travel',
  slug: 'explorer',
  pages: 10,
  chapters: travelChapters,
};
