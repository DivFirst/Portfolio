import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { IslandMeta } from '../../types/portfolio';
import { sound } from '../../utils/soundEffects';
import { arcadeWorlds, accentHex } from '../../data/arcadeWorlds';
import { NeonHexEdge } from './NeonHexEdge';
import { WorldSign } from './WorldSign';

interface HexagonBaseProps {
  meta: IslandMeta;
  isSelected: boolean;
  onSelect: (meta: IslandMeta) => void;
  children?: React.ReactNode;
  reducedMotion?: boolean;
  /** hide the arcade sign (inside a world) */
  hideSign?: boolean;
}

export const HexagonBase: React.FC<HexagonBaseProps> = ({
  meta,
  isSelected,
  onSelect,
  children,
  reducedMotion = false,
  hideSign = false,
}) => {
  const world = arcadeWorlds[meta.id];
  const neon = accentHex[world.accent];
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const radius = 4.2;
  const height = 1.6;

  // Smooth hover elevation and gentle idle breathing
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const idleFloat = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 1.5 + meta.index) * 0.08;
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
      if (!reducedMotion) ringRef.current.rotation.z += delta * 0.4;
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
          color="#1c2140"
          roughness={0.65}
          metalness={0.2}
          emissive={neon}
          emissiveIntensity={isSelected ? 0.32 : hovered ? 0.22 : 0.04}
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
            meta.id === 'travel' ? '#173a40' :
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
          color={neon}
          toneMapped={false}
          transparent
          opacity={isSelected ? 0.6 : (hovered ? 0.45 : 0.15)}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 5. Neon outline on the island edges, in the world's accent colour (DESIGN.md §2) */}
      <group rotation={[0, Math.PI / 6, 0]}>
        <NeonHexEdge radius={radius * 1.005} y={height * 0.175} color={neon} intensity={isSelected ? 1 : hovered ? 0.8 : 0.45} />
        <NeonHexEdge radius={radius * 0.785} y={-height * 1.3} color={neon} thickness={0.035} intensity={isSelected ? 0.7 : 0.3} />
      </group>

      {/* 6. Props on top + the arcade sign with the world's name */}
      <group position={[0, height * 0.2, 0]}>
        {children}
        {!hideSign && <WorldSign number={world.number} name={world.name} color={neon} reducedMotion={reducedMotion} active={hovered} />}
      </group>
    </group>
  );
};
