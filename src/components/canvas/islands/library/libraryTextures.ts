import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { LIBRARY_BOOKS, ratingText, type LibraryBookInfo } from '../../../../data/rides/libraryLayout';

/**
 * Canvas textures for World 5: the two inside pages of every book
 * (left: title + author, right: star rating, genre, badge), and a soft gold halo for the ring.
 * Drawn once when the ride opens and again once the fonts have loaded. Decoration only:
 * the readable text is in the side panel and the "?" info boxes.
 */

const PIXEL = '"Press Start 2P", "Courier New", monospace';
const BODY = '"VT323", "Courier New", monospace';
const PAPER = '#f3e9d2';
const INK = '#2a1d3d';
const PURPLE = '#7c3aed';
const GOLD = '#d99a06';
const W = 256, H = 352;

function makeTex() {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return { canvas, texture };
}

/** Split text into lines that fit `width` at the current font */
function wrap(ctx: CanvasRenderingContext2D, text: string, width: number) {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > width && line) { lines.push(line); line = w; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function paper(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  // faint ruled lines, like a reading journal
  ctx.fillStyle = 'rgba(124,58,237,0.10)';
  for (let y = 40; y < H - 20; y += 22) ctx.fillRect(18, y, W - 36, 2);
}

function drawLeft(ctx: CanvasRenderingContext2D, b: LibraryBookInfo) {
  paper(ctx);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  let size = 18;
  let lines: string[] = [];
  // largest pixel-font size at which the title fits in 5 lines
  for (; size >= 10; size -= 1) {
    ctx.font = `${size}px ${PIXEL}`;
    lines = wrap(ctx, b.title.toUpperCase(), W - 40);
    if (lines.length <= 5) break;
  }
  const lh = size * 1.5;
  let y = 70 - (lines.length - 1) * 4;
  ctx.fillStyle = INK;
  for (const l of lines) { ctx.fillText(l, W / 2, y); y += lh; }
  ctx.fillStyle = PURPLE;
  ctx.fillRect(W / 2 - 40, y + 10, 80, 4);
  ctx.font = `30px ${BODY}`;
  ctx.fillStyle = INK;
  wrap(ctx, b.author, W - 40).forEach((l, i) => ctx.fillText(l, W / 2, y + 28 + i * 28));
}

function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.45;
    ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
  }
  ctx.closePath();
}

function drawRight(ctx: CanvasRenderingContext2D, b: LibraryBookInfo) {
  paper(ctx);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const r = 19, gap = 44, x0 = W / 2 - gap * 2, cy = 92;
  const rating = b.rating ?? 0;
  for (let i = 0; i < 5; i++) {
    const cx = x0 + i * gap;
    const fill = Math.min(1, Math.max(0, rating - i));
    star(ctx, cx, cy, r);
    ctx.lineWidth = 3;
    ctx.strokeStyle = GOLD;
    ctx.stroke();
    if (fill > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(cx - r, cy - r, 2 * r * fill, 2 * r);
      ctx.clip();
      star(ctx, cx, cy, r);
      ctx.fillStyle = GOLD;
      ctx.fill();
      ctx.restore();
    }
  }
  ctx.fillStyle = INK;
  ctx.font = `22px ${PIXEL}`;
  ctx.fillText(b.rating !== undefined ? ratingText(b.rating) : '', W / 2, 136);
  ctx.font = `30px ${BODY}`;
  wrap(ctx, b.genre, W - 40).forEach((l, i) => ctx.fillText(l, W / 2, 190 + i * 28));
  if (b.badge) {
    ctx.font = `11px ${PIXEL}`;
    const lines = wrap(ctx, b.badge.toUpperCase(), W - 60);
    const h = lines.length * 18 + 16;
    const y = H - 40 - h;
    ctx.fillStyle = PURPLE;
    ctx.fillRect(20, y, W - 40, h);
    ctx.fillStyle = '#ffffff';
    lines.forEach((l, i) => ctx.fillText(l, W / 2, y + 10 + i * 18));
  }
}

function drawHalo(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(255,214,90,0.95)');
  g.addColorStop(0.35, 'rgba(255,180,40,0.45)');
  g.addColorStop(1, 'rgba(255,160,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
}

export interface LibraryTextures {
  pages: { left: THREE.CanvasTexture; right: THREE.CanvasTexture }[];
  halo: THREE.CanvasTexture;
}

/** Textures for every book (same order as LIBRARY_BOOKS). Only built while the ride is open. */
export function useLibraryTextures(enabled: boolean): LibraryTextures | null {
  const made = useMemo(() => {
    if (!enabled) return null;
    const pages = LIBRARY_BOOKS.map((b) => {
      const left = makeTex();
      const right = makeTex();
      return { b, left, right };
    });
    const haloCanvas = document.createElement('canvas');
    haloCanvas.width = haloCanvas.height = 256;
    drawHalo(haloCanvas);
    const halo = new THREE.CanvasTexture(haloCanvas);
    halo.colorSpace = THREE.SRGBColorSpace;
    return { pages, halo };
  }, [enabled]);

  useEffect(() => {
    if (!made) return;
    const draw = () => {
      for (const p of made.pages) {
        drawLeft(p.left.canvas.getContext('2d')!, p.b);
        drawRight(p.right.canvas.getContext('2d')!, p.b);
        p.left.texture.needsUpdate = true;
        p.right.texture.needsUpdate = true;
      }
    };
    draw();
    let alive = true;
    document.fonts?.ready.then(() => { if (alive) draw(); });
    return () => {
      alive = false;
      made.pages.forEach((p) => { p.left.texture.dispose(); p.right.texture.dispose(); });
      made.halo.dispose();
    };
  }, [made]);

  return useMemo(
    () => (made ? { pages: made.pages.map((p) => ({ left: p.left.texture, right: p.right.texture })), halo: made.halo } : null),
    [made],
  );
}
