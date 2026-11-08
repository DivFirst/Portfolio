import React, { useMemo, useRef, useState } from 'react';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  LIBRARY_BOOK, LIBRARY_BOOKS, LIBRARY_LIGHT_COUNT, LIBRARY_ORBIT, LIBRARY_RING, LIBRARY_STACKS,
  libraryReadPos, libraryStateAt,
} from '../../../data/rides/libraryLayout';
import { getRideProgress } from '../../world/rideStore';
import { rideKit } from '../../world/rideKits';
import type { LibraryTextures } from './library/libraryTextures';

interface BookstagramIslandProps {
  /** true while the visitor is inside WORLD 5 (Lore Library): the scroll ride drives the scene */
  rideActive?: boolean;
  reducedMotion?: boolean;
}

/*
 * WORLD 5: LORE LIBRARY. The gazebo, its fairy lights and the book stacks.
 * The stacked books are the real books from portfolioData (in their cover colours).
 * In the ride (worldRides.ts → libraryStateAt) every state is a pure function of the scroll:
 *  - the fairy lights switch on one by one,
 *  - shelf by shelf, books lift off the stacks, open and flip pages, then join a ring above the gazebo,
 *  - near the end the scene dims and a golden ring rises from the open book.
 * Reduced motion: whole chapters only (the side panel fades through black between them).
 */

const { w: BW, h: BH, t: BT } = LIBRARY_BOOK;
const COVER_T = 0.022;
const BLOCK_T = BT / 2 - COVER_T;
const OPEN_FRONT = Math.PI - 0.35;
const OPEN_BACK = 0.35;
const FAN_PAGES = 3;

const LIGHT_OFF = new THREE.Color('#4a3d63');
const LIGHT_ON = new THREE.Color('#fde047');

// shared geometry (one copy for all books)
const coverGeo = new THREE.BoxGeometry(BW, BH, COVER_T);
const blockGeo = new THREE.BoxGeometry(BW * 0.95, BH * 0.95, BLOCK_T);
const pageGeo = new THREE.PlaneGeometry(BW * 0.92, BH * 0.92);
const spineGeo = new THREE.BoxGeometry(0.02, BH, BT);
const bulbGeo = new THREE.SphereGeometry(0.05, 6, 6);

/** Fairy light positions (gazebo space), in switch-on order: front swag first, then around */
const BULBS: [number, number, number][] = (() => {
  const c: [number, number][] = [[-0.8, 0.8], [0.8, 0.8], [0.8, -0.8], [-0.8, -0.8]];
  const out: [number, number, number][] = [];
  const per = LIBRARY_LIGHT_COUNT / 4;
  for (let side = 0; side < 4; side++) {
    const [ax, az] = c[side];
    const [bx, bz] = c[(side + 1) % 4];
    for (let i = 0; i < per; i++) {
      const t = (i + 0.5) / per;
      out.push([ax + (bx - ax) * t, 2.08 - Math.sin(Math.PI * t) * 0.16, az + (bz - az) * t]);
    }
  }
  return out;
})();

interface BookRig {
  root: THREE.Group | null;
  inner: THREE.Group | null;
  front: THREE.Group | null;
  back: THREE.Group | null;
  fan: (THREE.Group | null)[];
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const tmpV = new THREE.Vector3();
const tmpV2 = new THREE.Vector3();
const tmpQ = new THREE.Quaternion();
const tmpE = new THREE.Euler(0, 0, 0, 'YXZ');

/** Fixed poses: on its stack, and in the ring above the gazebo */
function homePose(i: number) {
  const b = LIBRARY_BOOKS[i];
  const [sx, , sz] = LIBRARY_STACKS[b.stack];
  const yaw = (((i * 37) % 11) / 11 - 0.5) * 0.7;
  return {
    pos: new THREE.Vector3(sx, BT / 2 + b.level * (BT + 0.006), sz),
    quat: new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, yaw, 0, 'YXZ')),
  };
}
const homes = LIBRARY_BOOKS.map((_, i) => homePose(i));

/** Stack 2's top, where the open book (and later the ring) sits */
const stack2Top = homes.filter((_, i) => LIBRARY_BOOKS[i].stack === 1).reduce((m, h) => Math.max(m, h.pos.y), 0) + BT / 2;

