// Ride script for one world (see common.ts for how rides work). Loaded only when that world opens.
import { portfolioData } from '../portfolioData';
import {
  LIB_TOP, type RideChapter, type RideHotspot, type Vec3, type WorldRide, top,
} from './common';
import {
  LIBRARY_BOOK, LIBRARY_BOOKS, LIBRARY_CHAPTERS, LIBRARY_RING, LIBRARY_SHELVES, type LibraryBookInfo, book, bookList, bookstagram, dirOf, libraryReadPos, ratingText, readCentre, shelfAngle,
} from './libraryLayout';
export * from './common';

const { life } = portfolioData;

function bookHotspot(b: LibraryBookInfo): RideHotspot {
  const src = book(b.title);
  const meta = [`by ${b.author}`, b.rating !== undefined ? `${ratingText(b.rating)} ★` : '', b.genre, b.badge].filter(Boolean).join(' · ');
  const lines = [meta, src.review, src.favoriteQuote && `Favourite line: “${src.favoriteQuote}”`].filter(Boolean) as string[];
  const above = LIBRARY_BOOK.h / 2 + 0.2;
  const at = (v: Vec3): Vec3 => [v[0], v[1] + above + LIB_TOP, v[2]];
  // phones: beside the book (above it would sit on the book stacked above)
  const a = shelfAngle(b.shelf);
  const side = LIBRARY_BOOK.w + 0.24;
  const beside = (v: Vec3): Vec3 => [v[0] + Math.cos(a) * side, v[1] + 0.12 + LIB_TOP, v[2] - Math.sin(a) * side];
  const c = b.chapter;
  return {
    id: `book-${b.orbit}`,
    label: `Open: ${b.title}`,
    anchor: at(libraryReadPos(b.shelf, b.k, b.n, false)),
    anchorPortrait: beside(libraryReadPos(b.shelf, b.k, b.n, true)),
    // only while the book is open in front of the visitor
    show: [(c - 0.25) / (LIBRARY_CHAPTERS - 1), (c + 0.32) / (LIBRARY_CHAPTERS - 1)],
    content: { title: b.title, lines },
  };
}

/** Camera for shelf i: in front of the reading spot. Desktop: books left of centre (panel on the right). */
function shelfCam(i: number) {
  const [x, y, z] = readCentre(i);
  const a = shelfAngle(i);
  const [dx, dz] = dirOf(a);
  const rx = Math.cos(a), rz = -Math.sin(a);
  const t: Vec3 = [x + rx * 0.95, y + 0.05 + LIB_TOP, z + rz * 0.95];
  // phones: the column sits between the HUD (top) and the floor panel (bottom), "?" blocks on its right
  const tp: Vec3 = [x + rx * 0.18, y + 0.3 + LIB_TOP, z + rz * 0.18];
  return {
    camera: { position: [t[0] + dx * 4.3, t[1] + 0.9, t[2] + dz * 4.3] as Vec3, target: t },
    cameraPortrait: { position: [tp[0] + dx * 6.4, tp[1] + 0.5, tp[2] + dz * 6.4] as Vec3, target: tp },
  };
}

const ringFact = life.funFacts?.find((f) => f.includes('Lord of the Rings'));
if (!ringFact) throw new Error('worldRides: no Lord of the Rings fun fact in portfolioData');
const fmtIN = (n: number) => n.toLocaleString('en-IN');
const nowReading = bookstagram.currentlyReading.map((r) => `${r.title}${r.progress !== undefined ? ` · ${r.progress}%` : ' · reading now'}`);
const booksRead = bookstagram.booksRead ?? bookList.length;

const libraryChapters: RideChapter[] = [
  {
    id: 'arrive',
    label: 'Dusk · The Unread Stack',
    camera: { position: top([3.4, 4.6, 8.6]), target: top([1.2, 1.4, -0.2]) },
    cameraPortrait: { position: top([3.6, 7.6, 14.4]), target: top([0, 0.4, -0.3]) },
    screen: { heading: 'Lore Library', sub: `${bookstagram.account?.name ?? 'Bookstagram'} · ${booksRead} books read` },
    hotspots: [{
      id: 'library-stack',
      label: 'Open: The Unread Stack',
      anchor: top([-1.2, 1.0, 0.8]), // on top of the front book stack
      content: {
        title: bookstagram.account?.name ?? 'The Unread Stack',
        lines: [
          bookstagram.summary,
          [
            `${booksRead} books read`,
            bookstagram.reels && `${bookstagram.reels.count} reels`,
            bookstagram.reels && `${fmtIN(bookstagram.reels.views)} views (${bookstagram.reels.asOf})`,
          ].filter(Boolean).join(' · '),
        ],
        ...(bookstagram.account ? { link: { href: bookstagram.account.url, label: `${bookstagram.account.handle} on Instagram ▶` } } : {}),
      },
    }],
  },
  ...LIBRARY_SHELVES.map((shelf, si): RideChapter => {
    const books = LIBRARY_BOOKS.filter((b) => b.shelf === si);
    return {
      id: shelf.id,
      label: shelf.label,
      ...shelfCam(si),
      screen: {
        heading: shelf.heading,
        sub: shelf.sub ?? [...new Set(books.map((b) => b.author))].join(' · '),
        groups: [{ title: 'On this shelf', items: books.map((b) => (b.rating !== undefined ? `${b.title} · ${ratingText(b.rating)}` : b.title)) }],
      },
      hotspots: books.map(bookHotspot),
    };
  }),
  {
    id: 'ring',
    label: 'The Ring',
    camera: { position: top([2.75, 2.05, 3.6]), target: top([1.75, 1.3, 0.5]) },
    cameraPortrait: { position: top([2.0, 2.6, 5.2]), target: top([1.2, 0.95, 0.5]) },
    screen: { heading: 'One ring', sub: 'The Lord of the Rings' },
    hotspots: [{
      id: 'library-ring',
      label: 'Open: the ring',
      anchor: top([LIBRARY_RING.to[0] + 0.42, LIBRARY_RING.to[1], LIBRARY_RING.to[2]]), // just right of the ring
      content: { title: 'The Ring', lines: [ringFact] },
    }],
  },
  {
    id: 'clear',
    label: 'Stage clear · Currently reading',
    // centred, aimed low so the gazebo and its ring of books sit above STAGE CLEAR
    camera: { position: top([0.4, 7.4, 15.2]), target: top([0, 1.5, -0.5]) },
    cameraPortrait: { position: top([0, 8.4, 17.5]), target: top([0, 1.6, -0.5]) },
    // no panel here: on phones it would sit under STAGE CLEAR; the "?" holds what's on the nightstand
    hotspots: [{
      id: 'library-now',
      label: 'Open: currently reading',
      anchor: top([1.2, 1.05, 0.5]), // the open book (where the ring rests)
      content: { title: 'Currently reading', lines: [...nowReading, `Genres: ${bookstagram.genres.join(', ')}`] },
    }],
  },
];
if (libraryChapters.length !== LIBRARY_CHAPTERS) throw new Error('worldRides: Lore Library chapter count is off');


// WORLD 5: LORE LIBRARY: fairy lights switch on one by one; shelf by shelf the books lift
// off the stacks, open and flip their pages, then join a ring above the gazebo; the LOTR ring moment.
export const ride: WorldRide = {
  islandId: 'bookstagram',
  slug: 'library',
  pages: 11,
  chapters: libraryChapters,
};
