import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CloudProps {
  initialPos: [number, number, number];
  scale: number;
  speed: number;
}

const SingleCloud: React.FC<CloudProps> = ({ initialPos, scale, speed }) => {
  const meshRef = useRef<THREE.Group>(null);
  const posX = useRef(initialPos[0]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    posX.current += delta * speed;
    if (posX.current > 35) {
      posX.current = -35;
    }
    meshRef.current.position.x = posX.current;
  });

  return (
    <group
      ref={meshRef}
      position={[initialPos[0], initialPos[1], initialPos[2]]}
      scale={[scale, scale * 0.6, scale]}
    >
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} transparent opacity={0.75} />
      </mesh>
      <mesh position={[0.9, -0.1, 0]} castShadow>
        <sphereGeometry args={[0.9, 8, 8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} transparent opacity={0.75} />
      </mesh>
      <mesh position={[-0.8, -0.15, 0.2]} castShadow>
        <sphereGeometry args={[0.85, 8, 8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} transparent opacity={0.75} />
      </mesh>
      <mesh position={[0.2, 0.2, -0.4]} castShadow>
        <sphereGeometry args={[0.75, 8, 8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} transparent opacity={0.75} />
      </mesh>
    </group>
  );
};

export const FloatingClouds: React.FC = () => {
  const clouds = useMemo(() => [
    { pos: [-20, -3.5, -15], scale: 2.2, speed: 0.35 },
    { pos: [10, -4.0, -18], scale: 2.6, speed: 0.25 },
    { pos: [-12, -3.2, 14], scale: 2.0, speed: 0.4 },
    { pos: [18, -4.5, 12], scale: 2.8, speed: 0.3 },
    { pos: [0, -5.0, 22], scale: 2.4, speed: 0.28 },
    { pos: [-25, -4.2, 0], scale: 2.5, speed: 0.32 },
  ], []);

  return (
    <group>
      {clouds.map((c, i) => (
        <SingleCloud
          key={i}
          initialPos={c.pos as [number, number, number]}
          scale={c.scale}
          speed={c.speed}
        />
      ))}
    </group>
  );
};