const Book: React.FC<{ index: number; rig: BookRig; tex: LibraryTextures | null }> = ({ index, rig, tex }) => {
  const b = LIBRARY_BOOKS[index];
  const mats = useMemo(() => ({
    cover: new THREE.MeshStandardMaterial({ color: b.coverColor, roughness: 0.55 }),
    paper: new THREE.MeshStandardMaterial({ color: '#efe6d0', roughness: 0.9 }),
    fan: new THREE.MeshStandardMaterial({ color: '#f6efdd', roughness: 0.9, side: THREE.DoubleSide }),
  }), [b.coverColor]);
  const page = tex?.pages[index];
  const home = homes[index];

  return (
    <group ref={(el) => { rig.root = el; }} position={home.pos} quaternion={home.quat}>
      <group ref={(el) => { rig.inner = el; }} position={[-BW / 2, 0, 0]}>
        <mesh geometry={spineGeo} material={mats.cover} position={[-0.01, 0, 0]} />
        {/* front cover + left page (swings open towards the viewer) */}
        <group ref={(el) => { rig.front = el; }}>
          <mesh geometry={coverGeo} material={mats.cover} position={[BW / 2, 0, BT / 2 - COVER_T / 2]} castShadow />
          <mesh geometry={blockGeo} material={mats.paper} position={[BW / 2, 0, BLOCK_T / 2]} />
          <mesh geometry={pageGeo} position={[BW / 2, 0, -0.002]} rotation={[0, Math.PI, 0]}>
            <meshStandardMaterial map={page?.left ?? null} emissiveMap={page?.left ?? null} emissive={page ? '#ffffff' : '#000000'} emissiveIntensity={0.55} color={page ? '#ffffff' : '#efe6d0'} roughness={0.9} />
          </mesh>
        </group>
        {/* back cover + right page */}
        <group ref={(el) => { rig.back = el; }}>
          <mesh geometry={coverGeo} material={mats.cover} position={[BW / 2, 0, -BT / 2 + COVER_T / 2]} castShadow />
          <mesh geometry={blockGeo} material={mats.paper} position={[BW / 2, 0, -BLOCK_T / 2]} />
          <mesh geometry={pageGeo} position={[BW / 2, 0, 0.002]}>
            <meshStandardMaterial map={page?.right ?? null} emissiveMap={page?.right ?? null} emissive={page ? '#ffffff' : '#000000'} emissiveIntensity={0.55} color={page ? '#ffffff' : '#efe6d0'} roughness={0.9} />
          </mesh>
        </group>
        {/* loose pages that flip while the book is open */}
        {Array.from({ length: FAN_PAGES }, (_, k) => (
          <group key={k} ref={(el) => { rig.fan[k] = el; }} visible={false}>
            <mesh geometry={pageGeo} material={mats.fan} position={[BW * 0.46, 0, 0]} />
          </group>
        ))}
      </group>
    </group>
  );
};

