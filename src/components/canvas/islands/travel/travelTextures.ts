import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { TRAVEL_MAP, TRAVEL_STAMPS, VIETNAM_STOPS, type TravelStampInfo } from '../../../../data/rides/explorer';
import { INDIA } from '../origin/india';

/**
 * Canvas textures for World 6: the parchment map (India + Vietnam, hand-drawn style)
 * and one passport stamp per trip. Drawn when the ride opens and again once fonts load.
 * Decoration only: the readable text is in the side panel and the "?" info boxes.
 */

const PIXEL = '"Press Start 2P", "Courier New", monospace';
const BODY = '"VT323", "Courier New", monospace';

// Simplified outlines (lon, lat), stylised on purpose
const VIETNAM: [number, number][] = [
  [102.1, 22.4], [103.0, 22.8], [104.0, 22.8], [105.3, 23.3], [106.7, 22.9], [108.0, 21.6], [106.7, 20.7],
  [106.0, 19.9], [105.7, 19.0], [106.6, 17.9], [107.4, 16.8], [108.3, 16.0], [108.9, 15.2], [109.3, 13.8],
  [109.2, 12.5], [109.1, 11.6], [108.4, 11.0], [107.2, 10.4], [106.4, 9.5], [105.1, 8.6], [104.8, 9.6],
  [104.9, 10.4], [106.2, 10.9], [107.5, 12.0], [107.6, 13.5], [107.4, 14.5], [107.6, 15.5], [106.6, 16.4],
  [105.6, 17.6], [104.9, 18.3], [104.0, 19.3], [104.2, 20.0], [103.2, 20.8], [102.5, 21.6], [102.1, 22.4],
];
const SRI_LANKA: [number, number][] = [
  [79.9, 9.8], [80.8, 9.3], [81.4, 8.4], [81.9, 7.3], [81.6, 6.4], [80.6, 5.9], [80.0, 6.5], [79.8, 7.6], [79.9, 9.8],
];

const MAP_W = 1024;
const MAP_H = Math.round(MAP_W * ((TRAVEL_MAP.latSpan[1] - TRAVEL_MAP.latSpan[0]) / (TRAVEL_MAP.lonSpan[1] - TRAVEL_MAP.lonSpan[0])));
const px = (lon: number) => ((lon - TRAVEL_MAP.lonSpan[0]) / (TRAVEL_MAP.lonSpan[1] - TRAVEL_MAP.lonSpan[0])) * MAP_W;
const py = (lat: number) => ((TRAVEL_MAP.latSpan[1] - lat) / (TRAVEL_MAP.latSpan[1] - TRAVEL_MAP.latSpan[0])) * MAP_H;

function land(ctx: CanvasRenderingContext2D, pts: [number, number][]) {
  ctx.beginPath();
  pts.forEach(([lon, lat], i) => (i ? ctx.lineTo(px(lon), py(lat)) : ctx.moveTo(px(lon), py(lat))));
  ctx.closePath();
  ctx.fillStyle = '#e9d6a6';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#6b4a2b';
  ctx.stroke();
}

