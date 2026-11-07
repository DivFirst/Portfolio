import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { BOSSES, BOSS_ORBIT, BOSS_ROCKET, bossAltitude, chapterBlend, type BossInfo } from '../../../../data/worldRides';
import { getRideProgress } from '../../../world/rideStore';
import { SKY_COLOR } from '../../RetroSky';
import { useBossTextures, type TextTex } from './bossTextures';

/**
 * Everything World 3 (Boss Battles) adds to the Projects island while its ride is open:
 * the bosses (one per project), sky colour by altitude, clouds, an asteroid belt,
 * launch smoke, the countdown, and in orbit the dish's beam + "MORE COMING".
 * Every state is a pure function of the scroll, so scrolling up plays it backwards.
 * Positions are island space (see worldRides.ts).
 */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const N = bossAltitude.length;
const LAST = N - 1;

export interface RocketState {
  /** climb above the pad */
  alt: number;
  /** gantry service arm: 0 = at the rocket, 1 = swung away */
  arm: number;
  /** engine flame size 0–1 */
  flame: number;
  /** 1 while climbing (longer flame) */
  thrust: number;
  /** 0–1 into the final orbit shot (beam + sign) */
  orbit: number;
  /** linear chapter position (0 … N-1), or the snapped chapter when motion is reduced */
  x: number;
}

/** Rocket + launch state at ride progress p (shared by the island and the ride extras). */
export function rocketStateAt(p: number, reduced: boolean): RocketState {
  const { a, b, t } = chapterBlend(p, N, reduced);
  const alt = bossAltitude[a] + (bossAltitude[b] - bossAltitude[a]) * t;
  const raw = clamp01(p) * LAST;
  const x = reduced ? Math.round(raw) : raw;
  return {
    alt,
    arm: reduced ? (x >= 1 ? 1 : 0) : smooth(clamp01((x - 0.3) / 0.5)),
    flame: reduced ? (x >= 1 ? 1 : 0) : clamp01((x - 0.6) / 0.25),
    thrust: reduced ? 0 : clamp01(x - 1) * (1 - clamp01(x - (LAST - 1))),
    orbit: reduced ? (x >= LAST ? 1 : 0) : smooth(clamp01((x - (LAST - 0.7)) / 0.6)),
    x,
  };
}

// Sky by altitude: night → synthwave purple → pink haze → black space
const SKY_STOPS: [number, THREE.Color][] = [
  [0, new THREE.Color(SKY_COLOR)],
  [0.2, new THREE.Color('#120a2c')],
  [0.45, new THREE.Color('#2a0c40')],
  [0.65, new THREE.Color('#1e0828')],
  [0.85, new THREE.Color('#07040f')],
  [1, new THREE.Color('#020206')],
];
function skyAt(f: number, out: THREE.Color) {
  for (let i = 1; i < SKY_STOPS.length; i++) {
    const [f1, c1] = SKY_STOPS[i];
    const [f0, c0] = SKY_STOPS[i - 1];
    if (f <= f1) return out.copy(c0).lerp(c1, (f - f0) / (f1 - f0));
  }
  return out.copy(SKY_STOPS[SKY_STOPS.length - 1][1]);
}

/** Labels face the visitor's side of the island (the ride cameras all look from +z, slightly +x) */
const FACE_Y = Math.atan2(0.3, 1);
const DEFEAT_AT = -0.06; // a little before the rocket reaches the boss's chapter
const GREY = new THREE.Color('#3a3a55');

