import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { ORIGIN_PAGES, ORIGIN_STOPS, type OriginPage } from '../../../../data/worldRides';

/**
 * Canvas textures for World 1: the chapter pages and the city labels on the map.
 * Drawn once when the ride opens (and again when the pixel font finishes loading).
 * The text is decoration: the readable version is always in the side panel.
 */

const INK = '#3b1d0a';
const RED_INK = '#9f1239';
const PAPER = '#fdf0cf';
const PIXEL = '"Press Start 2P", "Courier New", monospace';
const MONO = '"JetBrains Mono", ui-monospace, Consolas, monospace';

export const PAGE_TEX_W = 512;
export const PAGE_TEX_H = 708; // same shape as a page (3.25 × 4.5)

function drawPage(ctx: CanvasRenderingContext2D, page: OriginPage) {
  const w = PAGE_TEX_W;
  const h = PAGE_TEX_H;
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  // aged edges
  const g = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.75);
  g.addColorStop(0, 'rgba(180,120,40,0)');
  g.addColorStop(1, 'rgba(180,120,40,0.28)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // double ink frame
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, w - 56, h - 56);
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, w - 80, h - 80);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = RED_INK;
  ctx.font = `20px ${PIXEL}`;
  ctx.fillText(page.kicker.toUpperCase(), w / 2, 92);

  ctx.fillStyle = INK;
  const title = page.title.toUpperCase();
  const size = title.length > 12 ? 22 : title.length > 8 ? 28 : 34;
  ctx.font = `${size}px ${PIXEL}`;
  // wrap long titles on the space nearest the middle
  const words = title.split(' ');
  const lines: string[] = [];
  if (ctx.measureText(title).width > w - 110 && words.length > 1) {
    const mid = Math.ceil(words.length / 2);
    lines.push(words.slice(0, mid).join(' '), words.slice(mid).join(' '));
  } else lines.push(title);
  let y = 150;
  for (const l of lines) { ctx.fillText(l, w / 2, y); y += size * 1.6; }

  // pixel divider
  y += 18;
  ctx.fillStyle = RED_INK;
  for (let x = w / 2 - 90; x <= w / 2 + 90; x += 20) ctx.fillRect(x - 5, y, 10, 10);
  y += 50;

  ctx.fillStyle = INK;
  const gap = Math.min(70, (h - 80 - y) / Math.max(1, page.lines.length));
  for (const l of page.lines) {
    // shrink long lines to fit inside the frame
    let size = 30;
    ctx.font = `bold ${size}px ${MONO}`;
    while (size > 16 && ctx.measureText(l).width > w - 160) { size -= 2; ctx.font = `bold ${size}px ${MONO}`; }
    ctx.fillText(l, w / 2, y);
    y += gap;
  }
}

function drawLabel(ctx: CanvasRenderingContext2D, text: string, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.font = `22px ${PIXEL}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  // paper "halo" so the label reads over the route and the outline
  ctx.lineWidth = 8;
  ctx.strokeStyle = 'rgba(253,240,207,0.95)';
  ctx.strokeText(text, w / 2, h / 2 + 2);
  ctx.fillStyle = INK;
  ctx.fillText(text, w / 2, h / 2 + 2);
}

const LABEL_H = 40;
const labelWidth = (text: string) => 28 + text.length * 22;

export interface LabelTexture { texture: THREE.CanvasTexture; aspect: number }

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/** Page textures (one per entry in ORIGIN_PAGES) and map labels (one per stop). */
export function useOriginTextures() {
  const made = useMemo(() => {
    const pages = ORIGIN_PAGES.map((page) => {
      const canvas = makeCanvas(PAGE_TEX_W, PAGE_TEX_H);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      return { page, canvas, tex };
    });
    const labels = ORIGIN_STOPS.map((s) => {
      const text = s.name.toUpperCase();
      const canvas = makeCanvas(labelWidth(text), LABEL_H);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return { text, canvas, tex };
    });
    const draw = () => {
      pages.forEach(({ page, canvas, tex }) => { const ctx = canvas.getContext('2d'); if (ctx) { drawPage(ctx, page); tex.needsUpdate = true; } });
      labels.forEach(({ text, canvas, tex }) => { const ctx = canvas.getContext('2d'); if (ctx) { drawLabel(ctx, text, canvas.width, canvas.height); tex.needsUpdate = true; } });
    };
    draw();
    return { pages, labels, draw };
  }, []);

  useEffect(() => {
    let alive = true;
    // Redraw once the pixel fonts are ready (the first draw may have used the fallback font).
    Promise.all([document.fonts.load(`20px ${PIXEL}`), document.fonts.load(`bold 30px ${MONO}`)])
      .catch(() => undefined)
      .then(() => { if (alive) made.draw(); });
    return () => {
      alive = false;
      made.pages.forEach((p) => p.tex.dispose());
      made.labels.forEach((l) => l.tex.dispose());
    };
  }, [made]);

  return {
    pages: made.pages.map((p) => p.tex),
    labels: made.labels.map((l): LabelTexture => ({ texture: l.tex, aspect: l.canvas.width / l.canvas.height })),
  };
}
