import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CAREER_FLOORS, careerElevator } from '../../../data/worldRides';
import { getRideProgress } from '../../world/rideStore';

interface ProfessionalIslandProps {
  /** true while the visitor is inside WORLD 2 (Career Mode): the scroll ride drives the scene */
  rideActive?: boolean;
  reducedMotion?: boolean;
}

const CYAN = new THREE.Color('#00f0ff');
const STUDY = new THREE.Color('#a0a0c0'); // the XLRI floor: lit softly, it's study not a job
const OFF = new THREE.Color('#1e293b');
const RED = new THREE.Color('#ef4444');

const WINDOW_X = [-0.4, 0, 0.4];
const WINDOW_Y = [0.6, 1.2, 1.8, 2.4, 3.0]; // = CAREER_FLOORS lobby → kotak
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Same chapter maths as RideController, so the elevator always matches the camera. */
function elevatorAt(p: number, reduced: boolean) {
  const n = careerElevator.length;
  const x = p * (n - 1);
  const a = Math.min(n - 2, Math.floor(x));
  const f = x - a;
  const t = reduced ? (f < 0.5 ? 0 : 1) : smooth(f);
  return careerElevator[a] + (careerElevator[a + 1] - careerElevator[a]) * t;
}

export const ProfessionalIsland: React.FC<ProfessionalIslandProps> = ({ rideActive = false, reducedMotion = false }) => {
  const ledRef = useRef<THREE.Mesh>(null);
  const monitorGlowRef = useRef<THREE.PointLight>(null);
  const carRef = useRef<THREE.Mesh>(null);
  const boardRef = useRef<THREE.Group>(null);
  const ledPhase = useRef(0);

  // One material per window / screen so each can light up on its own.
  const windows = useMemo(
    () => WINDOW_X.map((_, i) => WINDOW_Y.map((_, j) => {
      const base = ((i + j) % 3 === 0) ? 0.7 : 0.2;
      const m = new THREE.MeshStandardMaterial({ color: '#60a5fa', emissive: '#3b82f6', emissiveIntensity: base, roughness: 0.1 });
      m.userData.base = base;
      return m;
    })),
    [],
  );
  const screens = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: '#38bdf8', emissive: '#0284c7', emissiveIntensity: 0.8 }),
    new THREE.MeshStandardMaterial({ color: '#818cf8', emissive: '#4f46e5', emissiveIntensity: 0.8 }),
  ], []);
  const beacon = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ef4444' }), []);
  useEffect(() => () => { windows.flat().forEach((m) => m.dispose()); screens.forEach((m) => m.dispose()); beacon.dispose(); }, [windows, screens, beacon]);

  // Leaving the world: put the island back exactly as it looks on the map.
  useEffect(() => {
    if (rideActive) return;
    windows.forEach((col) => col.forEach((m) => {
      m.color.set('#60a5fa'); m.emissive.set('#3b82f6'); m.emissiveIntensity = m.userData.base;
    }));
    screens[0].color.set('#38bdf8'); screens[0].emissiveIntensity = 0.8;
    screens[1].color.set('#818cf8'); screens[1].emissiveIntensity = 0.8;
    beacon.color.copy(RED);
  }, [rideActive, windows, screens, beacon]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    let ledSpeed = 8;

    if (rideActive) {
      const p = getRideProgress();
      const boot = clamp01(p / 0.03); // first bit of scroll: power on
      const y = elevatorAt(p, reducedMotion);

      // Floors light up as the elevator reaches them, and switch off again on the way down.
      windows.forEach((col) => col.forEach((m, j) => {
        const rowY = WINDOW_Y[j];
        const lit = j === 0 ? boot : clamp01((y - (rowY - 0.35)) / 0.3);
        const study = rowY === CAREER_FLOORS.xlri;
        m.color.copy(OFF).lerp(study ? STUDY : CYAN, lit * 0.6);
        m.emissive.copy(study ? STUDY : CYAN);
        m.emissiveIntensity = lit * (study ? 0.25 : 0.85);
      }));

      // Desk monitors boot on the first scroll.
      screens.forEach((m) => { m.color.copy(OFF).lerp(CYAN, boot * 0.5); m.emissive.copy(CYAN); m.emissiveIntensity = boot * 0.9; });

      // Elevator car rides up the side of the tower.
      if (carRef.current) carRef.current.position.y = y;

      // Penthouse: servers get busy. Roof: the antenna light turns cyan and the stats board rises.
      if (y > CAREER_FLOORS.kotak - 0.2 && y < CAREER_FLOORS.roof - 0.1) ledSpeed = 20;
      const roof = clamp01((y - CAREER_FLOORS.kotak) / (CAREER_FLOORS.roof - CAREER_FLOORS.kotak));
      beacon.color.copy(RED).lerp(CYAN, roof);
      if (boardRef.current) {
        boardRef.current.position.y = 3.7 - 0.6 + roof * 0.6;
        boardRef.current.visible = roof > 0.01;
      }
      if (monitorGlowRef.current) monitorGlowRef.current.intensity = boot * 0.9;
    } else if (monitorGlowRef.current) {
      monitorGlowRef.current.intensity = reducedMotion ? 0.8 : 0.8 + Math.sin(t * 3) * 0.15;
    }

    // Blinking server LED (steady when motion is reduced)
    if (ledRef.current) {
      ledPhase.current += delta * ledSpeed;
      const mat = ledRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = reducedMotion ? 1.2 : Math.sin(ledPhase.current) > 0 ? 1.5 : 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* --- MINI GLASS OFFICE TOWER --- */}
      <group position={[-1.2, 0, -1.0]}>
        {/* Main Skyscraper Body */}
        <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 3.6, 1.3]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Glass Windows Grid Front: each row is a floor of the career ride */}
        {WINDOW_X.map((x, i) =>
          WINDOW_Y.map((y, j) => (
            <mesh key={`${i}-${j}`} position={[x, y, 0.66]} material={windows[i][j]}>
              <planeGeometry args={[0.26, 0.42]} />
            </mesh>
          ))
        )}

        {/* Roof Heli-pad / Tech Antenna */}
        <mesh position={[0, 3.65, 0]}>
          <boxGeometry args={[1.3, 0.1, 1.1]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0.4, 4.0, 0.2]}>
          <cylinderGeometry args={[0.02, 0.04, 0.7, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
        <mesh position={[0.4, 4.38, 0.2]} material={beacon}>
          <sphereGeometry args={[0.06, 6, 6]} />
        </mesh>

        {/* Ride only: elevator shaft + car on the left face, and the PLAYER STATS board on the roof */}
        {rideActive && (
          <>
            <mesh position={[-0.77, 1.95, 0.45]}>
              <boxGeometry args={[0.03, 3.3, 0.03]} />
              <meshBasicMaterial color="#007a85" />
            </mesh>
            <mesh ref={carRef} position={[-0.8, 0.6, 0.45]}>
              <boxGeometry args={[0.1, 0.24, 0.2]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
            <group ref={boardRef} position={[-0.15, 3.1, -0.1]} visible={false}>
              <mesh position={[0, 0.42, 0]}>
                <boxGeometry args={[0.9, 0.5, 0.04]} />
                <meshBasicMaterial color="#14142b" />
              </mesh>
              <mesh position={[0, 0.42, -0.005]}>
                <boxGeometry args={[0.98, 0.58, 0.03]} />
                <meshBasicMaterial color="#00f0ff" />
              </mesh>
              {[0.3, 0.42, 0.54].map((y, k) => (
                <mesh key={y} position={[-0.1 + k * 0.05, y, 0.025]}>
                  <planeGeometry args={[0.5 - k * 0.1, 0.05]} />
                  <meshBasicMaterial color="#39ff14" />
                </mesh>
              ))}
              <mesh position={[-0.3, 0.08, 0]}>
                <boxGeometry args={[0.04, 0.18, 0.04]} />
                <meshBasicMaterial color="#334155" />
              </mesh>
              <mesh position={[0.3, 0.08, 0]}>
                <boxGeometry args={[0.04, 0.18, 0.04]} />
                <meshBasicMaterial color="#334155" />
              </mesh>
            </group>
          </>
        )}
      </group>

      {/* --- WORKSTATION (DESK, DUAL MONITORS, CHAIR) --- */}
      <group position={[0.8, 0, 0.4]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Desk Surface */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.8, 0.08, 0.9]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Desk Legs */}
        {[[-0.8, -0.35], [0.8, -0.35], [-0.8, 0.35], [0.8, 0.35]].map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, 0.37, z]}>
            <boxGeometry args={[0.06, 0.74, 0.06]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
        ))}

        {/* Dual Monitors: they boot up at the start of the ride */}
        {[[-0.35, 0.2], [0.35, -0.2]].map(([x, ry], k) => (
          <group key={k} position={[x, 1.05, -0.15]} rotation={[0, ry, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.65, 0.45, 0.04]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 0, 0.022]} material={screens[k]}>
              <planeGeometry args={[0.6, 0.4]} />
            </mesh>
          </group>
        ))}

        {/* Monitor Screen Glow */}
        <pointLight ref={monitorGlowRef} position={[0, 1.1, 0.2]} intensity={0.9} distance={2.5} color="#38bdf8" />

        {/* Mechanical Keyboard & Mouse */}
        <mesh position={[0, 0.8, 0.15]}>
          <boxGeometry args={[0.5, 0.02, 0.2]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0.42, 0.8, 0.15]}>
          <boxGeometry args={[0.08, 0.02, 0.12]} />
          <meshStandardMaterial color="#475569" />
        </mesh>

        {/* Coffee Mug */}
        <mesh position={[-0.6, 0.84, 0.15]}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>

        {/* Ergonomic Office Chair */}
        <group position={[0, 0, 0.75]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.5, 0.08, 0.48]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.85, 0.2]} castShadow>
            <boxGeometry args={[0.48, 0.65, 0.06]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* --- MINI SERVER RACK: LEDs speed up in the penthouse --- */}
      <group position={[-0.1, 0, 1.4]} rotation={[0, 0.3, 0]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[0.7, 1.5, 0.6]} />
          <meshStandardMaterial color="#0b0f19" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh ref={ledRef} position={[0.22, 1.35, 0.31]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0.22, 1.15, 0.31]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.9} />
        </mesh>
      </group>
    </group>
  );
};
