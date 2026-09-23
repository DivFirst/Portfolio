import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CentralBeaconProps {
  onResetView?: () => void;
}

export const CentralBeacon: React.FC<CentralBeaconProps> = ({ onResetView }) => {
  const crystalRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Floating crystal hover and rotation
    if (crystalRef.current) {
      crystalRef.current.position.y = 1.2 + Math.sin(t * 1.5) * 0.15;
      crystalRef.current.rotation.y = t * 0.6;
      crystalRef.current.rotation.z = Math.sin(t * 0.8) * 0.1;
    }

    // Concentric gyro rings
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = t * 0.4;
      outerRingRef.current.rotation.y = t * 0.3;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x = -t * 0.5;
      innerRingRef.current.rotation.z = t * 0.4;
    }
  });

  return (
    <group position={[0, 0, 0]} onClick={onResetView}>
      {/* Central Floating Pedestal */}
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.8, 1.4, 0.8, 6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Runic Inset Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.7, 6]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.4} />
      </mesh>

      {/* Floating Center Crystal */}
      <mesh ref={crystalRef} position={[0, 1.2, 0]}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#6366f1"
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Outer Gyro Ring */}
      <mesh ref={outerRingRef} position={[0, 1.2, 0]}>
        <torusGeometry args={[1.0, 0.025, 12, 32]} />
        <meshBasicMaterial color="#a5b4fc" transparent opacity={0.6} />
      </mesh>

      {/* Inner Gyro Ring */}
      <mesh ref={innerRingRef} position={[0, 1.2, 0]}>
        <torusGeometry args={[0.75, 0.02, 12, 32]} />
        <meshBasicMaterial color="#c7d2fe" transparent opacity={0.8} />
      </mesh>

      {/* Center Aura Light */}
      <pointLight position={[0, 1.2, 0]} color="#818cf8" intensity={2.0} distance={5} />
    </group>
  );
};
