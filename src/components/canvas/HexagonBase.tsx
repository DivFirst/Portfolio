import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { IslandMeta } from '../../types/portfolio';
import { sound } from '../../utils/soundEffects';

interface HexagonBaseProps {
  meta: IslandMeta;
  isSelected: boolean;
  onSelect: (meta: IslandMeta) => void;
  children?: React.ReactNode;
}

export const HexagonBase: React.FC<HexagonBaseProps> = ({
  meta,
  isSelected,
  onSelect,
  children,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const radius = 4.2;
  const height = 1.6;

  // Smooth hover elevation and gentle idle breathing
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const idleFloat = Math.sin(state.clock.elapsedTime * 1.5 + meta.index) * 0.08;
    const targetY = isSelected ? 0.6 : (hovered ? 0.45 : 0);
    
    // Smooth dampening towards target elevation
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      meta.coordinates[1] + targetY + idleFloat,
      6,
      delta
    );

    // Rotate the beacon glow ring slowly
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.4;
      const ringScale = isSelected ? 1.08 : (hovered ? 1.04 : 1.0);
      ringRef.current.scale.set(ringScale, ringScale, 1);
    }
  });

  const handlePointerOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    setHovered(true);
    sound.playHover();
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
    setHovered(false);
  };

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    sound.playSelect();
    onSelect(meta);
  };

  return (
    <group
      ref={groupRef}
      position={[meta.coordinates[0], meta.coordinates[1], meta.coordinates[2]]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 1. Cliff / Rock Substructure (Bottom stone layer) */}
      <mesh position={[0, -height * 0.65, 0]} rotation={[0, Math.PI / 6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 0.96, radius * 0.78, height * 1.3, 6]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.9}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* 2. Top Ground Turf / Beveled Surface */}
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 0.98, height * 0.35, 6]} />
        <meshStandardMaterial
          color={hovered || isSelected ? meta.accentColor : "#243048"}
          roughness={0.65}
          metalness={0.2}
          emissive={hovered || isSelected ? meta.accentColor : "#0a1120"}
          emissiveIntensity={hovered || isSelected ? 0.3 : 0.05}
        />
      </mesh>

      {/* 3. Inner Grass / Path Ring */}
      <mesh position={[0, height * 0.18, 0]} rotation={[0, Math.PI / 6, 0]} receiveShadow>
        <cylinderGeometry args={[radius * 0.92, radius * 0.92, 0.05, 6]} />
        <meshStandardMaterial
          color={
            meta.id === 'life' ? '#3d5a45' :
            meta.id === 'professional' ? '#1e293b' :
            meta.id === 'projects' ? '#113536' :
            meta.id === 'hobby' ? '#4a2545' :
            meta.id === 'bookstagram' ? '#35274e' :
            '#234346'
          }
          roughness={0.7}
          metalness={0.15}
        />
      </mesh>

      {/* 4. Glowing Hexagon Perimeter Border Ring */}
      <mesh
        ref={ringRef}
        position={[0, height * 0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[radius * 0.94, radius * 1.02, 6]} />
        <meshBasicMaterial
          color={meta.accentColor}
          transparent
          opacity={isSelected ? 0.95 : (hovered ? 0.75 : 0.25)}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 5. Floating Interactive Props placed on top */}
      <group position={[0, height * 0.2, 0]}>
        {children}
      </group>
    </group>
  );
};
