import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { QUEST_SCENES, QUEST_STRIP } from '../../../../data/worldRides';

/**
 * Pixel-art canvas textures for World 4 (Side Quests): the side-scroller strip
 * (sky, ground and the four scenes), pixel Divyanshu (two walk frames), the shuttlecock,
 * the portal swirl, and the arcade cabinet's screen (start / clear).
 * Drawn small and shown with nearest-neighbour filtering, so the pixels stay crisp.
 */

const PIXEL = '"Press Start 2P", "Courier New", monospace';
export const STRIP_PPU = 64; // canvas pixels per island unit
const { x0, x1, y0, y1, ground } = QUEST_STRIP;
const SW = Math.round((x1 - x0) * STRIP_PPU);
const SH = Math.round((y1 - y0) * STRIP_PPU);
const X = (sx: number) => Math.round((sx - x0) * STRIP_PPU);
const Y = (sy: number) => Math.round((y1 - sy) * STRIP_PPU);
const GY = Y(ground);

const SKIN = '#c68863', HAIR = '#1b1b1b', JEANS = '#2b4c9a', GREEN = '#39ff14';

function seeded(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function rect(ctx: CanvasRenderingContext2D, color: string, sx: number, sy: number, w: number, h: number) {
  ctx.fillStyle = color;
  ctx.fillRect(X(sx), Y(sy + h), Math.round(w * STRIP_PPU), Math.round(h * STRIP_PPU));
}

function sign(ctx: CanvasRenderingContext2D, sx: number, text: string) {
  ctx.font = `7px ${PIXEL}`;
  const w = ctx.measureText(text).width + 12;
  const x = X(sx) - w / 2, y = Y(0.98);
  ctx.fillStyle = '#5b3a1e';
  ctx.fillRect(X(sx) - 2, y + 14, 4, GY - y - 14); // post
  ctx.fillStyle = '#000';
  ctx.fillRect(x + 2, y + 2, w, 16);
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(x, y, w, 16);
  ctx.fillStyle = '#ffe600';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, X(sx), y + 9);
}

/** Pixel person (side view, facing right), 12×22 "pixels" of size k, drawn at (x, feetY) in canvas pixels */
function person(ctx: CanvasRenderingContext2D, x: number, feetY: number, shirt: string, step: 0 | 1, flip = false, k = 1) {
  const p = (dx: number, dy: number, w: number, h: number, c: string) => {
    ctx.fillStyle = c;
    const fx = flip ? x + (12 - dx - w) * k : x + dx * k;
    ctx.fillRect(fx, feetY + (dy - 22) * k, w * k, h * k);
  };
  p(3, 0, 6, 2, HAIR); p(2, 2, 2, 3, HAIR); // hair
  p(4, 2, 5, 5, SKIN); p(8, 4, 1, 1, '#000'); // face + eye
  p(3, 7, 6, 7, shirt); // shirt
  p(9, 8, 2, 4, SKIN); // arm
  p(10, 4, 1, 5, '#ddd'); p(10, 1, 2, 3, '#eee'); // racket
  if (step === 0) { p(3, 14, 2, 8, JEANS); p(7, 14, 2, 8, JEANS); }
  else { p(2, 14, 2, 7, JEANS); p(8, 14, 2, 7, JEANS); p(1, 21, 3, 1, '#222'); p(8, 21, 3, 1, '#222'); }
  if (step === 0) { p(3, 21, 3, 1, '#222'); p(7, 21, 3, 1, '#222'); }
}

