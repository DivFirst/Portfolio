import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';

interface WorldSignProps {
  /** e.g. 2 */
  number: number;
  /** e.g. "Career Mode" */
  name: string;
  /** neon hex colour of the world */
  color: string;
  /** height above the island top */
  y?: number;
  reducedMotion?: boolean;
  /** brighter frame when the island is hovered/selected */
  active?: boolean;
}

const W = 1024;
const H = 320;
const SIGN_W = 4.6;
const SIGN_H = SIGN_W * (H / W);

/** Draws "WORLD 2" / "CAREER MODE" in the pixel font onto a canvas (same font as the HUD). */
function drawSign(ctx: CanvasRenderingContext2D, number: number, name: string, color: string) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0b0b1a';
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.imageSmoothingEnabled = false;

  ctx.font = '52px "Press Start 2P", "Courier New", monospace';
  ctx.fillStyle = color;
  ctx.fillText(`WORLD ${number}`, W / 2, 88);

  const title = name.toUpperCase();
  let size = 76;
  ctx.font = `${size}px "Press Start 2P", "Courier New", monospace`;
  while (ctx.measureText(title).width > W - 96 && size > 40) {
    size -= 4;
    ctx.font = `${size}px "Press Start 2P", "Courier New", monospace`;
  }
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#e8e8f5';
  ctx.fillText(title, W / 2, 202);
  ctx.shadowBlur = 0;
}

const BULBS_PER_ROW = 11;

/**
 * Arcade marquee sign: "WORLD N: NAME" in pixel letters inside a neon frame with
 * blinking bulbs. Always turns to face the camera so it stays readable.
 */
export const WorldSign: React.FC<WorldSignProps> = ({ number, name, color, y = 4.2, reducedMotion = false, active = false }) => {
  const bobRef = useRef<THREE.Group>(null);
  // Two shared bulb materials: even bulbs use A, odd bulbs use B, and they blink in turn.
  const [bulbA, bulbB, bulbGeo] = useMemo(() => [
    new THREE.MeshBasicMaterial({ color: '#ffe600', transparent: true, toneMapped: false }),
    new THREE.MeshBasicMaterial({ color: '#ffe600', transparent: true, toneMapped: false }),
    new THREE.PlaneGeometry(0.12, 0.12),
  ] as const, []);
  useEffect(() => () => { bulbA.dispose(); bulbB.dispose(); bulbGeo.dispose(); }, [bulbA, bulbB, bulbGeo]);

  const { canvas, texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.magFilter = THREE.NearestFilter; // crisp pixel edges up close
    t.anisotropy = 4;
    return { canvas: c, texture: t };
  }, []);

  // Draw now, and again once the pixel font has loaded.
  useEffect(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let alive = true;
    const redraw = () => {
      if (!alive) return;
      drawSign(ctx, number, name, color);
      texture.needsUpdate = true;
    };
    redraw();
    document.fonts?.load('40px "Press Start 2P"').then(redraw).catch(() => {});
    return () => { alive = false; };
  }, [canvas, texture, number, name, color]);

  useEffect(() => () => texture.dispose(), [texture]);

  // Gentle bob + stepped bulb blink (2 per second). Both stop when motion is reduced.
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (bobRef.current) bobRef.current.position.y = reducedMotion ? y : y + Math.sin(t * 1.6 + number) * 0.08;
    const on = Math.floor(t * 2) % 2 === 0;
    bulbA.opacity = reducedMotion || on ? 1 : 0.25;
    bulbB.opacity = reducedMotion || !on ? 1 : 0.25;
  });

  const frame = 0.07;
  const bulbs = useMemo(() => {
    const list: { x: number; y: number; even: boolean }[] = [];
    for (let i = 0; i < BULBS_PER_ROW; i++) {
      const x = -SIGN_W / 2 + 0.2 + (i * (SIGN_W - 0.4)) / (BULBS_PER_ROW - 1);
      list.push({ x, y: SIGN_H / 2 + 0.16, even: i % 2 === 0 });
      list.push({ x, y: -SIGN_H / 2 - 0.16, even: i % 2 === 1 });
    }
    return list;
  }, []);

  return (
    <group ref={bobRef} position={[0, y, 0]}>
      <Billboard>
        {/* soft glow behind the sign */}
        <mesh position={[0, 0, -0.04]}>
          <planeGeometry args={[SIGN_W + 0.9, SIGN_H + 0.9]} />
          <meshBasicMaterial color={color} transparent opacity={active ? 0.22 : 0.12} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
        {/* neon frame */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[SIGN_W + frame * 2 + 0.36, SIGN_H + frame * 2 + 0.36]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[SIGN_W + 0.36, SIGN_H + 0.36]} />
          <meshBasicMaterial color="#0b0b1a" toneMapped={false} />
        </mesh>
        {/* pixel lettering */}
        <mesh>
          <planeGeometry args={[SIGN_W, SIGN_H]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        {/* marquee bulbs: two sets that blink in turn */}
        {bulbs.map((b, i) => (
          <mesh key={i} position={[b.x, b.y, 0.01]} geometry={bulbGeo} material={b.even ? bulbA : bulbB} />
        ))}
      </Billboard>
    </group>
  );
};
