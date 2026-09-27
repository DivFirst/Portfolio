import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface ConstructionBarricadeProps {
  yOffset?: number;
  coneRadius?: number;
  titleText?: string;
  subtitleText?: string;
  isFloatingIsland?: boolean;
}

// Generates a reusable striped red-and-white hazard caution tape texture
function createCautionTapeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Fill white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 128, 32);

    // Draw 45-degree red stripes
    ctx.fillStyle = '#dc2626';
    const stripeWidth = 16;
    for (let x = -32; x < 160; x += stripeWidth * 2) {
      ctx.beginPath();
      ctx.moveTo(x, 32);
      ctx.lineTo(x + 24, 0);
      ctx.lineTo(x + 24 + stripeWidth, 0);
      ctx.lineTo(x + stripeWidth, 32);
      ctx.closePath();
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(4, 1);
  return texture;
}

// Generates yellow & black warning hazard bar texture
function createHazardStripeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#eab308';
    ctx.fillRect(0, 0, 128, 16);

    ctx.fillStyle = '#18181b';
    const stripeWidth = 12;
    for (let x = -24; x < 150; x += stripeWidth * 2) {
      ctx.beginPath();
      ctx.moveTo(x, 16);
      ctx.lineTo(x + 14, 0);
      ctx.lineTo(x + 14 + stripeWidth, 0);
      ctx.lineTo(x + stripeWidth, 16);
      ctx.closePath();
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(6, 1);
  return texture;
}

// Individual Traffic Cone with black base, safety orange cone & reflective white bands
const TrafficCone: React.FC<{
  position: [number, number, number];
  hasBlinker?: boolean;
}> = ({ position, hasBlinker = false }) => {
  const blinkerRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (hasBlinker) {
      const blink = Math.sin(state.clock.elapsedTime * 6) > 0 ? 1 : 0.15;
      if (blinkerRef.current) {
        (blinkerRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = blink * 1.5;
      }
      if (lightRef.current) {
        lightRef.current.intensity = blink * 0.8;
      }
    }
  });

  return (
    <group position={position}>
      {/* 1. Black Rubber Square Base */}
      <mesh position={[0, 0.025, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.36, 0.05, 0.36]} />
        <meshStandardMaterial color="#18181b" roughness={0.9} />
      </mesh>

      {/* 2. Main Orange Cone Body */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.16, 0.6, 16]} />
        <meshStandardMaterial
          color="#f97316"
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* 3. Lower Reflective White Stripe */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.09, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* 4. Upper Reflective White Stripe */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.055, 0.075, 0.08, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* 5. Optional Amber Flashing Warning Beacon on Top */}
      {hasBlinker && (
        <group position={[0, 0.66, 0]}>
          <mesh ref={blinkerRef}>
            <cylinderGeometry args={[0.045, 0.045, 0.08, 12]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={1.2}
              roughness={0.2}
            />
          </mesh>
          <pointLight
            ref={lightRef}
            color="#f59e0b"
            distance={2}
            intensity={0.8}
          />
        </group>
      )}
    </group>
  );
};

