import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ProfessionalIsland: React.FC = () => {
  const ledRef = useRef<THREE.Mesh>(null);
  const monitorGlowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Blinking server LEDs
    if (ledRef.current) {
      const mat = ledRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = Math.sin(t * 8) > 0 ? 1.5 : 0.2;
      }
    }
    // Subtle monitor glow flicker
    if (monitorGlowRef.current) {
      monitorGlowRef.current.intensity = 0.8 + Math.sin(t * 3) * 0.15;
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

        {/* Glass Windows Grid Front */}
        {[-0.4, 0, 0.4].map((x, i) =>
          [0.6, 1.2, 1.8, 2.4, 3.0].map((y, j) => (
            <mesh key={`${i}-${j}`} position={[x, y, 0.66]}>
              <planeGeometry args={[0.26, 0.42]} />
              <meshStandardMaterial
                color="#60a5fa"
                emissive="#3b82f6"
                emissiveIntensity={((i + j) % 3 === 0) ? 0.7 : 0.2}
                roughness={0.1}
              />
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
        <mesh position={[0.4, 4.38, 0.2]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* --- WORKSTATION (DESK, DUAL MONITORS, CHAIR) --- */}
      <group position={[0.8, 0, 0.4]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Desk Surface */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.8, 0.08, 0.9]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Desk Legs */}
        <mesh position={[-0.8, 0.37, -0.35]}>
          <boxGeometry args={[0.06, 0.74, 0.06]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        <mesh position={[0.8, 0.37, -0.35]}>
          <boxGeometry args={[0.06, 0.74, 0.06]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        <mesh position={[-0.8, 0.37, 0.35]}>
          <boxGeometry args={[0.06, 0.74, 0.06]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        <mesh position={[0.8, 0.37, 0.35]}>
          <boxGeometry args={[0.06, 0.74, 0.06]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>

        {/* Dual Monitors */}
        {/* Left Monitor */}
        <group position={[-0.35, 1.05, -0.15]} rotation={[0, 0.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.65, 0.45, 0.04]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.022]}>
            <planeGeometry args={[0.6, 0.4]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* Right Monitor */}
        <group position={[0.35, 1.05, -0.15]} rotation={[0, -0.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.65, 0.45, 0.04]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.022]}>
            <planeGeometry args={[0.6, 0.4]} />
            <meshStandardMaterial color="#818cf8" emissive="#4f46e5" emissiveIntensity={0.8} />
          </mesh>
        </group>

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

        {/* Coffee Mug with Steaming Vapor */}
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

      {/* --- MINI SERVER RACK --- */}
      <group position={[-0.1, 0, 1.4]} rotation={[0, 0.3, 0]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[0.7, 1.5, 0.6]} />
          <meshStandardMaterial color="#0b0f19" roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Blinking Status LED */}
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
