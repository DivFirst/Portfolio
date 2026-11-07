import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Line2 } from 'three-stdlib';
import { ORIGIN_PAGE_Y, ORIGIN_STOPS, mapPoint } from '../../../../data/worldRides';
import { getRideProgress } from '../../../world/rideStore';
import {
  arcForStop,
  clamp01,
  indiaOutline,
  indiaOutlineLength,
  indiaShape,
  originStateAt,
  pointAtArc,
  routeLength,
  smooth,
  stopArc,
} from './originRide';
import { useOriginTextures } from './originTextures';

/**
 * Everything World 1 adds to the open book, mounted only while the ride is on:
 *  - the right page: an ink map of India that draws itself, a dotted route, the train and city pins,
 *  - the page that turns on the left at each new chapter.
 * Lives inside the book's (flat, landed) group, so positions are island space (see worldRides.ts).
 */

const INK = '#5b3410';
const ROUTE_INK = new THREE.Color('#7c2d12');
const ROUTE_GLOW = new THREE.Color('#f59e0b');
const PIN_COLOR: Record<string, string> = { city: '#ff2e88', home: '#f59e0b', study: '#9d4dff', work: '#ff2e88', now: '#00f0ff' };
const DOT_GAP = 0.075;
const DOTS = Math.floor(routeLength / DOT_GAP) + 1;
const CAR_GAP = 0.14;
/** Gutter of the open book, in island space (= the book's spine) */
export const GUTTER_X = -1.8;
const PAGE_W = 3.25;
const PAGE_L = 4.5;

const tmp = new THREE.Vector3();
const ahead = new THREE.Vector3();
const behind = new THREE.Vector3();
const dummy = new THREE.Object3D();

interface Props {
  reducedMotion: boolean;
  /** material of the left page (it lives on the book's cover), so its picture can follow the chapter */
  leftPageMaterial: React.RefObject<THREE.MeshStandardMaterial>;
}

