import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const MyLifeIsland: React.FC = () => {
  const smokeRef1 = useRef<THREE.Mesh>(null);
  const smokeRef2 = useRef<THREE.Mesh>(null);
  const fireflyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Chimney smoke rising animation
    if (smokeRef1.current) {
      smokeRef1.current.position.y = 2.4 + ((t * 0.8) % 1.2);
      const s = 0.2 + ((t * 0.8) % 1.2) * 0.2;
      smokeRef1.current.scale.set(s, s, s);
    }
    if (smokeRef2.current) {
      smokeRef2.current.position.y = 2.4 + (((t * 0.8) + 0.6) % 1.2);
      const s = 0.2 + (((t * 0.8) + 0.6) % 1.2) * 0.25;
      smokeRef2.current.scale.set(s, s, s);
    }

    // Fireflies hovering around memory tree
    if (fireflyRef.current) {
      fireflyRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* --- COZY CABIN / HOME --- */}
      <group position={[-1.2, 0, -0.8]}>
        {/* Main Walls */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 1.5, 1.8]} />
          <meshStandardMaterial color="#854d0e" roughness={0.7} />
        </mesh>

        {/* Roof (Gabled Prism) */}
        <mesh position={[0, 1.9, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.65, 0.9, 4]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} />
        </mesh>

        {/* Chimney */}
        <mesh position={[0.55, 1.8, 0.3]} castShadow>
          <boxGeometry args={[0.35, 0.9, 0.35]} />
          <meshStandardMaterial color="#64748b" roughness={0.8} />
        </mesh>

        {/* Smoke Puffs */}
        <mesh ref={smokeRef1} position={[0.55, 2.4, 0.3]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#f1f5f9" transparent opacity={0.5} roughness={0.9} />
        </mesh>
        <mesh ref={smokeRef2} position={[0.55, 2.7, 0.3]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#f1f5f9" transparent opacity={0.35} roughness={0.9} />
        </mesh>

        {/* Front Door */}
        <mesh position={[0, 0.45, 0.91]}>
          <planeGeometry args={[0.45, 0.9]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>

        {/* Glowing Window */}
        <mesh position={[0.55, 0.8, 0.91]}>
          <planeGeometry args={[0.35, 0.45]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
        </mesh>

        {/* Warm Window Light */}
        <pointLight position={[0.55, 0.8, 1.2]} intensity={0.6} distance={3} color="#fef08a" />
      </group>

      {/* --- ANCIENT MEMORY TREE --- */}
      <group position={[1.4, 0, 0.6]}>
        {/* Trunk */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.35, 2.0, 8]} />
          <meshStandardMaterial color="#5c381c" roughness={0.9} />
        </mesh>

        {/* Foliage Layers */}
        <mesh position={[0, 2.1, 0]} castShadow>
          <icosahedronGeometry args={[1.1, 1]} />
          <meshStandardMaterial color="#15803d" roughness={0.6} />
        </mesh>
        <mesh position={[0.3, 2.6, -0.2]} castShadow>
          <icosahedronGeometry args={[0.85, 1]} />
          <meshStandardMaterial color="#22c55e" roughness={0.6} />
        </mesh>
        <mesh position={[-0.3, 2.4, 0.2]} castShadow>
          <icosahedronGeometry args={[0.75, 1]} />
          <meshStandardMaterial color="#16a34a" roughness={0.6} />
        </mesh>

        {/* Orbiting Golden Fireflies */}
        <group ref={fireflyRef} position={[0, 2.2, 0]}>
          <mesh position={[1.2, 0.2, 0]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshBasicMaterial color="#facc15" />
          </mesh>
          <mesh position={[-0.9, -0.3, 0.8]}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshBasicMaterial color="#fde047" />
          </mesh>
          <mesh position={[0.4, 0.5, -1.0]}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
      </group>

      {/* --- PARK BENCH & PATHWAY --- */}
      {/* Wooden Bench */}
      <group position={[0.2, 0, 1.6]} rotation={[0, -0.4, 0]}>
        {/* Seat */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.9, 0.08, 0.35]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.55, -0.14]} rotation={[-0.1, 0, 0]} castShadow>
          <boxGeometry args={[0.9, 0.35, 0.06]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.38, 0.15, 0]}>
          <boxGeometry args={[0.06, 0.3, 0.3]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0.38, 0.15, 0]}>
          <boxGeometry args={[0.06, 0.3, 0.3]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* Street Lantern Post */}
      <group position={[-0.6, 0, 1.7]}>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 1.6, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.65, 0]}>
          <octahedronGeometry args={[0.16]} />
          <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={1} />
        </mesh>
        <pointLight position={[0, 1.65, 0]} intensity={0.8} distance={3} color="#facc15" />
      </group>

      {/* Stepping Stones */}
      {[-0.2, 0.3, 0.8, 1.3].map((pos, idx) => (
        <mesh
          key={idx}
          position={[-0.4 + idx * 0.25, 0.02, pos - 0.2]}
          rotation={[0, idx * 0.5, 0]}
          receiveShadow
        >
          <cylinderGeometry args={[0.22 - idx * 0.02, 0.24, 0.04, 6]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};
