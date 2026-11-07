import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';

interface NeonHexEdgeProps {
  radius: number;
  y: number;
  color: string;
  /** 0–1: brighter when hovered/selected */
  intensity?: number;
  /** tube thickness of the bright core */
  thickness?: number;
}

/**
 * Neon outline around a hexagon edge: a thin bright tube plus a wider faint
 * "glow" tube drawn additively. Cheap (no post-processing), works on any laptop.
 * Corners match three's 6-sided cylinder (vertices at angle i·60° from +Z).
 */
export const NeonHexEdge: React.FC<NeonHexEdgeProps> = ({ radius, y, color, intensity = 0.6, thickness = 0.04 }) => {
  const [core, glow] = useMemo(() => {
    const path = new THREE.CurvePath<THREE.Vector3>();
    const corners = Array.from({ length: 7 }, (_, i) => {
      const a = (i % 6) * (Math.PI / 3);
      return new THREE.Vector3(radius * Math.sin(a), 0, radius * Math.cos(a));
    });
    for (let i = 0; i < 6; i++) path.add(new THREE.LineCurve3(corners[i], corners[i + 1]));
    return [
      new THREE.TubeGeometry(path, 48, thickness, 4, true),
      new THREE.TubeGeometry(path, 48, thickness * 2.6, 6, true),
    ];
  }, [radius, thickness]);

  useEffect(() => () => { core.dispose(); glow.dispose(); }, [core, glow]);

  return (
    <group position={[0, y, 0]}>
      <mesh geometry={core}>
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.55 + intensity * 0.45} />
      </mesh>
      <mesh geometry={glow}>
        <meshBasicMaterial
          color={color}
          toneMapped={false}
          transparent
          opacity={0.12 + intensity * 0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