// Ribbon tape connecting two points in 3D
const TapeSegment: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  texture: THREE.CanvasTexture;
  yOffset?: number;
}> = ({ start, end, texture, yOffset = 0 }) => {
  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const len = Math.sqrt(dx * dx + dz * dz);
  const midX = (start[0] + end[0]) / 2;
  const midZ = (start[2] + end[2]) / 2;
  const angle = Math.atan2(dx, dz);

  return (
    <mesh
      position={[midX, start[1] + yOffset, midZ]}
      rotation={[0, angle + Math.PI / 2, 0]}
    >
      <planeGeometry args={[len, 0.08]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={0.4}
      />
    </mesh>
  );
};

export const ConstructionBarricade: React.FC<ConstructionBarricadeProps> = ({
  yOffset = 2.4,
  titleText = "COMING SOON",
  subtitleText = "🚧 UNDER CONSTRUCTION 🚧",
  isFloatingIsland = false,
}) => {
  const signGroupRef = useRef<THREE.Group>(null);

  // Textures
  const cautionTapeTexture = useMemo(() => createCautionTapeTexture(), []);
  const hazardBarTexture = useMemo(() => createHazardStripeTexture(), []);

  // Idle floating breathing animation for the 3D sign
  useFrame((state) => {
    if (signGroupRef.current) {
      signGroupRef.current.position.y = yOffset + Math.sin(state.clock.elapsedTime * 1.8) * 0.08;
    }
  });

  // Coordinates of 5 cones forming an arc across the front perimeter of the island
  const conePositions: [number, number, number][] = useMemo(() => {
    if (isFloatingIsland) {
      // Tighter formation for the flying book
      return [
        [-2.0, 0.45, 1.2],
        [-1.0, 0.45, 2.0],
        [0.0, 0.45, 2.2],
        [1.0, 0.45, 2.0],
        [2.0, 0.45, 1.2],
      ];
    }
    // Standard arc around the front rim of hexagonal island
    return [
      [-2.4, 0, 1.3],
      [-1.3, 0, 2.3],
      [0.0, 0, 2.6],
      [1.3, 0, 2.3],
      [2.4, 0, 1.3],
    ];
  }, [isFloatingIsland]);

  return (
    <group>
      {/* ======================================================== */}
      {/* 1. TRAFFIC CONES                                         */}
      {/* ======================================================== */}
      {conePositions.map((pos, idx) => (
        <TrafficCone
          key={`cone-${idx}`}
          position={pos}
          hasBlinker={idx === 0 || idx === 4}
        />
      ))}

      {/* ======================================================== */}
      {/* 2. RED & WHITE POLICE / CAUTION BARRICADE RIBBONS        */}
      {/* ======================================================== */}
      {/* Connect each cone to the next with 2 tiers of caution tape */}
      {conePositions.slice(0, -1).map((startPos, idx) => {
        const endPos = conePositions[idx + 1];
        return (
          <group key={`tape-pair-${idx}`}>
            {/* Upper Ribbon (near cone top) */}
            <TapeSegment
              start={startPos}
              end={endPos}
              texture={cautionTapeTexture}
              yOffset={0.42}
            />
            {/* Lower Ribbon */}
            <TapeSegment
              start={startPos}
              end={endPos}
              texture={cautionTapeTexture}
              yOffset={0.22}
            />
          </group>
        );
      })}

      {/* ======================================================== */}
      {/* 3. 3D FLOATING "COMING SOON" SIGN                        */}
      {/* ======================================================== */}
      <group
        ref={signGroupRef}
        position={[0, yOffset, 0]}
        // Orient sign towards default isometric camera angle
        rotation={[-0.32, 0.38, 0.1]}
      >
        {/* Support Stanchions / Cables */}
        <mesh position={[-1.0, -0.45, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        <mesh position={[1.0, -0.45, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>

        {/* Signboard Main Backing Plate */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.7, 0.88, 0.08]} />
          <meshStandardMaterial
            color="#090d16"
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>

        {/* Signboard Yellow Outer Rim */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[2.8, 0.98, 0.05]} />
          <meshStandardMaterial
            color="#eab308"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        {/* Top Hazard Stripe Bar */}
        <mesh position={[0, 0.35, 0.045]}>
          <planeGeometry args={[2.6, 0.12]} />
          <meshStandardMaterial map={hazardBarTexture} />
        </mesh>

        {/* Bottom Hazard Stripe Bar */}
        <mesh position={[0, -0.35, 0.045]}>
          <planeGeometry args={[2.6, 0.12]} />
          <meshStandardMaterial map={hazardBarTexture} />
        </mesh>

        {/* Left & Right Corner Rivets */}
        {[-1.25, 1.25].map((rx, idx) => (
          <group key={`rivet-${idx}`}>
            <mesh position={[rx, 0.3, 0.05]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#f1f5f9" metalness={0.9} />
            </mesh>
            <mesh position={[rx, -0.3, 0.05]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#f1f5f9" metalness={0.9} />
            </mesh>
          </group>
        ))}

        {/* 3D Primary Title: COMING SOON */}
        <Text
          position={[0, 0.07, 0.05]}
          fontSize={0.38}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#ea580c"
          letterSpacing={0.08}
        >
          {titleText}
        </Text>

        {/* Secondary Subtitle: 🚧 UNDER CONSTRUCTION 🚧 */}
        <Text
          position={[0, -0.17, 0.05]}
          fontSize={0.13}
          color="#facc15"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
        >
          {subtitleText}
        </Text>
      </group>
    </group>
  );
};
