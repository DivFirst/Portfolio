import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getRideProgress } from '../../world/rideStore';
import { rideKit } from '../../world/rideKits';
import type { QuestTextures } from './hobby/hobbyTextures';

interface HobbyIslandProps {
  /** true while the visitor is inside WORLD 4 (Side Quests): the scroll ride dives into the cabinet */
  rideActive?: boolean;
  reducedMotion?: boolean;
}

export const HobbyIsland: React.FC<HobbyIslandProps> = ({ rideActive = false, reducedMotion = false }) => {
  const noteRef1 = useRef<THREE.Mesh>(null);
  const noteRef2 = useRef<THREE.Mesh>(null);
  const screenMat = useRef<THREE.MeshStandardMaterial>(null);
  // The ride's pixel textures (made by the World 4 ride kit, downloaded on entry)
  const [tex, setTex] = useState<QuestTextures | null>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // The cabinet screen: "SIDE QUESTS / PRESS ▼" in the ride, "ALL QUESTS CLEAR!" after the game
    const m = screenMat.current;
    if (m) {
      const want = rideActive && tex ? (rideKit('hobby').questStateAt(getRideProgress(), reducedMotion).x > 4 ? tex.screenClear : tex.screenStart) : null;
      if (m.map !== want) {
        m.map = want;
        m.emissiveMap = want;
        m.color.set(want ? '#ffffff' : '#38bdf8');
        m.emissive.set(want ? '#ffffff' : '#0284c7');
        m.needsUpdate = true;
      }
    }
    // Floating music notes
    if (noteRef1.current) {
      noteRef1.current.position.y = 1.6 + Math.sin(t * 2) * 0.2;
      noteRef1.current.rotation.y = t * 1.5;
    }
    if (noteRef2.current) {
      noteRef2.current.position.y = 1.9 + Math.sin(t * 2 + 1.2) * 0.2;
      noteRef2.current.rotation.y = -t * 1.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* --- RETRO ARCADE CABINET --- */}
      <group position={[-1.2, 0, -0.6]} rotation={[0, 0.4, 0]}>
        {/* Main Cabinet Body */}
        <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 2.2, 0.8]} />
          <meshStandardMaterial color="#18181b" roughness={0.3} />
        </mesh>
        {/* Marquee Header */}
        <mesh position={[0, 2.05, 0.2]}>
          <boxGeometry args={[0.82, 0.22, 0.45]} />
          <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={0.6} />
        </mesh>
        {/* CRT Screen */}
        {/* sits just proud of the cabinet's front face (it used to be hidden inside the box) */}
        <mesh position={[0, 1.35, 0.415]}>
          <planeGeometry args={[0.68, 0.52]} />
          <meshStandardMaterial ref={screenMat} color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.7} />
        </mesh>
        {/* Control Panel with Joystick & Buttons */}
        <mesh position={[0, 0.95, 0.42]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.78, 0.08, 0.3]} />
          <meshStandardMaterial color="#27272a" />
        </mesh>
        <mesh position={[-0.2, 1.05, 0.42]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <pointLight position={[0, 1.35, 0.6]} color="#f43f5e" intensity={0.8} distance={2.5} />
      </group>

      {/* --- ARTIST'S EASEL & PAINTING --- */}
      <group position={[0.9, 0, -0.9]} rotation={[0, -0.3, 0]}>
        {/* Easel Wooden Legs */}
        <mesh position={[-0.35, 1.0, 0]} rotation={[0, 0, 0.15]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 2.1, 6]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[0.35, 1.0, 0]} rotation={[0, 0, -0.15]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 2.1, 6]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[0, 1.0, -0.4]} rotation={[-0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 2.1, 6]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>

        {/* Canvas on Easel */}
        <mesh position={[0, 1.2, 0.08]} rotation={[-0.1, 0, 0]} castShadow>
          <boxGeometry args={[0.95, 0.75, 0.04]} />
          <meshStandardMaterial color="#fdf4ff" roughness={0.5} />
        </mesh>
        {/* Colorful Abstract Art on Canvas */}
        <mesh position={[0, 1.2, 0.11]} rotation={[-0.1, 0, 0]}>
          <planeGeometry args={[0.88, 0.68]} />
          <meshStandardMaterial color="#ec4899" emissive="#db2777" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* --- ACOUSTIC GUITAR & MUSIC STAND --- */}
      <group position={[0.5, 0, 0.9]} rotation={[0, -0.5, 0.2]}>
        {/* Guitar Body (Dual Ellipsoids) */}
        <mesh position={[0, 0.55, 0]} scale={[1, 1.1, 0.35]} castShadow>
          <sphereGeometry args={[0.38, 12, 12]} />
          <meshStandardMaterial color="#b45309" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.9, 0]} scale={[0.8, 0.9, 0.3]} castShadow>
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshStandardMaterial color="#b45309" roughness={0.3} />
        </mesh>
        {/* Soundhole */}
        <mesh position={[0, 0.72, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
          <meshBasicMaterial color="#1c1917" />
        </mesh>
        {/* Neck & Headstock */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[0.08, 0.9, 0.04]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        <mesh position={[0, 1.9, 0]} castShadow>
          <boxGeometry args={[0.12, 0.2, 0.04]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
      </group>

      {/* Floating Music Notes */}
      <mesh ref={noteRef1} position={[0.8, 1.6, 0.8]}>
        <torusGeometry args={[0.08, 0.03, 8, 12]} />
        <meshBasicMaterial color="#f472b6" />
      </mesh>
      <mesh ref={noteRef2} position={[0.2, 1.9, 1.1]}>
        <octahedronGeometry args={[0.07, 0]} />
        <meshBasicMaterial color="#fb7185" />
      </mesh>

      {/* Vintage Camera on Tripod */}
      <group position={[-0.5, 0, 1.3]}>
        {/* Tripod Legs */}
        {[-0.15, 0, 0.15].map((off, i) => (
          <mesh key={i} position={[off, 0.45, (i === 1 ? -0.15 : 0.1)]} rotation={[0, 0, off * 0.8]}>
            <cylinderGeometry args={[0.02, 0.02, 0.9, 6]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        ))}
        {/* Camera Body */}
        <mesh position={[0, 0.95, 0]}>
          <boxGeometry args={[0.26, 0.18, 0.16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.6} />
        </mesh>
        {/* Lens */}
        <mesh position={[0, 0.95, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.1, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
      </group>

      {rideActive && <RideOnly tex={tex} onTextures={setTex} reducedMotion={reducedMotion} />}
    </group>
  );
};

/** The side-scroller inside the cabinet (World 4 ride kit, downloaded on entry) */
const RideOnly: React.FC<{ tex: QuestTextures | null; onTextures: (t: QuestTextures | null) => void; reducedMotion: boolean }> = ({ tex, onTextures, reducedMotion }) => {
  const { QuestTextureMaker, SideScroller } = rideKit('hobby');
  return (
    <>
      <QuestTextureMaker onChange={onTextures} />
      <SideScroller tex={tex} reducedMotion={reducedMotion} />
    </>
  );
};
