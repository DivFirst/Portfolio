import * as THREE from 'three';
import {
  ORIGIN_STOPS,
  chapterBlend,
  mapPoint,
  originKeys,
  type OriginKey,
} from '../../../../data/worldRides';

/**
 * World 1 (Origin Story) maths shared by the book and its map:
 * the 3D state at any scroll position, and the train's route across the map.
 * Everything is a pure function of the scroll, so scrolling up plays it all backwards.
 */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (t: number) => t * t * (3 - 2 * t);

/** Book + map state at ride progress p (0–1). */
export function originStateAt(p: number, reduced: boolean): OriginKey {
  const { a, b, t } = chapterBlend(p, originKeys.length, reduced);
  const ka = originKeys[a];
  const kb = originKeys[b] ?? ka;
  return {
    land: lerp(ka.land, kb.land, t),
    open: lerp(ka.open, kb.open, t),
    stop: lerp(ka.stop, kb.stop, t),
    page: lerp(ka.page, kb.page, t),
    glow: lerp(ka.glow, kb.glow, t),
    ink: lerp(ka.ink, kb.ink, t),
  };
}

// ---------- the route ----------

const PER_SEGMENT = 40;
const stopPoints = ORIGIN_STOPS.map((s) => new THREE.Vector3(...mapPoint(s.lonLat[0], s.lonLat[1], 0.012)));
const curve = new THREE.CatmullRomCurve3(stopPoints, false, 'centripetal');
const samples: THREE.Vector3[] = [];
const total = (stopPoints.length - 1) * PER_SEGMENT;
for (let k = 0; k <= total; k++) samples.push(curve.getPoint(k / total));
const cumulative: number[] = [0];
for (let k = 1; k < samples.length; k++) cumulative.push(cumulative[k - 1] + samples[k].distanceTo(samples[k - 1]));

export const routeLength = cumulative[cumulative.length - 1];
/** Distance along the route where each stop sits */
export const stopArc = ORIGIN_STOPS.map((_, i) => cumulative[i * PER_SEGMENT]);

/** Distance along the route for a (fractional) stop index */
export function arcForStop(stop: number) {
  const i = Math.max(0, Math.min(stopArc.length - 1, Math.floor(stop)));
  const j = Math.min(stopArc.length - 1, i + 1);
  return lerp(stopArc[i], stopArc[j], stop - i);
}

/** Point on the route at a distance along it (writes into `out`) */
export function pointAtArc(arc: number, out: THREE.Vector3) {
  const d = Math.max(0, Math.min(routeLength, arc));
  let lo = 0;
  let hi = cumulative.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (cumulative[mid] < d) lo = mid; else hi = mid;
  }
  const span = cumulative[hi] - cumulative[lo] || 1;
  return out.copy(samples[lo]).lerp(samples[hi], (d - cumulative[lo]) / span);
}

// ---------- India, hand-drawn (longitude, latitude), clockwise from Kutch ----------

const INDIA: [number, number][] = [
  [68.2, 23.7], [68.8, 24.3], [70.0, 24.4], [71.0, 24.6], [70.4, 25.7], [70.1, 27.2], [71.4, 27.9],
  [72.4, 28.9], [73.4, 29.9], [74.5, 31.0], [74.6, 32.5], [74.0, 33.2], [73.8, 34.5], [74.5, 35.0],
  [76.0, 35.8], [77.8, 35.5], [78.9, 34.3], [78.7, 32.6], [79.2, 31.3], [80.3, 30.5], [81.1, 30.0],
  [82.2, 28.0], [84.0, 27.4], [85.6, 26.8], [87.0, 26.4], [88.1, 26.5], [88.2, 27.8], [88.9, 27.3],
  [89.8, 26.8], [92.0, 26.9], [93.5, 27.9], [95.3, 28.3], [97.3, 28.2], [96.6, 27.3], [95.2, 26.6],
  [94.6, 25.2], [94.2, 23.9], [93.3, 22.0], [92.6, 23.4], [91.6, 22.9], [91.2, 24.1], [92.2, 24.6],
  [92.0, 25.1], [90.0, 25.2], [89.8, 25.9], [88.6, 26.2], [88.1, 25.0], [88.7, 24.3], [88.9, 22.8],
  [89.0, 21.8], [87.5, 21.6], [86.8, 20.6], [85.6, 19.7], [84.6, 18.9], [83.4, 17.9], [82.2, 16.6],
  [81.2, 15.9], [80.2, 15.2], [80.3, 13.4], [79.8, 11.6], [79.8, 10.3], [78.4, 8.9], [77.5, 8.1],
  [76.6, 8.9], [76.2, 10.0], [75.6, 11.7], [74.8, 12.9], [74.1, 14.7], [73.4, 16.4], [72.8, 18.9],
  [72.7, 20.6], [72.6, 21.4], [72.1, 21.0], [71.0, 20.8], [70.0, 21.3], [69.0, 22.3], [70.0, 22.7],
  [69.2, 22.8], [68.4, 23.3], [68.2, 23.7],
];

export const indiaOutline: THREE.Vector3[] = INDIA.map(([lon, lat]) => new THREE.Vector3(...mapPoint(lon, lat, 0.006)));
export const indiaOutlineLength = indiaOutline.reduce((s, v, i) => (i ? s + v.distanceTo(indiaOutline[i - 1]) : 0), 0);

/** Flat fill shape for the map (x, -z in the shape's own plane; the mesh is laid flat) */
export function indiaShape() {
  const shape = new THREE.Shape();
  indiaOutline.forEach((v, i) => (i ? shape.lineTo(v.x, -v.z) : shape.moveTo(v.x, -v.z)));
  return shape;
}
