import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ProjectsIsland: React.FC = () => {
  const dishRef = useRef<THREE.Group>(null);
  const crystalRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Slow satellite dish scan
    if (dishRef.current) {
      dishRef.current.rotation.y = Math.sin(t * 0.5) * 0.5 + 0.3;
    }
    // Hovering energy crystal
    if (crystalRef.current) {
      crystalRef.current.rotation.y = t * 1.2;
      crystalRef.current.rotation.x = Math.sin(t) * 0.3;
      crystalRef.current.position.y = 1.6 + Math.sin(t * 2) * 0.12;
    }
    // Rotating holographic ring
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.8;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* --- ROCKET LAUNCHPAD / GANTRY --- */}
      <group position={[-1.1, 0, -0.7]}>
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
          <mesh position={[-0.35, 2.1, 0]} castShadow>
            <boxGeometry args={[0.6, 0.12, 0.12]} />
            <meshStandardMaterial color="#dc2626" metalness={0.5} />
          </mesh>
        </group>

        {/* Space Rocket */}
        <group position={[0, 0.4, 0]}>
          {/* Main Fuselage */}
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.28, 0.32, 1.6, 12]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.4} />
          </mesh>
          {/* Nose Cone */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <coneGeometry args={[0.28, 0.65, 12]} />
            <meshStandardMaterial color="#10b981" roughness={0.2} />
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
              <meshStandardMaterial color="#10b981" />
            </mesh>
          ))}
          {/* Engine Glow */}
          <pointLight position={[0, 0.1, 0]} color="#10b981" intensity={0.7} distance={2} />
        </group>
      </group>

      {/* --- HOLOGRAPHIC TECH TERMINAL / CORE --- */}
      <group position={[1.1, 0, 0.6]}>
        {/* Terminal Pedestal */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.8, 1.0, 6]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Glowing Holographic Ring */}
        <mesh ref={ringRef} position={[0, 1.25, 0]} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.6, 0.03, 12, 24]} />
          <meshBasicMaterial color="#34d399" wireframe />
        </mesh>

        {/* Floating Energy Core Crystal */}
        <mesh ref={crystalRef} position={[0, 1.6, 0]}>
          <octahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#34d399"
            emissiveIntensity={1.4}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
        <pointLight position={[0, 1.6, 0]} color="#34d399" intensity={1.5} distance={3.5} />
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
        <meshBasicMaterial color="#10b981" />
      </mesh>
    </group>
  );
};
