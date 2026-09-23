import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const TravelIsland: React.FC = () => {
  const planeRef = useRef<THREE.Group>(null);
  const campfireLightRef = useRef<THREE.PointLight>(null);
  const emberRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Orbiting mini paper airplane
    if (planeRef.current) {
      const radius = 2.4;
      const speed = 0.9;
      planeRef.current.position.x = Math.cos(t * speed) * radius;
      planeRef.current.position.z = Math.sin(t * speed) * radius;
      planeRef.current.position.y = 2.2 + Math.sin(t * 2) * 0.2;
      planeRef.current.rotation.y = -t * speed + Math.PI / 2;
      planeRef.current.rotation.z = 0.25; // banking tilt
    }

    // Campfire flicker
    if (campfireLightRef.current) {
      campfireLightRef.current.intensity = 1.2 + Math.sin(t * 12) * 0.3 + Math.cos(t * 19) * 0.2;
    }
    if (emberRef.current) {
      emberRef.current.position.y = 0.4 + (Math.sin(t * 6) + 1) * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* --- A-FRAME CAMPING TENT --- */}
      <group position={[-1.1, 0, -0.6]} rotation={[0, 0.4, 0]}>
        {/* Tent Body (Prism) */}
        <mesh position={[0, 0.65, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.3, 1.3, 4]} />
          <meshStandardMaterial color="#0891b2" roughness={0.6} />
        </mesh>
        {/* Tent Entrance Flap */}
        <mesh position={[0, 0.4, 0.7]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.55, 0.8]} />
          <meshStandardMaterial color="#164e63" />
        </mesh>
      </group>

      {/* --- CRACKLING CAMPFIRE --- */}
      <group position={[0.4, 0, -0.4]}>
        {/* Fire Pit Stone Circle */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i * Math.PI) / 3;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.45, 0.08, Math.sin(angle) * 0.45]}
              castShadow
            >
              <dodecahedronGeometry args={[0.12]} />
              <meshStandardMaterial color="#64748b" roughness={0.9} />
            </mesh>
          );
        })}

        {/* Campfire Logs */}
        <mesh position={[0, 0.12, 0]} rotation={[0, 0.5, 0.4]}>
          <cylinderGeometry args={[0.06, 0.08, 0.7, 6]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        <mesh position={[0, 0.12, 0]} rotation={[0, -0.8, -0.4]}>
          <cylinderGeometry args={[0.06, 0.08, 0.7, 6]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>

        {/* Fire Flames */}
        <mesh position={[0, 0.35, 0]}>
          <coneGeometry args={[0.22, 0.48, 6]} />
          <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={1.5} />
        </mesh>
        <mesh ref={emberRef} position={[0, 0.4, 0]}>
          <octahedronGeometry args={[0.12]} />
          <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={2} />
        </mesh>

        {/* Campfire Light */}
        <pointLight ref={campfireLightRef} position={[0, 0.5, 0]} color="#f97316" intensity={1.5} distance={3.5} />
      </group>

      {/* --- PINE TREES (ALPINE BIOME) --- */}
      <group position={[1.2, 0, 0.8]}>
        {/* Tree 1 */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.8, 6]} />
          <meshStandardMaterial color="#3f2314" />
        </mesh>
        <mesh position={[0, 1.0, 0]} castShadow>
          <coneGeometry args={[0.7, 0.9, 6]} />
          <meshStandardMaterial color="#14532d" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.6, 0]} castShadow>
          <coneGeometry args={[0.55, 0.8, 6]} />
          <meshStandardMaterial color="#166534" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.1, 0]} castShadow>
          <coneGeometry args={[0.38, 0.65, 6]} />
          <meshStandardMaterial color="#15803d" roughness={0.7} />
        </mesh>
      </group>

      {/* Smaller Pine Tree */}
      <group position={[1.5, 0, -0.2]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.6, 6]} />
          <meshStandardMaterial color="#3f2314" />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
          <coneGeometry args={[0.45, 0.7, 6]} />
          <meshStandardMaterial color="#166534" />
        </mesh>
        <mesh position={[0, 1.25, 0]} castShadow>
          <coneGeometry args={[0.3, 0.55, 6]} />
          <meshStandardMaterial color="#15803d" />
        </mesh>
      </group>

      {/* --- DESTINATION SIGNPOST --- */}
      <group position={[-0.4, 0, 1.3]} rotation={[0, -0.2, 0]}>
        {/* Post */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 1.5, 6]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        {/* Arrow Signs pointing in different directions */}
        <mesh position={[0.15, 1.25, 0]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.5, 0.12, 0.04]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <mesh position={[-0.15, 1.05, 0]} rotation={[0, -0.4, 0]}>
          <boxGeometry args={[0.5, 0.12, 0.04]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
        <mesh position={[0.12, 0.85, 0]} rotation={[0, 0.6, 0]}>
          <boxGeometry args={[0.45, 0.12, 0.04]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
      </group>

      {/* Traveler Luggage / Backpack */}
      <mesh position={[-0.9, 0.2, 0.4]} rotation={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.38, 0.4, 0.25]} />
        <meshStandardMaterial color="#c2410c" roughness={0.5} />
      </mesh>

      {/* --- ORBITING MINI AIRPLANE --- */}
      <group ref={planeRef}>
        {/* Fuselage */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.1, 0.45, 6]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Wings */}
        <mesh position={[-0.05, 0, 0]}>
          <boxGeometry args={[0.15, 0.02, 0.7]} />
          <meshStandardMaterial color="#06b6d4" />
        </mesh>
        {/* Tail Fin */}
        <mesh position={[-0.2, 0.08, 0]}>
          <boxGeometry args={[0.08, 0.14, 0.02]} />
          <meshStandardMaterial color="#06b6d4" />
        </mesh>
      </group>
    </group>
  );
};
