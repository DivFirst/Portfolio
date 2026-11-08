// World 5 layout: the books, stacks and fairy lights. Needed on the map too (the books sit on the island).
import { portfolioData } from '../portfolioData';
import {
  type Vec3, clamp01, smoothstep, window01,
} from './common';
export * from './common';

// ---------- WORLD 5: LORE LIBRARY ----------
// The gazebo's fairy lights switch on one by one as you scroll. Shelf by shelf, the books
// (all of them, from portfolioData) lift off the three stacks, fly up in front of the visitor,
// open and flip their pages, then close and join a slow ring of books above the gazebo.
// Near the end the scene dims and a golden ring rises from the open book (the LOTR moment).
// BookstagramIsland.tsx + library/LibraryRide.tsx read LIBRARY_* and libraryStateAt below.

export const { bookstagram } = portfolioData;
export const bookList = bookstagram.books;
export function book(title: string) {
  const b = bookList.find((x) => x.title === title);
  if (!b) throw new Error(`worldRides: no book "${title}" in portfolioData`);
  return b;
}

export interface LibraryShelf { id: string; label: string; heading: string; sub?: string; books: string[] }

export const LIBRARY_SHELVES: LibraryShelf[] = [
  { id: 'mistborn', label: 'Shelf 1 · Mistborn trilogy', heading: 'Mistborn trilogy', books: ['Mistborn: The Final Empire', 'The Well of Ascension', 'The Hero of Ages'] },
  { id: 'red-rising', label: 'Shelf 2 · Red Rising trilogy', heading: 'Red Rising trilogy', books: ['Red Rising', 'Golden Son', 'Morning Star'] },
  { id: 'heartbreak', label: 'Shelf 3 · Heartbreak shelf', heading: 'Heartbreak shelf', books: ["Assassin's Apprentice", 'Royal Assassin', 'The Kite Runner'] },
  { id: 'page-turners', label: 'Shelf 4 · Page-turners', heading: 'Page-turners', books: ['Dark Matter', "The Knife's Edge", 'The Maze Runner'] },
  { id: 'litrpg', label: 'Shelf 5 · First LitRPG', heading: 'First LitRPG', books: ['Dungeon Crawler Carl', "Carl's Doomsday Scenario"] },
  { id: 'detours', label: 'Shelf 6 · Quiet detours', heading: 'Quiet detours', books: ['And Then There Were None', 'Days at the Morisaki Bookshop'] },
  // sub = the title of his reel about these two books
  { id: 'one-line', label: 'Shelf 7 · One line, two books', heading: 'One line, two books', sub: 'One line from an indie book explains Kaigen', books: ['Rakshas: The Fall of Halcyon', 'The Sword of Kaigen'] },
];

// Every book must be on exactly one shelf (a new book in the data file needs a slot here).
{
  const used = LIBRARY_SHELVES.flatMap((s) => s.books);
  const missing = bookList.filter((b) => !used.includes(b.title)).map((b) => b.title);
  const twice = used.filter((t, i) => used.indexOf(t) !== i);
  used.forEach(book);
  if (missing.length || twice.length) throw new Error(`worldRides: Lore Library shelves out of date. Missing: ${missing.join(', ') || '-'} · twice: ${twice.join(', ') || '-'}`);
}

/** Chapter numbers: 0 arrival, 1–7 shelves, 8 the Ring, 9 stage clear */
export const SHELF_CHAPTER0 = 1;
export const LIBRARY_RING_CHAPTER = SHELF_CHAPTER0 + LIBRARY_SHELVES.length;
export const LIBRARY_CHAPTERS = LIBRARY_RING_CHAPTER + 2;

/** Book size (island units): cover width from the spine, height, closed thickness */
export const LIBRARY_BOOK = { w: 0.42, h: 0.58, t: 0.1 } as const;
/** Ring of finished books above the gazebo (island space) */
export const LIBRARY_ORBIT = { centre: [0, 3.55, -0.5] as Vec3, radius: 2.7 };
/** Where the golden ring rises: from the open book on top of stack 2 */
export const LIBRARY_RING = { from: [1.2, 0.72, 0.5] as Vec3, to: [1.2, 1.45, 0.5] as Vec3 };
/** The three stacks the books start on */
export const LIBRARY_STACKS: Vec3[] = [[-1.2, 0, 0.8], [1.2, 0, 0.5], [-2.25, 0, -1.0]];

/**
 * Island props stand on a base that HexagonBase raises by 0.32 above the ride origin, so
 * cameras and "?" anchors (ride-origin space) add LIB_TOP to the prop positions (island space).
 */
export const READ_Y = 1.75;
export const READ_R = 1.95; // reading spot: this far out from the gazebo, towards the camera
export const shelfAngle = (i: number) => -0.36 + i * 0.12; // the camera slowly circles the gazebo
export const dirOf = (a: number) => [Math.sin(a), Math.cos(a)] as const;

