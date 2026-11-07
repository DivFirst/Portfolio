import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import * as THREE from 'three';

/** Background colour of the 3D world (darker than the UI's #0b0b1a so panels stand out). */
export const SKY_COLOR = '#05050f';

const STAR_COLORS = ['#e8e8f5', '#e8e8f5', '#e8e8f5', '#00f0ff', '#ff2e88', '#ffe600'];

/** Square, non-scaling points = pixel stars. Seeded so the sky is the same every visit. */
function makeStars(count: number, seed: number) {
  let s = seed;
  const rand = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    // random point on a shell 80–120 units away (outside the islands, inside the camera's far plane)
    const u = rand() * 2 - 1;
    const th = rand() * Math.PI * 2;
    const r = 80 + rand() * 40;
    const k = Math.sqrt(1 - u * u);
    pos.set([r * k * Math.cos(th), r * u, r * k * Math.sin(th)], i * 3);
    c.set(STAR_COLORS[Math.floor(rand() * STAR_COLORS.length)]);
    col.set([c.r, c.g, c.b], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}

/**
 * Retro sky: pixel starfield (some stars twinkle in hard steps) and a neon
 * synthwave grid floor far below the islands that slowly scrolls.
 * Everything holds still when motion is reduced.
 */
export const RetroSky: React.FC<{ reducedMotion?: boolean }> = ({ reducedMotion = false }) => {
  const steady = useMemo(() => makeStars(1100, 7), []);
  const twinkle = useMemo(() => makeStars(220, 99), []);
  const twinkleMat = useRef<THREE.PointsMaterial>(null);
  const gridRef = useRef<THREE.Group>(null);

  useEffect(() => () => { steady.dispose(); twinkle.dispose(); }, [steady, twinkle]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (twinkleMat.current) twinkleMat.current.opacity = reducedMotion ? 0.9 : (Math.floor(t * 1.5) % 2 === 0 ? 1 : 0.2);
    // grid drifts toward the viewer and wraps every cell, so it looks endless
    if (gridRef.current) gridRef.current.position.z = reducedMotion ? 0 : (t * 0.6) % 3;
  });

  return (
    <>
      <points geometry={steady}>
        <pointsMaterial size={2} sizeAttenuation={false} vertexColors fog={false} transparent opacity={0.85} depthWrite={false} />
      </points>
      <points geometry={twinkle}>
        <pointsMaterial ref={twinkleMat} size={3} sizeAttenuation={false} vertexColors fog={false} transparent depthWrite={false} />
      </points>

      <group ref={gridRef} position={[0, 0, 0]}>
        <Grid
          position={[0, -9, 0]}
          args={[10, 10]}
          infiniteGrid
          cellSize={3}
          cellThickness={0.6}
          cellColor="#9d4dff"
          sectionSize={15}
          sectionThickness={1.2}
          sectionColor="#ff2e88"
          fadeDistance={95}
          fadeStrength={1.6}
          followCamera={false}
        />
      </group>
    </>
  );
};