function drawStrip(ctx: CanvasRenderingContext2D) {
  ctx.imageSmoothingEnabled = false;
  // sky
  const g = ctx.createLinearGradient(0, 0, 0, GY);
  g.addColorStop(0, '#0e0824');
  g.addColorStop(1, '#2a0c40');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SW, SH);
  const rnd = seeded(42);
  for (let i = 0; i < 140; i++) {
    ctx.fillStyle = rnd() > 0.85 ? '#ffe600' : '#cfd6ff';
    ctx.fillRect(Math.floor(rnd() * SW), Math.floor(rnd() * (GY - 60)), 2, 2);
  }
  // far hills
  ctx.fillStyle = '#1d0f38';
  for (let x = 0; x < SW; x += 4) {
    const h = 26 + Math.round(Math.sin(x * 0.011) * 14 + Math.sin(x * 0.031) * 8);
    ctx.fillRect(x, GY - h, 4, h);
  }
  // ground: grass + bricks
  ctx.fillStyle = '#4a2c17';
  ctx.fillRect(0, GY, SW, SH - GY);
  ctx.fillStyle = '#5e3a1f';
  for (let y = GY + 10; y < SH; y += 10) for (let x = (y / 10) % 2 ? 0 : 10; x < SW; x += 20) ctx.fillRect(x, y, 18, 8);
  ctx.fillStyle = '#2fbf2a';
  ctx.fillRect(0, GY, SW, 6);
  ctx.fillStyle = GREEN;
  for (let x = 0; x < SW; x += 6) ctx.fillRect(x, GY - (x % 12 ? 0 : 2), 4, 2);

  const [court, booth, portal] = QUEST_SCENES.map((s) => s.sx);

  // --- badminton court ---
  rect(ctx, '#1f6f3a', court - 1.2, ground, 2.9, 0.06);
  rect(ctx, '#ffffff', court - 1.2, ground + 0.05, 2.9, 0.015);
  rect(ctx, '#cfcfcf', court + 0.22, ground, 0.04, 0.42); // net post
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  for (let y = Y(ground + 0.4); y < Y(ground + 0.12); y += 3) ctx.fillRect(X(court + 0.26), y, 2, 1);
  rect(ctx, '#ffffff', court + 0.26, ground + 0.38, 0.03, 0.03);
  person(ctx, X(court + 1.0), GY, '#ff2e88', 0, true, 2); // the other player (same size as pixel-you)
  // trophy: 2nd place
  rect(ctx, '#c0c0c0', court + 1.6, ground + 0.12, 0.16, 0.14);
  rect(ctx, '#8a8a8a', court + 1.64, ground, 0.08, 0.12);
  ctx.fillStyle = '#000';
  ctx.font = `7px ${PIXEL}`;
  ctx.textAlign = 'center';
  ctx.fillText('2', X(court + 1.68), Y(ground + 0.18));
  sign(ctx, court + 0.55, 'BADMINTON COURT');

  // --- recording booth ---
  rect(ctx, '#3b1d6e', booth - 0.4, ground, 1.9, 1.35);
  ctx.fillStyle = '#2c1456';
  for (let y = Y(ground + 1.3); y < GY; y += 8) for (let x = X(booth - 0.38) + ((y / 8) % 2 ? 4 : 0); x < X(booth + 1.45); x += 8) ctx.fillRect(x, y, 4, 4);
  rect(ctx, '#ff1744', booth + 0.95, ground + 1.05, 0.42, 0.16);
  ctx.fillStyle = '#fff';
  ctx.font = `7px ${PIXEL}`;
  ctx.fillText('ON AIR', X(booth + 1.16), Y(ground + 1.11));
  rect(ctx, '#9e9e9e', booth + 0.28, ground, 0.03, 0.62); // mic stand
  rect(ctx, '#616161', booth + 0.2, ground, 0.2, 0.03);
  rect(ctx, '#424242', booth + 0.24, ground + 0.62, 0.11, 0.16); // mic
  rect(ctx, '#bdbdbd', booth + 0.25, ground + 0.7, 0.09, 0.07);
  // guitar
  ctx.fillStyle = '#b45309';
  ctx.beginPath(); ctx.ellipse(X(booth + 1.25), Y(ground + 0.18), 12, 13, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(X(booth + 1.25), Y(ground + 0.42), 9, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(X(booth + 1.25) - 3, Y(ground + 0.3) - 3, 6, 6);
  rect(ctx, '#451a03', booth + 1.235, ground + 0.5, 0.03, 0.45);
  sign(ctx, booth + 0.55, 'RECORDING BOOTH');

  // --- portal to the Lore Library ---
  for (const dx of [-0.35, 1.3]) {
    rect(ctx, '#4c1d95', portal + dx, ground, 0.35, 1.0);
    for (let k = 0; k < 4; k++) {
      const cols = ['#ec4899', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
      for (let b = 0; b < 4; b++) rect(ctx, cols[(k + b + (dx > 0 ? 2 : 0)) % 5], portal + dx + 0.04 + b * 0.075, ground + 0.06 + k * 0.24, 0.06, 0.17);
    }
  }
  rect(ctx, '#6b6b8f', portal + 0.05, ground, 0.12, 1.15);
  rect(ctx, '#6b6b8f', portal + 1.1, ground, 0.12, 1.15);
  rect(ctx, '#6b6b8f', portal + 0.05, ground + 1.08, 1.17, 0.14);
  rect(ctx, '#140a2c', portal + 0.17, ground, 0.93, 1.08);
  sign(ctx, portal + 0.62, 'LORE LIBRARY ▶');
}

function makeTex(w: number, h: number) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  return { canvas, texture, ctx: canvas.getContext('2d')! };
}

function drawPortal(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, 64, 64);
  const cols = ['#9d4dff', '#ff2e88', '#00f0ff', '#9d4dff', '#ffe600'];
  for (let r = 30, i = 0; r > 4; r -= 5, i++) {
    ctx.strokeStyle = cols[i % cols.length];
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(32, 32, r, i * 0.7, i * 0.7 + Math.PI * 1.5); ctx.stroke();
  }
}

