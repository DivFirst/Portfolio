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

export interface RideChapter {
  id: string;
  /** Shown in the world HUD, e.g. "Floor 1 · ICICI Bank" */
  label: string;
  camera: { position: Vec3; target: Vec3 };
  hotspots: RideHotspot[];
}

export interface WorldRide {
  islandId: IslandId;
  /** Web address: site.com/#career */
  slug: string;
  /** Screens of scrolling for the whole ride (default: chapters + 1) */
  pages?: number;
  chapters: RideChapter[];
}

// ---------- helpers that pull real content from portfolioData ----------

const { profile, professional, islands } = portfolioData;

function jobHotspot(company: string, highlightIndex: number, extra: Omit<RideHotspot, 'label' | 'content'>): RideHotspot {
  const job = professional.experiences.find((e) => e.company === company);
  const h = job?.highlights[highlightIndex];
  if (!job || !h) throw new Error(`worldRides: no highlight ${highlightIndex} for ${company}`);
  const lines = h.moreInfo
    ? [h.moreInfo.action && `What I did: ${h.moreInfo.action}`, h.moreInfo.result && `Result: ${h.moreInfo.result}`].filter(Boolean) as string[]
    : [h.text];
  return {
    ...extra,
    label: `Open: ${company}, ${job.role}`,
    content: {
      title: `${company} · ${job.role}`,
      lines,
      link: { href: profile.resumeUrl, label: 'Full resume ▶' },
    },
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

/** Tower front face is at z ≈ -0.34 in island space; floors at y ≈ 0.9 / 1.9 / 3.0 */
const TOWER: Vec3 = [-1.2, 0, -0.34];
const floorCam = (y: number): { position: Vec3; target: Vec3 } => ({
  position: [TOWER[0] + 4.2, y + 1.3, TOWER[2] + 7.2],
  target: [TOWER[0] + 0.6, y, TOWER[2]],
});

export const worldRides: Record<IslandId, WorldRide> = {
  life: simpleRide('life', 'origin'),

  // WORLD 2: CAREER MODE — SIMPLE placeholder ride (step 3.4): the camera rises up the tower,
  // one floor per job, with one "?" on a real resume bullet per floor.
  professional: {
    islandId: 'professional',
    slug: 'career',
    pages: 4,
    chapters: [
      {
        id: 'icici',
        label: 'Floor 1 · ICICI Bank',
        camera: floorCam(0.9),
        hotspots: [jobHotspot('ICICI Bank', 0, { id: 'icici-kmeans', anchor: [TOWER[0] + 0.4, 0.9, TOWER[2]] })],
      },
      {
        id: 'centrum',
        label: 'Floor 2 · Centrum Broking',
        camera: floorCam(1.9),
        hotspots: [jobHotspot('Centrum Broking', 0, { id: 'centrum-genai', anchor: [TOWER[0] + 0.4, 1.9, TOWER[2]] })],
      },
      {
        id: 'kotak',
        label: 'Penthouse · Kotak Private',
        camera: floorCam(3.0),
        hotspots: [jobHotspot('Kotak Private', 0, { id: 'kotak-extraction', anchor: [TOWER[0] + 0.4, 3.0, TOWER[2]] })],
      },
    ],
  },

  projects: simpleRide('projects', 'bosses'),
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
