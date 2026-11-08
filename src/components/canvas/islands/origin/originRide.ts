import * as THREE from 'three';
import { INDIA } from './india';
import {
  ORIGIN_STOPS,
  chapterBlend,
  mapPoint,
  originKeys,
  type OriginKey,
} from '../../../../data/rides/origin';

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


export const indiaOutline: THREE.Vector3[] = INDIA.map(([lon, lat]) => new THREE.Vector3(...mapPoint(lon, lat, 0.006)));
export const indiaOutlineLength = indiaOutline.reduce((s, v, i) => (i ? s + v.distanceTo(indiaOutline[i - 1]) : 0), 0);

/** Flat fill shape for the map (x, -z in the shape's own plane; the mesh is laid flat) */
export function indiaShape() {
  const shape = new THREE.Shape();
  indiaOutline.forEach((v, i) => (i ? shape.lineTo(v.x, -v.z) : shape.moveTo(v.x, -v.z)));
  return shape;
}