/** Seeded random so clouds and rocks are the same every visit */
function seeded(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

interface BossRefs {
  group: THREE.Group | null;
  body: THREE.MeshStandardMaterial | null;
  eyes: THREE.Group | null;
  hpFill: THREE.Mesh | null;
  hpGroup: THREE.Group | null;
  banner: THREE.Mesh | null;
  bannerMat: THREE.MeshBasicMaterial | null;
  ring: THREE.Mesh | null;
  name: THREE.Mesh | null;
}

const Boss: React.FC<{ boss: BossInfo; name: TextTex; banner: TextTex; refs: BossRefs }> = ({ boss, name, banner, refs }) => {
  const r = boss.radius;
  const bannerW = 2.3;
  const nameW = 2.0;
  return (
    <group ref={(g) => { refs.group = g; }} position={boss.position}>
      <group rotation={[0, FACE_Y, 0]}>
        {/* body */}
        <mesh>
          <icosahedronGeometry args={[r, 1]} />
          <meshStandardMaterial
            ref={(m) => { refs.body = m; }}
            color={boss.color}
            emissive={boss.color}
            emissiveIntensity={0.35}
            flatShading
            roughness={0.6}
          />
        </mesh>
        {/* angry eyes + brows: closed when defeated */}
        <group ref={(g) => { refs.eyes = g; }} position={[0, r * 0.15, r * 0.9]}>
          {[-1, 1].map((s) => (
            <group key={s} position={[s * r * 0.3, 0, 0]}>
              <mesh>
                <boxGeometry args={[r * 0.22, r * 0.26, 0.04]} />
                <meshBasicMaterial color="#0b0b1a" />
              </mesh>
              <mesh position={[0, r * 0.24, 0]} rotation={[0, 0, s * -0.45]}>
                <boxGeometry args={[r * 0.34, r * 0.07, 0.04]} />
                <meshBasicMaterial color="#0b0b1a" />
              </mesh>
            </group>
          ))}
        </group>
        {boss.ring && (
          <mesh ref={(m) => { refs.ring = m; }} rotation={[Math.PI / 2.4, 0, 0.3]}>
            <torusGeometry args={[r * 1.55, r * 0.06, 6, 28]} />
            <meshBasicMaterial color="#e8e8f5" transparent opacity={0.55} />
          </mesh>
        )}

        {/* name tag + HP bar above */}
        <mesh ref={(m) => { refs.name = m; }} position={[0, r + 0.62, 0]}>
          <planeGeometry args={[nameW, nameW / name.aspect]} />
          <meshBasicMaterial map={name.texture} transparent depthWrite={false} toneMapped={false} />
        </mesh>
        <group ref={(g) => { refs.hpGroup = g; }} position={[0, r + 0.3, 0]}>
          <mesh>
            <planeGeometry args={[1.2, 0.14]} />
            <meshBasicMaterial color="#1d1d3a" />
          </mesh>
          <mesh ref={(m) => { refs.hpFill = m; }} position={[0, 0, 0.005]}>
            <planeGeometry args={[1.12, 0.08]} />
            <meshBasicMaterial color="#39ff14" toneMapped={false} />
          </mesh>
        </group>

        {/* DEFEATED / CLEARED + LOOT below */}
        <mesh ref={(m) => { refs.banner = m; }} position={[0, -r - 0.18 - bannerW / banner.aspect / 2, 0.05]} visible={false}>
          <planeGeometry args={[bannerW, bannerW / banner.aspect]} />
          <meshBasicMaterial ref={(m) => { refs.bannerMat = m; }} map={banner.texture} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

export const BossBattleRide: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const { scene } = useThree();
  const defeatedCount = BOSSES.filter((b) => b.loot).length;
  const signSub = `${defeatedCount} BOSSES DEFEATED · ${BOSSES.length - defeatedCount} CLEARED`;
  const tex = useBossTextures(signSub);
  const bossRefs = useMemo(() => BOSSES.map((): BossRefs => ({ group: null, body: null, eyes: null, hpFill: null, hpGroup: null, banner: null, bannerMat: null, ring: null, name: null })), []);

  const smokeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const smokeMat = useRef<THREE.MeshStandardMaterial>(null);
  const countRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const beamMat = useRef<THREE.MeshBasicMaterial>(null);
  const signRef = useRef<THREE.Mesh>(null);
  const signMat = useRef<THREE.MeshBasicMaterial>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  const beltRef = useRef<THREE.Group>(null);
  const sky = useMemo(() => new THREE.Color(), []);
  const tmpA = useMemo(() => new THREE.Vector3(), []);
  const tmpB = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  // Pixel clouds (cloud layer, altitude ~12–24) and rocks (asteroid belt, ~53–60): one draw call each
  const clouds = useMemo(() => {
    const rand = seeded(31);
    const boxes: { p: Vec; s: Vec }[] = [];
    for (let i = 0; i < 12; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const behind = i % 3 !== 0;
      const cx = BOSS_ROCKET.x + side * (behind ? 1 + rand() * 7 : 5 + rand() * 4);
      const cz = BOSS_ROCKET.z + (behind ? -4 - rand() * 4 : 1 + rand() * 2);
      const cy = BOSS_ROCKET.padTop + 12 + rand() * 13;
      const w = 1.4 + rand() * 1.6;
      boxes.push({ p: [cx, cy, cz], s: [w, 0.5, 0.9] });
      boxes.push({ p: [cx - w * 0.25, cy + 0.4, cz], s: [w * 0.5, 0.4, 0.8] });
      boxes.push({ p: [cx + w * 0.2, cy + 0.3, cz + 0.1], s: [w * 0.4, 0.35, 0.7] });
    }
    return boxes;
  }, []);
  const rocks = useMemo(() => {
    const rand = seeded(77);
    const list: { p: Vec; s: number; r: Vec }[] = [];
    for (let i = 0; i < 40; i++) {
      const side = rand() < 0.5 ? -1 : 1;
      const back = rand() < 0.7;
      list.push({
        p: [BOSS_ROCKET.x + side * (back ? rand() * 9 : 4.5 + rand() * 4), BOSS_ROCKET.padTop + 53 + rand() * 9, BOSS_ROCKET.z + (back ? -3 - rand() * 6 : -1 + rand() * 3)],
        s: 0.12 + rand() * 0.3,
        r: [rand() * 6, rand() * 6, rand() * 6],
      });
    }
    return list;
  }, []);
  const cloudMesh = useRef<THREE.InstancedMesh>(null);
  const rockMesh = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const d = new THREE.Object3D();
    if (cloudMesh.current) {
      clouds.forEach((c, i) => { d.position.set(...c.p); d.rotation.set(0, 0, 0); d.scale.set(...c.s); d.updateMatrix(); cloudMesh.current!.setMatrixAt(i, d.matrix); });
      cloudMesh.current.instanceMatrix.needsUpdate = true;
    }
    if (rockMesh.current) {
      rocks.forEach((c, i) => { d.position.set(...c.p); d.rotation.set(...c.r); d.scale.setScalar(c.s); d.updateMatrix(); rockMesh.current!.setMatrixAt(i, d.matrix); });
      rockMesh.current.instanceMatrix.needsUpdate = true;
    }
  }, [clouds, rocks]);

  // Leaving the world: put the sky and fog back as the map has them.
  useEffect(() => () => {
    if (scene.background instanceof THREE.Color) scene.background.set(SKY_COLOR);
    if (scene.fog instanceof THREE.Fog) { scene.fog.color.set(SKY_COLOR); scene.fog.near = 30; scene.fog.far = 85; }
  }, [scene]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = rocketStateAt(getRideProgress(), reducedMotion);
    const { x } = s;

    // sky + fog: fog thins with height so the island stays visible from orbit
    skyAt(clamp01(s.alt / BOSS_ORBIT.alt), sky);
    if (scene.background instanceof THREE.Color) scene.background.copy(sky);
    if (scene.fog instanceof THREE.Fog) {
      const g = smooth(clamp01(s.alt / 30));
      scene.fog.color.copy(sky);
      scene.fog.near = 30 + 30 * g;
      scene.fog.far = 85 + 215 * g;
    }

    // bosses: HP drains on approach, then DEFEATED / CLEARED + LOOT (all visible in the orbit overview)
    const overview = x > LAST - 0.8;
    BOSSES.forEach((b, i) => {
      const r = bossRefs[i];
      if (!r.group) return;
      const d = x - b.chapter;
      r.group.visible = overview || Math.abs(d) < 1.6;
      if (!r.group.visible) return;
      const defeated = reducedMotion ? x >= b.chapter : d >= DEFEAT_AT;
      const hp = reducedMotion ? (defeated ? 0 : 1) : clamp01((-d + DEFEAT_AT) / 0.34);
      if (r.hpFill) {
        r.hpFill.scale.x = Math.max(0.001, hp);
        r.hpFill.position.x = -0.56 * (1 - hp);
        (r.hpFill.material as THREE.MeshBasicMaterial).color.set(hp > 0.5 ? '#39ff14' : hp > 0.2 ? '#ffe600' : '#ff2e88');
      }
      if (r.hpGroup) r.hpGroup.visible = !defeated;
      if (r.name) r.name.visible = !overview; // too small to read in the wide orbit shot
      const pop = reducedMotion ? (defeated ? 1 : 0) : smooth(clamp01((d - DEFEAT_AT) / 0.1));
      if (r.banner) { r.banner.visible = pop > 0.01 && !overview; r.banner.scale.setScalar(0.6 + 0.4 * pop); }
      if (r.bannerMat) r.bannerMat.opacity = pop;
      // flash white once as it's defeated, then go dull and close its eyes
      const flash = reducedMotion || !defeated ? 0 : clamp01(1 - (d - DEFEAT_AT) / 0.08);
      if (r.body) {
        r.body.color.set(b.color).lerp(GREY, defeated ? 0.55 : 0);
        r.body.emissive.set(b.color).lerp(GREY, defeated ? 0.6 : 0);
        r.body.emissiveIntensity = (defeated ? 0.15 : 0.35) + flash * 1.6;
      }
      if (r.eyes) r.eyes.scale.y = defeated ? 0.15 : 1;
      const idle = reducedMotion ? 0 : Math.sin(t * 1.3 + i) * 0.08;
      r.group.position.y = b.position[1] + idle;
      if (r.ring && !reducedMotion) r.ring.rotation.z = t * 0.4 + i;
    });

    // launch smoke puffs around the pad
    const k = reducedMotion ? 0 : clamp01((x - 0.85) / 1.5);
    smokeRefs.current.forEach((m, i) => {
      if (!m) return;
      m.visible = k > 0 && k < 1;
      if (!m.visible) return;
      const a = (i / smokeRefs.current.length) * Math.PI * 2;
      const spread = 0.4 + k * 1.4;
      m.position.set(BOSS_ROCKET.x + Math.cos(a) * spread, 0.45 + k * 0.35 + (i % 3) * 0.08, BOSS_ROCKET.z + Math.sin(a) * spread);
      m.scale.setScalar(0.25 + k * (0.9 + (i % 3) * 0.2));
    });
    if (smokeMat.current) smokeMat.current.opacity = 0.75 * (1 - k);

    // countdown: 3 · 2 · 1 · LIFTOFF! (reduced motion: just LIFTOFF! on the countdown chapter)
    const text = reducedMotion
      ? (x === 1 ? 'LIFTOFF!' : '')
      : x < 0.08 ? '' : x < 0.35 ? '3' : x < 0.6 ? '2' : x < 0.85 ? '1' : x < 1.45 ? 'LIFTOFF!' : '';
    tex.setCount(text);
    if (countRef.current) countRef.current.visible = text !== '';

    // clouds drift a little; the belt turns slowly
    if (cloudsRef.current) cloudsRef.current.position.x = reducedMotion ? 0 : Math.sin(t * 0.15) * 0.6;
    if (beltRef.current && !reducedMotion) beltRef.current.rotation.y = Math.sin(t * 0.05) * 0.04;

    // orbit: the dish beams up to the rocket, and MORE COMING lights up
    const rocketBase = BOSS_ROCKET.padTop + s.alt;
    if (beamRef.current) {
      beamRef.current.visible = s.orbit > 0.01;
      if (beamRef.current.visible) {
        tmpA.set(...BOSS_ORBIT.dish);
        tmpB.set(BOSS_ROCKET.x, rocketBase, BOSS_ROCKET.z);
        const len = tmpA.distanceTo(tmpB);
        beamRef.current.position.copy(tmpA).add(tmpB).multiplyScalar(0.5);
        beamRef.current.scale.set(1, len, 1);
        beamRef.current.quaternion.setFromUnitVectors(up, tmpB.sub(tmpA).normalize());
      }
    }
    if (beamMat.current) beamMat.current.opacity = 0.7 * s.orbit;
    if (signRef.current) {
      signRef.current.visible = s.orbit > 0.01;
      // Desktop: beside the column (screen-left of it, in open sky) so the HUD never covers it.
      // Phones: across the upper column, below the tall phone HUD.
      if (state.size.width >= state.size.height) signRef.current.position.set(BOSS_ROCKET.x - 19.6, rocketBase - 10, BOSS_ROCKET.z + 9.9);
      else signRef.current.position.set(BOSS_ROCKET.x, rocketBase - 17, BOSS_ROCKET.z + 2);
    }
    if (signMat.current) signMat.current.opacity = s.orbit;
  });

  const signW = 34;
  const countW = 2.2;

  return (
    <group>
      {BOSSES.map((b, i) => (
        <Boss key={b.id} boss={b} name={tex.names[i]} banner={tex.banners[i]} refs={bossRefs[i]} />
      ))}

      {/* launch smoke */}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} ref={(m) => { smokeRefs.current[i] = m; }} visible={false}>
          <icosahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial ref={i === 0 ? smokeMat : undefined} color="#cbd5e1" flatShading transparent opacity={0.75} depthWrite={false} />
        </mesh>
      ))}

      {/* countdown, beside the rocket on the pad */}
      <mesh ref={countRef} position={[BOSS_ROCKET.x + 1.5, 2.7, BOSS_ROCKET.z + 0.9]} rotation={[0, -0.55, 0]} visible={false}>
        <planeGeometry args={[countW, countW / tex.countdown.aspect]} />
        <meshBasicMaterial map={tex.countdown.texture} transparent depthWrite={false} toneMapped={false} />
      </mesh>

      <group ref={cloudsRef}>
        <instancedMesh ref={cloudMesh} args={[undefined, undefined, clouds.length]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8f84c9" emissive="#3b2a6b" emissiveIntensity={0.5} flatShading />
        </instancedMesh>
      </group>
      <group ref={beltRef}>
        <instancedMesh ref={rockMesh} args={[undefined, undefined, rocks.length]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#6b6b8f" emissive="#2a1838" emissiveIntensity={0.6} flatShading />
        </instancedMesh>
      </group>

      {/* orbit: dish beam + MORE COMING */}
      <mesh ref={beamRef} visible={false}>
        <cylinderGeometry args={[0.35, 0.35, 1, 8, 1, true]} />
        <meshBasicMaterial ref={beamMat} color="#ff2e88" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={signRef} rotation={[0, Math.atan2(0.45, 0.88), 0]} visible={false}>
        <planeGeometry args={[signW, signW / tex.sign.aspect]} />
        <meshBasicMaterial ref={signMat} map={tex.sign.texture} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
};

type Vec = [number, number, number];
