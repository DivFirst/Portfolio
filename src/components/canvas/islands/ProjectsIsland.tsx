import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BOSS_ROCKET } from '../../../data/worldRides';
import { getRideProgress } from '../../world/rideStore';
import { BossBattleRide, rocketStateAt } from './bosses/BossBattleRide';

interface ProjectsIslandProps {
  /** true while the visitor is inside WORLD 3 (Boss Battles): the scroll ride drives the rocket */
  rideActive?: boolean;
  reducedMotion?: boolean;
}

// World 3 accent (DESIGN.md §2): pink
const PINK = '#ff2e88';
const PINK_GLOW = '#ff6fb0';

export const ProjectsIsland: React.FC<ProjectsIslandProps> = ({ rideActive = false, reducedMotion = false }) => {
  const dishRef = useRef<THREE.Group>(null);
  const crystalRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const rocketRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Group>(null);
  const flameInner = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const ride = rideActive ? rocketStateAt(getRideProgress(), reducedMotion) : null;

    // Satellite dish: slow scan on the map; in the ride it turns up to track the rocket
    if (dishRef.current) {
      const scan = reducedMotion ? 0.3 : Math.sin(t * 0.5) * 0.5 + 0.3;
      dishRef.current.rotation.y = ride ? scan * (1 - ride.orbit) : scan;
      dishRef.current.rotation.x = ride ? -0.4 * ride.orbit : 0;
    }
    if (crystalRef.current) {
      crystalRef.current.rotation.y = reducedMotion ? 0.4 : t * 1.2;
      crystalRef.current.rotation.x = reducedMotion ? 0 : Math.sin(t) * 0.3;
      crystalRef.current.position.y = 1.6 + (reducedMotion ? 0 : Math.sin(t * 2) * 0.12);
    }
    if (ringRef.current && !reducedMotion) ringRef.current.rotation.z = -t * 0.8;

    // Rocket climb, gantry arm swing and engine flame all follow the scroll
    if (rocketRef.current) rocketRef.current.position.y = BOSS_ROCKET.padTop + (ride ? ride.alt : 0);
    if (armRef.current) armRef.current.rotation.y = ride ? ride.arm * (Math.PI / 2) : 0;
    if (flameRef.current) {
      const on = ride ? ride.flame : 0;
      flameRef.current.visible = on > 0.01;
      const flicker = reducedMotion ? 1 : 0.85 + (Math.floor(t * 12) % 2) * 0.25; // stepped, ~6 Hz, no flashing
      flameRef.current.scale.set(on, on * flicker * (ride ? 1 + ride.thrust * 0.8 : 1), on);
      if (flameInner.current) flameInner.current.scale.setScalar(reducedMotion ? 1 : 0.9 + (Math.floor(t * 9) % 2) * 0.15);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* --- ROCKET LAUNCHPAD / GANTRY --- */}
      <group position={[BOSS_ROCKET.x, 0, BOSS_ROCKET.z]}>
        {/* Launchpad Base Platform */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.1, 1.2, 0.4, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Gantry Tower Lattice */}
        <group position={[0.7, 0, 0]}>
          <mesh position={[0, 1.4, 0]} castShadow>
            <boxGeometry args={[0.2, 2.4, 0.2]} />
            <meshStandardMaterial color="#dc2626" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Service arm: swings away before liftoff (pivots on the tower) */}
          <group ref={armRef} position={[0, 2.1, 0]}>
            <mesh position={[-0.35, 0, 0]} castShadow>
              <boxGeometry args={[0.6, 0.12, 0.12]} />
              <meshStandardMaterial color="#dc2626" metalness={0.5} />
            </mesh>
          </group>
        </group>

        {/* Space Rocket */}
        <group ref={rocketRef} position={[0, BOSS_ROCKET.padTop, 0]}>
          {/* Main Fuselage */}
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.28, 0.32, 1.6, 12]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.4} />
          </mesh>
          {/* Nose Cone */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <coneGeometry args={[0.28, 0.65, 12]} />
            <meshStandardMaterial color={PINK} roughness={0.3} />
          </mesh>
          {/* Porthole */}
          <mesh position={[0, 1.45, 0.29]}>
            <cylinderGeometry args={[0.09, 0.09, 0.04, 12]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.6} />
          </mesh>
          {/* Engine Exhaust Ring */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.18, 0.26, 0.25, 12]} />
            <meshStandardMaterial color="#475569" metalness={0.9} />
          </mesh>
          {/* Tail Fins */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
            <mesh key={idx} position={[0, 0.45, 0]} rotation={[0, angle, 0]} castShadow>
              <boxGeometry args={[0.8, 0.4, 0.05]} />
              <meshStandardMaterial color={PINK} />
            </mesh>
          ))}
          {/* Engine flame (ride only): pink outer cone, yellow core, pointing down */}
          <group ref={flameRef} position={[0, 0.12, 0]} visible={false}>
            <mesh position={[0, -0.55, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.24, 1.1, 8]} />
              <meshBasicMaterial color={PINK} transparent opacity={0.85} depthWrite={false} />
            </mesh>
            <mesh ref={flameInner} position={[0, -0.35, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.12, 0.65, 8]} />
              <meshBasicMaterial color="#ffe600" />
            </mesh>
          </group>
          {/* Engine Glow */}
          <pointLight position={[0, 0.1, 0]} color={PINK} intensity={0.7} distance={2} />
        </group>
      </group>

      {/* --- HOLOGRAPHIC TECH TERMINAL / CORE --- */}
      <group position={[1.1, 0, 0.6]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.8, 1.0, 6]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh ref={ringRef} position={[0, 1.25, 0]} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.6, 0.03, 12, 24]} />
          <meshBasicMaterial color={PINK_GLOW} wireframe />
        </mesh>
        <mesh ref={crystalRef} position={[0, 1.6, 0]}>
          <octahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial color={PINK} emissive={PINK_GLOW} emissiveIntensity={1.2} roughness={0.1} metalness={0.8} />
        </mesh>
        <pointLight position={[0, 1.6, 0]} color={PINK_GLOW} intensity={1.5} distance={3.5} />
      </group>

      {/* --- SATELLITE DISH --- */}
      <group ref={dishRef} position={[-0.3, 0, 1.5]}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 1.0, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.0, 0]} rotation={[0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.1, 0.25, 12, 1, true]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Glowing Neon Ground Conduit Cable */}
      <mesh position={[0, 0.05, 0]} rotation={[0, 0.6, 0]}>
        <torusGeometry args={[1.5, 0.03, 8, 16, Math.PI * 0.8]} />
        <meshBasicMaterial color={PINK} />
      </mesh>

      {rideActive && <BossBattleRide reducedMotion={reducedMotion} />}
    </group>
  );
};