export const OriginBookRide: React.FC<Props> = ({ reducedMotion, leftPageMaterial }) => {
  const { pages, labels } = useOriginTextures();

  const mapRef = useRef<THREE.Group>(null);
  const outlineRef = useRef<Line2>(null);
  const fillMat = useRef<THREE.MeshBasicMaterial>(null);
  const dotsRef = useRef<THREE.InstancedMesh>(null);
  const carRefs = useRef<(THREE.Group | null)[]>([]);
  const pinRefs = useRef<(THREE.Group | null)[]>([]);
  const labelMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const nowHeadRef = useRef<THREE.Mesh>(null);
  const turnRef = useRef<THREE.Group>(null);
  const turnBackMat = useRef<THREE.MeshStandardMaterial>(null);
  const shownPage = useRef(-1);
  const shownTurn = useRef(-1);

  const fillGeometry = useMemo(() => new THREE.ShapeGeometry(indiaShape()), []);
  useEffect(() => () => fillGeometry.dispose(), [fillGeometry]);

  // Route dots: positions are fixed; how many show follows the train.
  useEffect(() => {
    const mesh = dotsRef.current;
    if (!mesh) return;
    for (let i = 0; i < DOTS; i++) {
      pointAtArc(i * DOT_GAP, tmp);
      dummy.position.copy(tmp);
      dummy.rotation.set(0, Math.PI / 4, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.count = 0;
  }, []);

  useFrame((state) => {
    const s = originStateAt(getRideProgress(), reducedMotion);
    const ink = clamp01((s.ink - 0.55) / 0.45); // the map draws itself once the cover is open
    // train and pins arrive after the ink, and duck away before the cover closes over them
    const shown = clamp01((s.ink - 0.85) / 0.15) * smooth(clamp01((s.open - 0.7) / 0.25));

    if (mapRef.current) mapRef.current.visible = ink > 0.001;

    const outline = outlineRef.current;
    if (outline) {
      const m = outline.material as unknown as { dashOffset: number };
      m.dashOffset = indiaOutlineLength * (1 - ink);
    }
    if (fillMat.current) fillMat.current.opacity = ink * ink * 0.85;

    // train position along the route
    const arc = arcForStop(s.stop);
    const dots = dotsRef.current;
    if (dots) {
      dots.count = shown > 0 ? Math.min(DOTS, Math.floor(arc / DOT_GAP) + 1) : 0;
      (dots.material as THREE.MeshBasicMaterial).color.copy(ROUTE_INK).lerp(ROUTE_GLOW, s.glow);
      dots.scale.setScalar(1);
    }
    carRefs.current.forEach((car, i) => {
      if (!car) return;
      const a = Math.max(0, arc - i * CAR_GAP);
      pointAtArc(a, car.position);
      pointAtArc(a + 0.03, ahead);
      pointAtArc(a - 0.03, behind);
      ahead.sub(behind);
      if (ahead.lengthSq() > 1e-8) car.rotation.y = Math.atan2(-ahead.z, ahead.x);
      car.scale.setScalar(shown);
      car.visible = shown > 0.01 && (i === 0 || arc > i * CAR_GAP * 0.6);
    });

    // pins pop up as the train reaches each stop (and sink again when it backs up)
    pinRefs.current.forEach((pin, i) => {
      if (!pin) return;
      const k = smooth(clamp01((arc - stopArc[i]) / 0.08 + 1)) * shown;
      pin.scale.setScalar(Math.max(0.0001, k));
      pin.visible = k > 0.01;
      // older stops' names fade out so the busy north stays readable (home and "now" keep theirs)
      const label = labelMats.current[i];
      if (label) {
        const kind = ORIGIN_STOPS[i].kind;
        label.opacity = kind === 'home' || kind === 'now' ? 1 : clamp01(1 - (s.stop - i - 1.6) / 0.6);
      }
    });
    if (nowHeadRef.current) {
      const pulse = reducedMotion ? 1 : 1 + Math.sin(state.clock.elapsedTime * 4) * 0.12;
      nowHeadRef.current.scale.setScalar(pulse);
    }

    // chapter pages: the left page shows the chapter we're in; between chapters a page turns over
    const base = Math.floor(s.page + 1e-4);
    const frac = s.page - base;
    const left = leftPageMaterial.current;
    if (left && shownPage.current !== base && pages[base]) {
      left.map = pages[base];
      left.color.set('#ffffff');
      left.needsUpdate = true;
      shownPage.current = base;
    }
    const turn = turnRef.current;
    if (turn) {
      const turning = frac > 0.02 && frac < 0.995 && s.open > 0.98;
      turn.visible = turning;
      if (turning) {
        // the page lifts off the right side, sweeps over and lands on the left
        turn.rotation.z = 0.2 + smooth(frac) * (Math.PI - 0.2);
        const next = Math.min(pages.length - 1, base + 1);
        if (turnBackMat.current && shownTurn.current !== next) {
          turnBackMat.current.map = pages[next];
          turnBackMat.current.needsUpdate = true;
          shownTurn.current = next;
        }
      }
    }
  });

  // When the ride ends, the cover's left page goes back to plain paper.
  useEffect(() => () => {
    const left = leftPageMaterial.current;
    if (left) { left.map = null; left.color.set('#fef3c7'); left.needsUpdate = true; }
  }, [leftPageMaterial]);

  return (
    <group>
      {/* ---------- right page: the map ---------- */}
      <group ref={mapRef} visible={false}>
        <mesh geometry={fillGeometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, ORIGIN_PAGE_Y + 0.003, 0]} renderOrder={1}>
          <meshBasicMaterial ref={fillMat} color="#ecd29b" transparent opacity={0} depthWrite={false} />
        </mesh>
        <Line
          ref={outlineRef}
          points={indiaOutline}
          color={INK}
          lineWidth={2.2}
          dashed
          dashSize={indiaOutlineLength}
          gapSize={indiaOutlineLength * 1.05}
          dashOffset={indiaOutlineLength}
        />

        <instancedMesh ref={dotsRef} args={[undefined, undefined, DOTS]} frustumCulled={false}>
          <boxGeometry args={[0.034, 0.01, 0.034]} />
          <meshBasicMaterial color={ROUTE_INK} />
        </instancedMesh>

        {/* the pixel train: engine + 2 wagons, each a few blocks */}
        {[0, 1, 2].map((i) => (
          <group key={i} ref={(g) => { carRefs.current[i] = g; }} visible={false}>
            {i === 0 ? (
              <>
                <mesh position={[0, 0.045, 0]}>
                  <boxGeometry args={[0.15, 0.06, 0.075]} />
                  <meshStandardMaterial color="#ffe600" emissive="#a16207" emissiveIntensity={0.45} roughness={0.6} />
                </mesh>
                <mesh position={[-0.045, 0.095, 0]}>
                  <boxGeometry args={[0.06, 0.05, 0.075]} />
                  <meshStandardMaterial color="#ffe600" emissive="#a16207" emissiveIntensity={0.45} roughness={0.6} />
                </mesh>
                <mesh position={[0.05, 0.095, 0]}>
                  <boxGeometry args={[0.025, 0.04, 0.025]} />
                  <meshStandardMaterial color="#1a0701" />
                </mesh>
              </>
            ) : (
              <mesh position={[0, 0.04, 0]}>
                <boxGeometry args={[0.11, 0.05, 0.07]} />
                <meshStandardMaterial color="#ff2e88" emissive="#a3104f" emissiveIntensity={0.35} roughness={0.6} />
              </mesh>
            )}
            <mesh position={[0, 0.012, 0]}>
              <boxGeometry args={[i === 0 ? 0.13 : 0.09, 0.022, 0.085]} />
              <meshStandardMaterial color="#1a0701" />
            </mesh>
          </group>
        ))}

        {/* city pins + ink labels */}
        {ORIGIN_STOPS.map((stop, i) => {
          const [x, y, z] = mapPoint(stop.lonLat[0], stop.lonLat[1]);
          const color = PIN_COLOR[stop.kind];
          const label = labels[i];
          const lh = 0.13;
          const lw = lh * label.aspect;
          const lx = stop.labelSide === 'right' ? 0.09 + lw / 2 : -0.09 - lw / 2;
          return (
            <group key={stop.id} ref={(g) => { pinRefs.current[i] = g; }} position={[x, y, z]} visible={false}>
              <mesh position={[0, 0.11, 0]}>
                <boxGeometry args={[0.024, 0.22, 0.024]} />
                <meshStandardMaterial color="#1a0701" />
              </mesh>
              {stop.kind === 'home' ? (
                <mesh position={[0, 0.27, 0]}>
                  <octahedronGeometry args={[0.1, 0]} />
                  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
                </mesh>
              ) : (
                <mesh ref={stop.kind === 'now' ? nowHeadRef : undefined} position={[0, 0.25, 0]}>
                  <boxGeometry args={[0.1, 0.1, 0.1]} />
                  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} />
                </mesh>
              )}
              <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.07, 0.07]} />
                <meshBasicMaterial color="#1a0701" />
              </mesh>
              <mesh position={[lx, 0.008, 0.02]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
                <planeGeometry args={[lw, lh]} />
                <meshBasicMaterial ref={(m) => { labelMats.current[i] = m; }} map={label.texture} transparent depthWrite={false} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ---------- the page that turns ---------- */}
      <group ref={turnRef} position={[GUTTER_X, ORIGIN_PAGE_Y + 0.004, 0]} visible={false}>
        {/* front: plain paper (faces up while the page is on the right) */}
        <mesh position={[PAGE_W / 2 + 0.28, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[PAGE_W, PAGE_L]} />
          <meshStandardMaterial color="#fdf0cf" roughness={0.9} />
        </mesh>
        {/* back: the next chapter page (faces up once it lands on the left) */}
        <mesh position={[PAGE_W / 2 + 0.28, -0.002, 0]} rotation={[Math.PI / 2, 0, Math.PI]}>
          <planeGeometry args={[PAGE_W, PAGE_L]} />
          <meshStandardMaterial ref={turnBackMat} color="#ffffff" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};
