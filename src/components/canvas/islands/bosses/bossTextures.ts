import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { BOSSES } from '../../../../data/worldRides';

/**
 * Canvas textures for World 3: boss name tags, DEFEATED / CLEARED + LOOT banners,
 * the countdown and the "MORE COMING" orbit sign. Pixel font, drawn once when the ride
 * opens and again once the font has loaded. Decoration only: the readable text is in the
 * side panel and the "?" info boxes.
 */

const PIXEL = '"Press Start 2P", "Courier New", monospace';
const BG = 'rgba(11,11,26,0.92)';
const PINK = '#ff2e88';
const CYAN = '#00f0ff';
const YELLOW = '#ffe600';
const TEXT = '#e8e8f5';

export interface TextTex { texture: THREE.CanvasTexture; aspect: number }

function makeTex(w: number, h: number) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return { canvas, texture };
}

/** Largest font size (≤ max) at which `text` fits in `width` */
function fit(ctx: CanvasRenderingContext2D, text: string, width: number, max: number, min = 12) {
  let size = max;
  ctx.font = `${size}px ${PIXEL}`;
  while (size > min && ctx.measureText(text).width > width) { size -= 1; ctx.font = `${size}px ${PIXEL}`; }
  return size;
}

function frame(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = BG;
  ctx.fillRect(4, 4, w - 8, h - 8);
  ctx.fillStyle = color;
  // pixel border with notched corners
  ctx.fillRect(8, 0, w - 16, 4); ctx.fillRect(8, h - 4, w - 16, 4);
  ctx.fillRect(0, 8, 4, h - 16); ctx.fillRect(w - 4, 8, 4, h - 16);
}

const NAME_W = 512, NAME_H = 64;
function drawName(ctx: CanvasRenderingContext2D, text: string) {
  frame(ctx, NAME_W, NAME_H, PINK);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fit(ctx, text.toUpperCase(), NAME_W - 40, 24);
  ctx.fillStyle = TEXT;
  ctx.fillText(text.toUpperCase(), NAME_W / 2, NAME_H / 2 + 2);
}

const BANNER_W = 512;
const bannerH = (loot: string[] | null) => 72 + (loot ? loot.length * 40 + 8 : 0);
function drawBanner(ctx: CanvasRenderingContext2D, loot: string[] | null) {
  const h = bannerH(loot);
  const color = loot ? PINK : CYAN;
  frame(ctx, BANNER_W, h, color);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `30px ${PIXEL}`;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fillStyle = color;
  ctx.fillText(loot ? 'DEFEATED!' : 'CLEARED', BANNER_W / 2, 40);
  ctx.shadowBlur = 0;
  loot?.forEach((line, i) => {
    const text = i === 0 ? `LOOT: ${line}` : line;
    fit(ctx, text, BANNER_W - 40, 20);
    ctx.fillStyle = YELLOW;
    ctx.fillText(text, BANNER_W / 2, 92 + i * 40);
  });
}

const COUNT_W = 512, COUNT_H = 160;
export function drawCountdown(ctx: CanvasRenderingContext2D, text: string) {
  ctx.clearRect(0, 0, COUNT_W, COUNT_H);
  if (!text) return;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fit(ctx, text, COUNT_W - 30, text.length > 2 ? 52 : 110);
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#0b0b1a';
  ctx.strokeText(text, COUNT_W / 2, COUNT_H / 2 + 4);
  ctx.shadowColor = PINK;
  ctx.shadowBlur = 18;
  ctx.fillStyle = text.length > 2 ? YELLOW : PINK;
  ctx.fillText(text, COUNT_W / 2, COUNT_H / 2 + 4);
  ctx.shadowBlur = 0;
}

const SIGN_W = 1024, SIGN_H = 224;
function drawSign(ctx: CanvasRenderingContext2D, sub: string) {
  frame(ctx, SIGN_W, SIGN_H, PINK);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `72px ${PIXEL}`;
  ctx.shadowColor = PINK;
  ctx.shadowBlur = 20;
  ctx.fillStyle = PINK;
  ctx.fillText('MORE COMING', SIGN_W / 2, 92);
  ctx.shadowBlur = 0;
  fit(ctx, sub, SIGN_W - 80, 28);
  ctx.fillStyle = YELLOW;
  ctx.fillText(sub, SIGN_W / 2, 172);
}

export function useBossTextures(signSub: string) {
  const made = useMemo(() => {
    const names = BOSSES.map((b) => ({ b, ...makeTex(NAME_W, NAME_H) }));
    const banners = BOSSES.map((b) => ({ b, ...makeTex(BANNER_W, bannerH(b.loot)) }));
    const countdown = makeTex(COUNT_W, COUNT_H);
    const sign = makeTex(SIGN_W, SIGN_H);
    let countText = '';
    const draw = () => {
      names.forEach(({ b, canvas, texture }) => { const c = canvas.getContext('2d'); if (c) { drawName(c, b.short); texture.needsUpdate = true; } });
      banners.forEach(({ b, canvas, texture }) => { const c = canvas.getContext('2d'); if (c) { drawBanner(c, b.loot); texture.needsUpdate = true; } });
      const s = sign.canvas.getContext('2d');
      if (s) { drawSign(s, signSub); sign.texture.needsUpdate = true; }
      setCount(countText, true);
    };
    /** Redraws the countdown only when its text changes */
    const setCount = (text: string, force = false) => {
      if (text === countText && !force) return;
      countText = text;
      const c = countdown.canvas.getContext('2d');
      if (c) { drawCountdown(c, text); countdown.texture.needsUpdate = true; }
    };
    draw();
    return { names, banners, countdown, sign, draw, setCount };
  }, [signSub]);

  useEffect(() => {
    let alive = true;
    document.fonts.load(`24px ${PIXEL}`).catch(() => undefined).then(() => { if (alive) made.draw(); });
    return () => {
      alive = false;
      made.names.forEach((t) => t.texture.dispose());
      made.banners.forEach((t) => t.texture.dispose());
      made.countdown.texture.dispose();
      made.sign.texture.dispose();
    };
  }, [made]);

  const tex = (t: { canvas: HTMLCanvasElement; texture: THREE.CanvasTexture }): TextTex => ({ texture: t.texture, aspect: t.canvas.width / t.canvas.height });
  return {
    names: made.names.map(tex),
    banners: made.banners.map(tex),
    countdown: tex(made.countdown),
    sign: tex(made.sign),
    setCount: made.setCount,
  };
}