function drawMap(ctx: CanvasRenderingContext2D) {
  // sea
  ctx.fillStyle = '#b9d3cf';
  ctx.fillRect(0, 0, MAP_W, MAP_H);
  // faint lat/lon grid
  ctx.strokeStyle = 'rgba(60,90,90,0.18)';
  ctx.lineWidth = 2;
  for (let lon = 70; lon < 112; lon += 10) { ctx.beginPath(); ctx.moveTo(px(lon), 0); ctx.lineTo(px(lon), MAP_H); ctx.stroke(); }
  for (let lat = 10; lat < 38; lat += 10) { ctx.beginPath(); ctx.moveTo(0, py(lat)); ctx.lineTo(MAP_W, py(lat)); ctx.stroke(); }
  // little waves
  ctx.fillStyle = 'rgba(60,110,120,0.35)';
  for (const [lon, lat] of [[86, 14], [90, 11], [70, 12], [96, 8], [101, 13], [68, 17], [110, 17], [94, 15]]) {
    const x = px(lon), y = py(lat);
    ctx.fillRect(x, y, 14, 3); ctx.fillRect(x + 18, y - 4, 14, 3);
  }
  land(ctx, INDIA);
  land(ctx, SRI_LANKA);
  land(ctx, VIETNAM);
  // country names
  ctx.fillStyle = 'rgba(107,74,43,0.55)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `30px ${PIXEL}`;
  ctx.fillText('INDIA', px(79.5), py(21.5));
  ctx.font = `18px ${PIXEL}`;
  ctx.fillText('VIETNAM', px(106.5), py(25.2));
  // Northern Vietnam's own stops
  ctx.font = `24px ${BODY}`;
  ctx.textAlign = 'left';
  for (const s of VIETNAM_STOPS) {
    ctx.fillStyle = '#6b4a2b';
    ctx.fillRect(px(s.lonLat[0]) - 4, py(s.lonLat[1]) - 4, 8, 8);
    ctx.fillText(s.name, px(s.lonLat[0]) - 70, py(s.lonLat[1]) + (s.name === 'Ha Giang' ? -16 : 16));
  }
  // compass + title cartouche
  const cx = px(70.5), cy = py(9.5);
  ctx.fillStyle = '#6b4a2b';
  ctx.beginPath(); ctx.moveTo(cx, cy - 46); ctx.lineTo(cx + 12, cy); ctx.lineTo(cx - 12, cy); ctx.closePath(); ctx.fill();
  ctx.font = `20px ${PIXEL}`;
  ctx.textAlign = 'center';
  ctx.fillText('N', cx, cy - 62);
  ctx.fillStyle = 'rgba(255,230,0,0.9)';
  ctx.fillRect(px(96), py(35.6), px(110.5) - px(96), 54);
  ctx.fillStyle = '#2a1d0e';
  ctx.font = `20px ${PIXEL}`;
  ctx.fillText('MAP EXPLORER', (px(96) + px(110.5)) / 2, py(35.6) + 28);
  // worn paper edge
  ctx.strokeStyle = '#6b4a2b';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, MAP_W - 10, MAP_H - 10);
}

const STAMP = 256;
function drawStamp(ctx: CanvasRenderingContext2D, s: TravelStampInfo) {
  ctx.clearRect(0, 0, STAMP, STAMP);
  const c = STAMP / 2;
  ctx.strokeStyle = s.ink;
  ctx.fillStyle = s.ink;
  ctx.lineWidth = 10;
  ctx.beginPath(); ctx.arc(c, c, 112, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(c, c, 92, 0, Math.PI * 2); ctx.stroke();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `16px ${PIXEL}`;
  ctx.fillText(s.country.toUpperCase(), c, c - 58);
  // city: largest size that fits, up to 2 lines
  const words = s.city.toUpperCase().split(' ');
  const lines = words.length > 2 ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : words.length === 2 && s.city.length > 10 ? words : [s.city.toUpperCase()];
  let size = 26;
  ctx.font = `${size}px ${PIXEL}`;
  while (size > 12 && lines.some((l) => ctx.measureText(l).width > 150)) { size -= 1; ctx.font = `${size}px ${PIXEL}`; }
  const lh = size * 1.3;
  lines.forEach((l, i) => ctx.fillText(l, c, c - ((lines.length - 1) * lh) / 2 + i * lh));
  ctx.font = `16px ${PIXEL}`;
  ctx.fillText(s.year ?? '★ VISITED ★', c, c + 60);
  // worn ink: knock out a few pixels
  ctx.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 160; i++) {
    const a = (i * 2.399) % (Math.PI * 2);
    const r = 20 + ((i * 37) % 100);
    ctx.fillRect(c + Math.cos(a) * r, c + Math.sin(a) * r, 4, 4);
  }
  ctx.globalCompositeOperation = 'source-over';
}

function makeTex(w: number, h: number) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return { canvas, texture };
}

export interface TravelTextures { map: THREE.CanvasTexture; stamps: THREE.CanvasTexture[] }

/** Only built while the ride is open. */
export function useTravelTextures(enabled: boolean): TravelTextures | null {
  const made = useMemo(() => {
    if (!enabled) return null;
    return { map: makeTex(MAP_W, MAP_H), stamps: TRAVEL_STAMPS.map(() => makeTex(STAMP, STAMP)) };
  }, [enabled]);

  useEffect(() => {
    if (!made) return;
    const draw = () => {
      drawMap(made.map.canvas.getContext('2d')!);
      made.map.texture.needsUpdate = true;
      made.stamps.forEach((t, i) => { drawStamp(t.canvas.getContext('2d')!, TRAVEL_STAMPS[i]); t.texture.needsUpdate = true; });
    };
    draw();
    let alive = true;
    document.fonts?.ready.then(() => { if (alive) draw(); });
    return () => {
      alive = false;
      made.map.texture.dispose();
      made.stamps.forEach((t) => t.texture.dispose());
    };
  }, [made]);

  return useMemo(() => (made ? { map: made.map.texture, stamps: made.stamps.map((t) => t.texture) } : null), [made]);
}