/** Centre of the spot where shelf i's books float open */
export function readCentre(i: number): Vec3 {
  const [sx, cz] = dirOf(shelfAngle(i));
  return [sx * READ_R, READ_Y, -0.3 + cz * READ_R];
}

/**
 * Where book k of a shelf (n books) floats open. Desktop: side by side.
 * Phones: one above the other (a tall screen has no room for a row).
 */
export function libraryReadPos(shelf: number, k: number, n: number, portrait: boolean): Vec3 {
  const [x, y, z] = readCentre(shelf);
  const a = shelfAngle(shelf);
  if (portrait) {
    const dy = ((n - 1) / 2 - k) * 0.68;
    return [x, y + dy, z];
  }
  const off = (k - (n - 1) / 2) * 1.02;
  return [x + Math.cos(a) * off, y, z - Math.sin(a) * off];
}

export interface LibraryBookInfo {
  title: string;
  author: string;
  rating?: number;
  genre: string;
  badge?: string;
  coverColor: string;
  /** shelf index (0-based), place on that shelf, books on that shelf */
  shelf: number;
  k: number;
  n: number;
  chapter: number;
  /** which stack it starts on, and how high */
  stack: number;
  level: number;
  /** slot in the ring of finished books (0 … count-1) */
  orbit: number;
  /** facing angle of its shelf (yaw) */
  facing: number;
}

export const ratingOf = (r?: number | string) => (r === undefined ? undefined : typeof r === 'number' ? r : parseFloat(r));

export const LIBRARY_BOOKS: LibraryBookInfo[] = (() => {
  const out: LibraryBookInfo[] = [];
  const stackLevels = LIBRARY_STACKS.map(() => 0);
  let orbit = 0;
  LIBRARY_SHELVES.forEach((shelf, si) => {
    shelf.books.forEach((title, k) => {
      const b = book(title);
      // deal books onto the stacks in turn, so every stack is about the same height
      const stack = orbit % LIBRARY_STACKS.length;
      out.push({
        title: b.title, author: b.author, rating: ratingOf(b.rating), genre: b.genre, badge: b.badge,
        coverColor: b.coverColor,
        shelf: si, k, n: shelf.books.length, chapter: SHELF_CHAPTER0 + si,
        stack, level: stackLevels[stack]++, orbit: orbit++, facing: shelfAngle(si),
      });
    });
  });
  return out;
})();

/** "4.5/5" */
export const ratingText = (r?: number) => (r === undefined ? '' : `${r}/5`);


export interface LibraryBookState {
  /** 0 on the stack → 1 floating at the reading spot */
  lift: number;
  /** 0 closed → 1 open */
  open: number;
  /** 0 → 1 pages flipping while open */
  fan: number;
  /** 0 → 1 flown up into the ring of finished books */
  park: number;
}

export interface LibraryState {
  /** chapter position: continuous, or snapped to whole chapters when motion is reduced */
  x: number;
  books: LibraryBookState[];
  /** 0–1 brightness of each fairy light, in switch-on order */
  lights: number[];
  /** 0 → 1 the golden ring rises */
  ringRise: number;
  /** 0 → 1 the scene dims around the ring (peaks at the Ring chapter) */
  dim: number;
}

export const LIBRARY_LIGHT_COUNT = 20;

/** Everything the Lore Library ride shows at progress p: a pure function, so scrolling up rewinds it. */
export function libraryStateAt(p: number, reduced: boolean): LibraryState {
  const raw = clamp01(p) * (LIBRARY_CHAPTERS - 1);
  const x = reduced ? Math.round(raw) : raw;
  const books = LIBRARY_BOOKS.map((b) => {
    const c = b.chapter;
    const close = window01(x, c + 0.3, 0.2);
    return {
      lift: window01(x, c - 0.65, 0.4),
      open: window01(x, c - 0.45, 0.25) * (1 - close),
      // pages flutter over while the book opens, then lie flat (and stay out of the way)
      fan: reduced ? 1 : clamp01((x - (c - 0.42)) / 0.32),
      park: window01(x, c + 0.35, 0.4),
    };
  });
  // lights: the first comes on as shelf 1 arrives, the last by shelf 7
  const first = SHELF_CHAPTER0 - 0.5;
  const last = LIBRARY_RING_CHAPTER - 1.2;
  const dim = smoothstep(clamp01(1 - Math.abs(x - LIBRARY_RING_CHAPTER) / 0.6));
  const lights = Array.from({ length: LIBRARY_LIGHT_COUNT }, (_, i) => {
    const at = first + (i / (LIBRARY_LIGHT_COUNT - 1)) * (last - first);
    return clamp01((x - at) / 0.2) * (1 - 0.85 * dim);
  });
  return { x, books, lights, ringRise: window01(x, LIBRARY_RING_CHAPTER - 0.7, 0.55), dim };
}

/** A book's "?" box: author · rating · genre · badge, the review, the favourite line. */
