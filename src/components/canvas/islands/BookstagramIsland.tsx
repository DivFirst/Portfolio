import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const BookstagramIsland: React.FC = () => {
  const fairyLightsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (fairyLightsRef.current) {
      fairyLightsRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshBasicMaterial;
          if (mat) {
            mat.opacity = 0.5 + Math.sin(t * 3 + i) * 0.4;
          }
        }
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* --- READING GAZEBO / CANOPY --- */}
      <group position={[0, 0, -0.6]}>
        {/* 4 Wooden Columns */}
        {[
          [-0.8, -0.8],
          [0.8, -0.8],
          [-0.8, 0.8],
          [0.8, 0.8],
        ].map(([x, z], idx) => (
          <mesh key={idx} position={[x, 1.1, z]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 2.2, 8]} />
            <meshStandardMaterial color="#581c87" roughness={0.7} />
          </mesh>
        ))}

        {/* Gazebo Conical Pagoda Roof */}
        <mesh position={[0, 2.7, 0]} castShadow>
          <coneGeometry args={[1.5, 1.0, 6]} />
          <meshStandardMaterial color="#7c3aed" roughness={0.5} />
        </mesh>
        <mesh position={[0, 3.3, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>

        {/* Fairy Lights Swags strung between posts */}
        <group ref={fairyLightsRef}>
          {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
            <mesh key={i} position={[x, 2.05 - Math.abs(x) * 0.15, 0.8]}>
              <sphereGeometry args={[0.05, 6, 6]} />
              <meshBasicMaterial color="#fde047" transparent opacity={0.8} />
            </mesh>
          ))}
        </group>

        {/* Warm Gazebo Reading Chandelier */}
        <pointLight position={[0, 1.8, 0]} color="#fef08a" intensity={0.9} distance={3} />
      </group>

      {/* --- TOWER OF HARDCOVER BOOKS (STACK 1) --- */}
      <group position={[-1.2, 0, 0.8]}>
        {[
          { color: '#8b5cf6', rot: 0.1, h: 0.1 },
          { color: '#ec4899', rot: -0.25, h: 0.1 },
          { color: '#3b82f6', rot: 0.18, h: 0.1 },
          { color: '#10b981', rot: -0.08, h: 0.12 },
          { color: '#f59e0b', rot: 0.3, h: 0.1 },
          { color: '#06b6d4', rot: -0.15, h: 0.11 },
          { color: '#a855f7', rot: 0.05, h: 0.09 },
        ].map((book, idx) => (
          <mesh
            key={idx}
            position={[0, 0.05 + idx * 0.11, 0]}
            rotation={[0, book.rot, 0]}
            castShadow
          >
            <boxGeometry args={[0.75, book.h, 0.55]} />
            <meshStandardMaterial color={book.color} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* --- SECOND STACK OF BOOKS (STACK 2 - OPEN BOOK ON TOP) --- */}
      <group position={[1.2, 0, 0.5]}>
        {[
          { color: '#0284c7', rot: -0.1 },
          { color: '#ea580c', rot: 0.2 },
          { color: '#6d28d9', rot: -0.3 },
          { color: '#059669', rot: 0.1 },
        ].map((b, idx) => (
          <mesh key={idx} position={[0, 0.05 + idx * 0.11, 0]} rotation={[0, b.rot, 0]} castShadow>
            <boxGeometry args={[0.65, 0.1, 0.48]} />
            <meshStandardMaterial color={b.color} roughness={0.5} />
          </mesh>
        ))}
        {/* Open Book on top of stack */}
        <group position={[0, 0.52, 0]} rotation={[0, 0.2, 0]}>
          <mesh position={[-0.15, 0.02, 0]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.3, 0.02, 0.45]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0.15, 0.02, 0]} rotation={[0, 0, -0.15]}>
            <boxGeometry args={[0.3, 0.02, 0.45]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </group>
      </group>

      {/* --- COZY READING CHAIR / BENCH --- */}
      <group position={[0, 0, -0.3]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.8, 0.1, 0.45]} />
          <meshStandardMaterial color="#4c1d95" />
        </mesh>
        <mesh position={[0, 0.65, -0.2]} castShadow>
          <boxGeometry args={[0.8, 0.5, 0.08]} />
          <meshStandardMaterial color="#4c1d95" />
        </mesh>
      </group>
    </group>
  );
};
