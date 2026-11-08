import type { IslandId } from '../../types/portfolio';

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
  /** ... on tall phone screens, when the ride uses phone cameras (default: anchor) */
  anchorPortrait?: Vec3;
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

// ---------- small helpers shared by several rides ----------

/** World 3: rocket centre line in island space; its base sits on the pad top at y 0.4 (the map needs it too) */
export const BOSS_ROCKET = { x: -1.1, z: -0.7, padTop: 0.4, height: 2.5 } as const;

export const story = (m: { problem?: string; action?: string; result?: string } | undefined) =>
  m ? ([m.problem && `The problem: ${m.problem}`, m.action && `What I did: ${m.action}`, m.result && `Result: ${m.result}`].filter(Boolean) as string[]) : [];
/** Ride cameras and "?" anchors (ride-origin space) add LIB_TOP to prop positions (island space). */
export const LIB_TOP = 0.32;
export const top = (v: Vec3): Vec3 => [v[0], v[1] + LIB_TOP, v[2]];
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smoothstep = (t: number) => t * t * (3 - 2 * t);
export const window01 = (x: number, from: number, len: number) => smoothstep(clamp01((x - from) / len));


/** Scroll part (0–1) that belongs to chapter i: centred on its camera keyframe. */
export function chapterRange(ride: WorldRide, i: number): [number, number] {
  const n = ride.chapters.length;
  if (n <= 1) return [0, 1];
  const step = 1 / (n - 1);
  return [Math.max(0, (i - 0.5) * step), Math.min(1, (i + 0.5) * step)];
}
