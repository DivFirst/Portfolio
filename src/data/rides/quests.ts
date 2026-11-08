// Ride script for one world (see common.ts for how rides work). Loaded only when that world opens.
import { portfolioData } from '../portfolioData';
import {
  type RideChapter, type RideHotspot, type RideScreen, type Vec3, type WorldRide, clamp01, smoothstep, window01, top,
} from './common';
export * from './common';

// ---------- WORLD 4: SIDE QUESTS ----------
// The camera dives into the arcade cabinet's screen and the world becomes a 2D pixel
// side-scroller: a little pixel Divyanshu walks past a badminton court, a recording booth
// and a portal to the Lore Library. Then it pops back out.
// The side-scroller is a pixel strip hidden far below the island (only ever seen from inside
// the dive). HobbyIsland.tsx + hobby/SideScroller.tsx read QUEST_* and questStateAt below.

const { hobby } = portfolioData;
function hobbyItem(id: string) {
  const h = hobby.hobbies.find((x) => x.id === id);
  if (!h) throw new Error(`worldRides: no hobby "${id}" in portfolioData`);
  return h;
}

/** Arcade cabinet (island space, from HobbyIsland.tsx): base position and turn */
const CAB = { x: -1.2, z: -0.6, yaw: 0.4 };
const facing = { x: Math.sin(CAB.yaw), z: Math.cos(CAB.yaw) };
const rightOf = { x: Math.cos(CAB.yaw), z: -Math.sin(CAB.yaw) };
/** A point on the cabinet, in its own frame (x right, y up, z out of the screen) */
function cab(lx: number, ly: number, lz: number): Vec3 {
  return [CAB.x + rightOf.x * lx + facing.x * lz, ly, CAB.z + rightOf.z * lx + facing.z * lz];
}
export const QUEST_SCREEN: Vec3 = cab(0, 1.35, 0.415);

/** The pixel strip: a wall facing the same way as the cabinet screen, far below the island */
export const QUEST_STRIP = {
  origin: [QUEST_SCREEN[0] - facing.x * 2, -40, QUEST_SCREEN[2] - facing.z * 2] as Vec3,
  yaw: CAB.yaw,
  /** strip extent along its own x (left → right) and y (down → up), island units */
  x0: -2.6, x1: 9.8, y0: -1.3, y1: 2.0,
  ground: -0.55,
};
/** A point on the strip (sx along, sy up, sz out towards the viewer) in island space */
export function questStripPoint(sx: number, sy: number, sz = 0): Vec3 {
  const o = QUEST_STRIP.origin;
  return [o[0] + rightOf.x * sx + facing.x * sz, o[1] + sy, o[2] + rightOf.z * sx + facing.z * sz];
}

export interface QuestScene { id: string; hobby: string; sx: number; sign: string }
export const QUEST_SCENES: QuestScene[] = [
  { id: 'badminton', hobby: 'badminton', sx: 0, sign: 'BADMINTON COURT' },
  { id: 'booth', hobby: 'music', sx: 3.6, sign: 'RECORDING BOOTH' },
  { id: 'portal', hobby: 'sff', sx: 7.2, sign: 'LORE LIBRARY' },
];
const SCENE_CHAPTER0 = 2; // 0 cabinet, 1 dive
export const QUEST_CHAPTERS = SCENE_CHAPTER0 + QUEST_SCENES.length + 1;
/** Where pixel-you stands in each scene: a little left of its props */
export const QUEST_WALKER_OFFSET = -0.75;

export interface QuestState {
  x: number;
  /** pixel-you along the strip */
  walker: number;
  /** 0 → 1 → 0: the screen flash while diving in (and popping back out) */
  veil: number;
  /** true once the camera is inside the game (the strip is drawn) */
  inside: boolean;
}

export function questStateAt(p: number, reduced: boolean): QuestState {
  const raw = clamp01(p) * (QUEST_CHAPTERS - 1);
  const x = reduced ? Math.round(raw) : raw;
  const s0 = SCENE_CHAPTER0;
  const sN = s0 + QUEST_SCENES.length - 1;
  const seg = Math.min(QUEST_SCENES.length - 1, Math.max(0, x - s0));
  const a = Math.min(QUEST_SCENES.length - 2, Math.floor(seg));
  const f = clamp01(seg - a);
  const walker = QUEST_SCENES[a].sx + (QUEST_SCENES[a + 1].sx - QUEST_SCENES[a].sx) * smoothstep(f) + QUEST_WALKER_OFFSET;
  // dark the moment the camera reaches the glass, light again as it nears the game
  const diveIn = window01(x, s0 - 1, 0.08) * (1 - window01(x, s0 - 0.5, 0.3));
  const popOut = window01(x, sN + 0.25, 0.15) * (1 - window01(x, sN + 0.8, 0.18));
  return { x, walker, veil: reduced ? 0 : Math.max(diveIn, popOut), inside: x > s0 - 0.9 && x < sN + 0.65 };
}