function drawScreen(ctx: CanvasRenderingContext2D, lines: string[], color: string) {
  ctx.fillStyle = '#04120a';
  ctx.fillRect(0, 0, 160, 120);
  ctx.fillStyle = 'rgba(57,255,20,0.08)';
  for (let y = 0; y < 120; y += 3) ctx.fillRect(0, y, 160, 1);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.font = `14px ${PIXEL}`;
  lines.forEach((l, i) => ctx.fillText(l, 80, 60 + (i - (lines.length - 1) / 2) * 26));
}

export interface QuestTextures {
  strip: THREE.CanvasTexture;
  you: [THREE.CanvasTexture, THREE.CanvasTexture];
  shuttle: THREE.CanvasTexture;
  portal: THREE.CanvasTexture;
  screenStart: THREE.CanvasTexture;
  screenClear: THREE.CanvasTexture;
}

/** Only built while the ride is open. */
export function useQuestTextures(enabled: boolean): QuestTextures | null {
  const made = useMemo(() => {
    if (!enabled) return null;
    return {
      strip: makeTex(SW, SH),
      you: [makeTex(12, 22), makeTex(12, 22)] as const,
      shuttle: makeTex(8, 8),
      portal: makeTex(64, 64),
      screenStart: makeTex(160, 120),
      screenClear: makeTex(160, 120),
    };
  }, [enabled]);

  useEffect(() => {
    if (!made) return;
    const draw = () => {
      drawStrip(made.strip.ctx);
      made.you.forEach((t, i) => { t.ctx.clearRect(0, 0, 12, 22); person(t.ctx, 0, 22, GREEN, i as 0 | 1); });
      const s = made.shuttle.ctx;
      s.clearRect(0, 0, 8, 8); s.fillStyle = '#fff'; s.fillRect(1, 2, 4, 4); s.fillStyle = '#ff9800'; s.fillRect(5, 3, 2, 2);
      drawPortal(made.portal.ctx);
      drawScreen(made.screenStart.ctx, ['SIDE', 'QUESTS', 'PRESS ▼'], '#39ff14');
      drawScreen(made.screenClear.ctx, ['ALL', 'QUESTS', 'CLEAR!'], '#ffe600');
      Object.values(made).flat().forEach((t) => { (t as { texture: THREE.CanvasTexture }).texture.needsUpdate = true; });
    };
    draw();
    let alive = true;
    document.fonts?.ready.then(() => { if (alive) draw(); });
    return () => {
      alive = false;
      Object.values(made).flat().forEach((t) => (t as { texture: THREE.CanvasTexture }).texture.dispose());
    };
  }, [made]);

  return useMemo(() => (made ? {
    strip: made.strip.texture,
    you: [made.you[0].texture, made.you[1].texture],
    shuttle: made.shuttle.texture,
    portal: made.portal.texture,
    screenStart: made.screenStart.texture,
    screenClear: made.screenClear.texture,
  } : null), [made]);
}