/** The golden ring, its halo, and the dark veil in front of the camera that dims the scene around it */
const RingMoment: React.FC<{ tex: LibraryTextures | null; reducedMotion: boolean; lightRef: React.RefObject<THREE.PointLight> }> = ({ tex, reducedMotion, lightRef }) => {
  const { scene, camera } = useThree();
  const ringRef = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const torusMat = useRef<THREE.MeshStandardMaterial>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const haloMat = useRef<THREE.MeshBasicMaterial>(null);
  const veilRef = useRef<THREE.Mesh>(null);
  const veilMat = useRef<THREE.MeshBasicMaterial>(null);
  const from = useMemo(() => new THREE.Vector3(LIBRARY_RING.from[0], stack2Top + 0.06, LIBRARY_RING.from[2]), []);
  const to = useMemo(() => new THREE.Vector3(...LIBRARY_RING.to), []);

  useFrame((state) => {
    const s = libraryStateAt(getRideProgress(), reducedMotion);
    const t = state.clock.elapsedTime;
    const g = ringRef.current;
    if (g) {
      g.visible = s.ringRise > 0.01;
      g.position.lerpVectors(from, to, s.ringRise);
      if (!reducedMotion) g.position.y += Math.sin(t * 1.4) * 0.03 * s.ringRise;
      g.scale.setScalar(0.4 + 0.6 * s.ringRise);
      lightRef.current?.position.copy(g.position);
    }
    // turns with the scroll (and a slow idle sway), but always shows its face to the visitor
    torusRef.current?.rotation.set(0.25, Math.sin(s.x * 1.4 + (reducedMotion ? 0 : t * 0.5)) * 0.55, 0);
    if (torusMat.current) {
      torusMat.current.emissiveIntensity = 0.35 + 1.6 * s.dim;
      // drawn on top of the veil only while the scene is dimmed
      torusMat.current.depthTest = s.dim < 0.02;
    }
    if (haloMat.current) haloMat.current.opacity = 0.85 * s.dim;
    if (haloRef.current) haloRef.current.quaternion.copy(camera.quaternion);
    if (lightRef.current) lightRef.current.intensity = 2.4 * s.dim;
    const veil = veilRef.current;
    if (veil && veilMat.current) {
      veil.visible = s.dim > 0.01;
      veilMat.current.opacity = 0.8 * s.dim;
      camera.getWorldDirection(tmpV);
      veil.position.copy(camera.position).addScaledVector(tmpV, 0.3);
      veil.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <>
      <group ref={ringRef} visible={false}>
        <mesh ref={torusRef} renderOrder={1000}>
          <torusGeometry args={[0.13, 0.032, 12, 40]} />
          <meshStandardMaterial ref={torusMat} color="#f5c542" emissive="#ffb000" emissiveIntensity={0.4} metalness={0.9} roughness={0.25} transparent />
        </mesh>
        <mesh ref={haloRef} renderOrder={999}>
          <planeGeometry args={[1.3, 1.3]} />
          <meshBasicMaterial ref={haloMat} map={tex?.halo ?? null} transparent opacity={0} depthTest={false} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
      {createPortal(
        <mesh ref={veilRef} renderOrder={998} visible={false} frustumCulled={false}>
          <planeGeometry args={[4, 4]} />
          <meshBasicMaterial ref={veilMat} color="#05030c" transparent opacity={0} depthTest={false} depthWrite={false} />
        </mesh>,
        scene,
      )}
    </>
  );
};

export const BookstagramIsland: React.FC<BookstagramIslandProps> = ({ rideActive = false, reducedMotion = false }) => {
  const bulbRefs = useRef<(THREE.Mesh | null)[]>([]);
  const chandelierRef = useRef<THREE.PointLight>(null);
  const rigs = useMemo<BookRig[]>(() => LIBRARY_BOOKS.map(() => ({ root: null, inner: null, front: null, back: null, fan: [] })), []);
  // Book pages + ring halo (made by the World 5 ride kit, downloaded on entry)
  const [tex, setTex] = useState<LibraryTextures | null>(null);
  const ringLightRef = useRef<THREE.PointLight>(null);
  const { size } = useThree();

  // ride poses: reading spot (desktop row / phone column) and the ring of finished books
  const portrait = size.width / size.height < 1;
  const readPoses = useMemo(() => LIBRARY_BOOKS.map((b) => ({
    pos: new THREE.Vector3(...libraryReadPos(b.shelf, b.k, b.n, portrait)),
    quat: new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.1, b.facing, 0, 'YXZ')),
  })), [portrait]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = rideActive ? libraryStateAt(getRideProgress(), reducedMotion) : null;

    // fairy lights: twinkle on the map; in the ride, switch on one by one with the scroll
    let lit = 0;
    bulbRefs.current.forEach((m, i) => {
      if (!m) return;
      const mat = m.material as THREE.MeshBasicMaterial;
      if (!s) {
        mat.color.copy(LIGHT_ON);
        mat.opacity = reducedMotion ? 0.85 : 0.5 + Math.sin(t * 3 + i) * 0.4;
        m.scale.setScalar(1);
        return;
      }
      const on = s.lights[i];
      lit += on;
      mat.color.copy(LIGHT_OFF).lerp(LIGHT_ON, on);
      mat.opacity = 0.55 + 0.45 * on;
      m.scale.setScalar(0.8 + 0.3 * on + 0.35 * Math.sin(Math.PI * Math.min(1, on)));
    });
    if (chandelierRef.current) chandelierRef.current.intensity = s ? 0.1 + 1.3 * (lit / LIBRARY_LIGHT_COUNT) : 0.9;

    // books
    const turn = s ? s.x * 0.12 : 0; // the ring of finished books turns slowly with the scroll
    rigs.forEach((rig, i) => {
      const { root, inner, front, back, fan } = rig;
      if (!root || !inner || !front || !back) return;
      const home = homes[i];
      if (!s) {
        root.position.copy(home.pos);
        root.quaternion.copy(home.quat);
        inner.position.x = -BW / 2;
        front.rotation.y = 0;
        back.rotation.y = 0;
        fan.forEach((f) => { if (f) f.visible = false; });
        return;
      }
      const st = s.books[i];
      const read = readPoses[i];
      // stack → reading spot (a little arc up)
      tmpV.copy(home.pos).lerp(read.pos, st.lift);
      tmpV.y += Math.sin(Math.PI * st.lift) * 0.45;
      tmpQ.copy(home.quat).slerp(read.quat, smooth(st.lift));
      if (st.park > 0) {
        const b = LIBRARY_BOOKS[i];
        const a = (b.orbit / LIBRARY_BOOKS.length) * Math.PI * 2 + turn;
        const [cx, cy, cz] = LIBRARY_ORBIT.centre;
        const bob = reducedMotion ? 0 : Math.sin(t * 1.3 + i) * 0.04;
        tmpV2.set(cx + Math.sin(a) * LIBRARY_ORBIT.radius, cy + Math.sin(a * 2) * 0.15 + bob, cz + Math.cos(a) * LIBRARY_ORBIT.radius);
        tmpV.lerp(tmpV2, st.park);
        tmpV.y += Math.sin(Math.PI * st.park) * 0.3;
        tmpE.set(0.12, a, 0);
        tmpQ.slerp(new THREE.Quaternion().setFromEuler(tmpE), st.park);
      }
      root.position.copy(tmpV);
      root.quaternion.copy(tmpQ);
      inner.position.x = -BW / 2 * (1 - st.open);
      const fr = -OPEN_FRONT * st.open;
      const bk = OPEN_BACK * st.open;
      front.rotation.y = fr;
      back.rotation.y = bk;
      fan.forEach((f, k) => {
        if (!f) return;
        const phase = smooth(Math.min(1, Math.max(0, st.fan * 1.8 - k * 0.4)));
        // only while turning: a landed page would cover the title page
        f.visible = st.open > 0.05 && phase > 0.02 && phase < 0.97;
        f.rotation.y = bk + (fr - bk) * phase;
      });
    });
  });

  return (
    <group position={[0, 0, 0]}>
      {/* --- READING GAZEBO / CANOPY --- */}
      <group position={[0, 0, -0.6]}>
        {[
          [-0.8, -0.8],
          [0.8, -0.8],
          [-0.8, 0.8],
          [0.8, 0.8],
        ].map(([x, z], idx) => (
          <mesh key={idx} position={[x, 1.1, z]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 2.2, 8]} />
            <meshStandardMaterial color="#581c87" roughness={0.7} />
          </mesh>
        ))}

        {/* Gazebo Conical Pagoda Roof */}
        <mesh position={[0, 2.7, 0]} castShadow>
          <coneGeometry args={[1.5, 1.0, 6]} />
          <meshStandardMaterial color="#7c3aed" roughness={0.5} />
        </mesh>
        <mesh position={[0, 3.3, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>

        {/* Fairy lights strung around the gazebo (switch on one by one in the ride) */}
        {BULBS.map((p, i) => (
          <mesh key={i} ref={(el) => { bulbRefs.current[i] = el; }} position={p} geometry={bulbGeo}>
            <meshBasicMaterial color="#fde047" transparent opacity={0.8} />
          </mesh>
        ))}

        {/* Warm Gazebo Reading Chandelier */}
        <pointLight ref={chandelierRef} position={[0, 1.8, 0]} color="#fef08a" intensity={0.9} distance={3} />
      </group>

      {/* --- THE BOOKS (three stacks; every book from the data file) --- */}
      {LIBRARY_BOOKS.map((b, i) => <Book key={b.title} index={i} rig={rigs[i]} tex={tex} />)}

      {/* Open book on top of stack 2 (the ring rises from here) */}
      <group position={[LIBRARY_STACKS[1][0], stack2Top + 0.02, LIBRARY_STACKS[1][2]]} rotation={[0, 0.2, 0]}>
        <mesh position={[-0.15, 0.02, 0]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.3, 0.02, 0.45]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0.15, 0.02, 0]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.3, 0.02, 0.45]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>

      {/* --- COZY READING CHAIR / BENCH --- */}
      <group position={[0, 0, -0.3]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.8, 0.1, 0.45]} />
          <meshStandardMaterial color="#4c1d95" />
        </mesh>
        <mesh position={[0, 0.65, -0.2]} castShadow>
          <boxGeometry args={[0.8, 0.5, 0.08]} />
          <meshStandardMaterial color="#4c1d95" />
        </mesh>
      </group>

      {rideActive && <TextureMaker onChange={setTex} />}
      {rideActive && <RingMoment tex={tex} reducedMotion={reducedMotion} lightRef={ringLightRef} />}
      {/* The ring's glow (World 5 ride). Always in the scene, at 0 brightness until the ring moment: a light
          appearing later makes three.js rebuild every material in the scene at once, which freezes a phone. */}
      <pointLight ref={ringLightRef} color="#ffcc55" intensity={0} distance={3} />
    </group>
  );
};

const TextureMaker: React.FC<{ onChange: (t: LibraryTextures | null) => void }> = ({ onChange }) => {
  const { LibraryTextureMaker } = rideKit('bookstagram');
  return <LibraryTextureMaker onChange={onChange} />;
};