/** Camera inside the game: square on to the strip. Desktop: scene left of centre (panel on the right). */
function sceneCam(sx: number) {
  const t = questStripPoint(sx + 0.55, 0.3);
  // phones: aimed low so the ground and pixel-you sit between the HUD and the floor panel
  const tp = questStripPoint(sx - 0.05, -0.34);
  const out = (v: Vec3, d: number): Vec3 => [v[0] + facing.x * d, v[1], v[2] + facing.z * d];
  return {
    camera: { position: top(out(t, 3.3)), target: top(t) },
    cameraPortrait: { position: top(out(tp, 6.0)), target: top(tp) },
  };
}

const statLines = (id: string) => hobbyItem(id).stats.map((s) => `${s.label}: ${s.value}`);

function sceneScreen(scene: QuestScene): RideScreen {
  const h = hobbyItem(scene.hobby);
  return { heading: h.name, sub: h.description, groups: [{ title: 'Current quest', items: [h.currentObsession] }] };
}

function sceneHotspot(scene: QuestScene, ci: number): RideHotspot {
  const at = (sx: number, sy: number) => top(questStripPoint(sx, sy, 0.05));
  // desktop: right of the scene's sign (clear of the HUD and the panel); phones: just above the props
  const pins = { anchor: at(scene.sx + 1.3, 0.78), anchorPortrait: at(scene.sx + 0.3, 0.35) };
  const show: [number, number] = [(ci - 0.35) / (QUEST_CHAPTERS - 1), (ci + 0.4) / (QUEST_CHAPTERS - 1)];
  const h = hobbyItem(scene.hobby);
  const m = h.moreInfo;
  const story = m ? [m.action && `What I did: ${m.action}`, m.result && `Result: ${m.result}`].filter(Boolean) as string[] : [h.description, ...statLines(h.id)];
  const link = scene.id === 'portal' ? { href: '#library', label: 'Enter World 5: Lore Library ▶' } : undefined;
  return {
    id: `quest-${scene.id}`,
    label: `Open: ${h.name}`,
    ...pins,
    show,
    content: { title: h.name, lines: [...story, `Current quest: ${h.currentObsession}`], ...(link ? { link } : {}) },
  };
}

const questChapters: RideChapter[] = [
  {
    id: 'cabinet',
    label: 'Insert coin · Side Quests',
    camera: { position: top(cab(-1.35, 2.0, 3.3)), target: top(cab(0.7, 1.25, 0)) },
    cameraPortrait: { position: top(cab(0, 3.0, 7.0)), target: top(cab(0, 0.75, 0)) },
    screen: { heading: 'Side Quests', sub: hobby.summary },
    hotspots: [{
      id: 'quest-log',
      label: 'Open: quest log',
      anchor: top(cab(0, 2.4, 0.25)), // above the marquee
      anchorPortrait: top(cab(0.7, 1.7, 0.45)), // phones: beside the screen (the HUD covers the top)
      content: { title: 'Quest log', lines: hobby.hobbies.map((h) => `${h.name}: ${h.currentObsession}`) },
    }],
  },
  {
    id: 'dive',
    label: 'Press start',
    // right up against the screen, looking in
    camera: { position: top(cab(0, 1.4, 1.2)), target: top(cab(0, 1.33, -1)) },
    cameraPortrait: { position: top(cab(0, 1.4, 1.75)), target: top(cab(0, 1.33, -1)) },
    hotspots: [],
  },
  ...QUEST_SCENES.map((scene, i): RideChapter => ({
    id: scene.id,
    label: `Quest ${i + 1} · ${hobbyItem(scene.hobby).name}`,
    ...sceneCam(scene.sx),
    screen: sceneScreen(scene),
    hotspots: [sceneHotspot(scene, SCENE_CHAPTER0 + i)],
  })),
  {
    id: 'clear',
    label: 'Stage clear · Back to the island',
    camera: { position: top([2.4, 3.7, 6.2]), target: top([-0.5, 1.1, -0.4]) },
    cameraPortrait: { position: top([4.0, 7.2, 12.6]), target: top([0, 0.5, -0.2]) },
    hotspots: [],
  },
];
if (questChapters.length !== QUEST_CHAPTERS) throw new Error('worldRides: Side Quests chapter count is off');


// WORLD 4: SIDE QUESTS: dive into the arcade cabinet; a 2D pixel side-scroller through
// the hobbies (badminton, music, a portal to World 5); pop back out.
export const ride: WorldRide = {
  islandId: 'hobby',
  slug: 'quests',
  pages: 7,
  chapters: questChapters,
};
