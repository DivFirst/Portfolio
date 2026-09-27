import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { IslandMeta } from '../../../types/portfolio';
import { sound } from '../../../utils/soundEffects';

interface FlyingBookIslandProps {
  meta: IslandMeta;
  isSelected: boolean;
  onSelect: (meta: IslandMeta) => void;
}

export const FlyingBookIsland: React.FC<FlyingBookIslandProps> = ({
  meta,
  isSelected,
  onSelect,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const bookGroupRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);
  const runeRingRef = useRef<THREE.Mesh>(null);
  const ribbonRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Flight physics & wing flapping
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (rootGroupRef.current) {
      // Gentle floating levitation
      const idleFloat = Math.sin(t * 1.6) * 0.22;
      const targetY = isSelected ? 1.0 : (hovered ? 0.65 : 0);

      rootGroupRef.current.position.y = THREE.MathUtils.damp(
        rootGroupRef.current.position.y,
        meta.coordinates[1] + targetY + idleFloat,
        5,
        delta
      );
    }

    if (bookGroupRef.current) {
      // Atmospheric banking & gentle aerodynamic rocking
      const targetRoll = Math.sin(t * 1.3) * 0.06 + (hovered ? 0.04 : 0);
      const targetPitch = Math.cos(t * 1.1) * 0.05 + (isSelected ? 0.1 : 0);
      const targetYaw = Math.sin(t * 0.8) * 0.05;

      bookGroupRef.current.rotation.z = THREE.MathUtils.damp(
        bookGroupRef.current.rotation.z,
        targetRoll,
        4,
        delta
      );
      bookGroupRef.current.rotation.x = THREE.MathUtils.damp(
        bookGroupRef.current.rotation.x,
        targetPitch,
        4,
        delta
      );
      bookGroupRef.current.rotation.y = THREE.MathUtils.damp(
        bookGroupRef.current.rotation.y,
        targetYaw,
        4,
        delta
      );
    }

    // Symmetrical wing flapping animation (both wings flap UP and DOWN in unison)
    const wingSpeed = hovered ? 4.5 : 2.5;
    const flap = Math.sin(t * wingSpeed) * 0.24;
    if (leftWingRef.current) {
      leftWingRef.current.rotation.z = -0.15 - flap;
      leftWingRef.current.rotation.y = Math.cos(t * wingSpeed) * 0.1;
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.z = 0.15 + flap;
      rightWingRef.current.rotation.y = -Math.cos(t * wingSpeed) * 0.1;
    }

    // Gently swaying ribbon bookmark
    if (ribbonRef.current) {
      ribbonRef.current.rotation.z = Math.sin(t * 2.0) * 0.15;
      ribbonRef.current.rotation.x = Math.cos(t * 1.8) * 0.1;
    }

    // Slowly rotating celestial aura ring beneath the book
    if (runeRingRef.current) {
      runeRingRef.current.rotation.z += delta * 0.35;
      const ringScale = isSelected ? 1.15 : (hovered ? 1.08 : 1.0);
      runeRingRef.current.scale.set(ringScale, ringScale, 1);
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

  // Dimensions of the ancient grimoire
  const bookWidth = 3.6;   // X-axis (cover span)
  const bookLength = 4.8;  // Z-axis (height of the book)
  const bookHeight = 0.95; // Y-axis (thickness of closed book)

  return (
    <group
      ref={rootGroupRef}
      position={[meta.coordinates[0], meta.coordinates[1], meta.coordinates[2]]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* --- CELESTIAL AURA / RUNIC RING UNDERNEATH --- */}
      <mesh
        ref={runeRingRef}
        position={[0, -1.8, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[2.8, 3.4, 32]} />
        <meshBasicMaterial
          color={meta.accentColor}
          transparent
          opacity={isSelected ? 0.85 : (hovered ? 0.65 : 0.28)}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Orbiting Sparkles */}
      <Sparkles
        count={28}
        scale={6.5}
        size={2.8}
        speed={0.5}
        opacity={hovered || isSelected ? 0.9 : 0.5}
        color="#fbbf24"
      />

      {/* Warm Ambient Underlight */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={hovered || isSelected ? 2.2 : 1.2}
        distance={7}
        color="#fbbf24"
      />

      {/* --- THE MAIN FLYING BOOK BODY --- */}
      <group
        ref={bookGroupRef}
        // Base tilt: slightly facing the default isometric camera (pitched up ~32° and angled ~-20°)
        rotation={[Math.PI * 0.16, -Math.PI * 0.1, 0]}
      >
        {/* ======================================================== */}
        {/* 1. FRONT COVER (Top Leather Board)                       */}
        {/* ======================================================== */}
        <group position={[0, bookHeight * 0.5, 0]}>
          {/* Main Leather Slab */}
          <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
            <boxGeometry args={[bookWidth, 0.1, bookLength]} />
            <meshStandardMaterial
              color="#3a1708"
              roughness={0.78}
              metalness={0.12}
            />
          </mesh>

          {/* Raised Leather Border Frame */}
          <mesh position={[0, 0.11, 0]}>
            <boxGeometry args={[bookWidth - 0.25, 0.03, bookLength - 0.25]} />
            <meshStandardMaterial
              color="#2a0f04"
              roughness={0.85}
              metalness={0.08}
            />
          </mesh>

          {/* Golden Filigree Inner Inlay Border */}
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[bookWidth - 0.6, 0.02, bookLength - 0.6]} />
            <meshStandardMaterial
              color="#d97706"
              roughness={0.35}
              metalness={0.8}
            />
          </mesh>

          {/* Golden Inner Leather Recess */}
          <mesh position={[0, 0.125, 0]}>
            <boxGeometry args={[bookWidth - 0.8, 0.02, bookLength - 0.8]} />
            <meshStandardMaterial
              color="#451a03"
              roughness={0.72}
              metalness={0.15}
            />
          </mesh>

          {/* Ornate Gold Corner Protectors (4 corners) */}
          {[
            [-bookWidth * 0.5 + 0.35, -bookLength * 0.5 + 0.35],
            [bookWidth * 0.5 - 0.35, -bookLength * 0.5 + 0.35],
            [-bookWidth * 0.5 + 0.35, bookLength * 0.5 - 0.35],
            [bookWidth * 0.5 - 0.35, bookLength * 0.5 - 0.35],
          ].map(([cx, cz], i) => (
            <group key={`corner-top-${i}`} position={[cx, 0.12, cz]}>
              <mesh>
                <boxGeometry args={[0.55, 0.06, 0.55]} />
                <meshStandardMaterial
                  color="#f59e0b"
                  metalness={0.88}
                  roughness={0.25}
                />
              </mesh>
              {/* Corner Stud / Rivet */}
              <mesh position={[0, 0.04, 0]}>
                <sphereGeometry args={[0.07, 8, 8]} />
                <meshStandardMaterial
                  color="#fef08a"
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>
            </group>
          ))}

          {/* Central Ornate Medallion */}
          <group position={[0, 0.13, 0.2]}>
            {/* Diamond Plate */}
            <mesh rotation={[0, Math.PI / 4, 0]}>
              <boxGeometry args={[0.9, 0.04, 0.9]} />
              <meshStandardMaterial
                color="#f59e0b"
                metalness={0.88}
                roughness={0.25}
              />
            </mesh>
            {/* Inner Glowing Gemstone */}
            <mesh position={[0, 0.04, 0]}>
              <octahedronGeometry args={[0.22, 0]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#f59e0b"
                emissiveIntensity={hovered || isSelected ? 0.9 : 0.4}
                metalness={0.3}
                roughness={0.1}
              />
            </mesh>
          </group>

          {/* Cover Embossed Celestial Star Crest */}
          <group position={[0, 0.13, -1.0]}>
            {/* Outer Compass Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.42, 0.52, 16]} />
              <meshStandardMaterial
                color="#f59e0b"
                metalness={0.9}
                roughness={0.25}
              />
            </mesh>
            {/* 4-Pointed Star Filigree */}
            <mesh rotation={[0, 0, 0]}>
              <boxGeometry args={[0.08, 0.03, 0.8]} />
              <meshStandardMaterial
                color="#fbbf24"
                metalness={0.92}
                roughness={0.2}
              />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.08, 0.03, 0.8]} />
              <meshStandardMaterial
                color="#fbbf24"
                metalness={0.92}
                roughness={0.2}
              />
            </mesh>
          </group>
        </group>

        {/* ======================================================== */}
        {/* 2. BACK COVER (Bottom Leather Board)                     */}
        {/* ======================================================== */}
        <group position={[0, -bookHeight * 0.5, 0]}>
          <mesh castShadow receiveShadow position={[0, -0.05, 0]}>
            <boxGeometry args={[bookWidth, 0.1, bookLength]} />
            <meshStandardMaterial
              color="#3a1708"
              roughness={0.78}
              metalness={0.12}
            />
          </mesh>
          {/* Bottom 4 Corner Protectors */}
          {[
            [-bookWidth * 0.5 + 0.35, -bookLength * 0.5 + 0.35],
            [bookWidth * 0.5 - 0.35, -bookLength * 0.5 + 0.35],
            [-bookWidth * 0.5 + 0.35, bookLength * 0.5 - 0.35],
            [bookWidth * 0.5 - 0.35, bookLength * 0.5 - 0.35],
          ].map(([cx, cz], i) => (
            <mesh key={`corner-bot-${i}`} position={[cx, -0.11, cz]}>
              <boxGeometry args={[0.55, 0.06, 0.55]} />
              <meshStandardMaterial
                color="#f59e0b"
                metalness={0.88}
                roughness={0.25}
              />
            </mesh>
          ))}
        </group>

        {/* ======================================================== */}
        {/* 3. CLOSED PAPER BLOCK (Aged Gilded Parchment)           */}
        {/* ======================================================== */}
        <group position={[0.1, 0, 0]}>
          {/* Main Paper Core */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[bookWidth - 0.35, bookHeight - 0.16, bookLength - 0.3]} />
            <meshStandardMaterial
              color="#fef3c7"
              roughness={0.88}
              metalness={0.05}
            />
          </mesh>

          {/* Gilded Edge Shading (Front Opening, Top & Bottom Edges) */}
          {/* Right Edge (Fore-edge) */}
          <mesh position={[(bookWidth - 0.35) * 0.5 + 0.005, 0, 0]}>
            <planeGeometry args={[bookLength - 0.3, bookHeight - 0.16]} />
            <meshStandardMaterial
              color="#eab308"
              roughness={0.4}
              metalness={0.7}
            />
          </mesh>
          {/* Top Edge */}
          <mesh
            position={[0, 0, -(bookLength - 0.3) * 0.5 - 0.005]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <planeGeometry args={[bookWidth - 0.35, bookHeight - 0.16]} />
            <meshStandardMaterial
              color="#eab308"
              roughness={0.4}
              metalness={0.7}
            />
          </mesh>
          {/* Bottom Edge */}
          <mesh
            position={[0, 0, (bookLength - 0.3) * 0.5 + 0.005]}
            rotation={[0, -Math.PI / 2, 0]}
          >
            <planeGeometry args={[bookWidth - 0.35, bookHeight - 0.16]} />
            <meshStandardMaterial
              color="#eab308"
              roughness={0.4}
              metalness={0.7}
            />
          </mesh>
        </group>

        {/* ======================================================== */}
        {/* 4. LEATHER SPINE & RAISED BINDING BANDS                 */}
        {/* ======================================================== */}
        <group position={[-bookWidth * 0.5, 0, 0]}>
          {/* Spine Curved Arch */}
          <mesh position={[-0.05, 0, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.25, bookHeight + 0.04, bookLength]} />
            <meshStandardMaterial
              color="#2a0f04"
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>

          {/* Raised Spine Ribs (5 antique horizontal cords) */}
          {[-1.8, -0.9, 0, 0.9, 1.8].map((zPos, idx) => (
            <group key={`spine-rib-${idx}`} position={[-0.14, 0, zPos]}>
              <mesh>
                <boxGeometry args={[0.16, bookHeight + 0.08, 0.18]} />
                <meshStandardMaterial
                  color="#1a0701"
                  roughness={0.9}
                  metalness={0.1}
                />
              </mesh>
              {/* Gold Stitch Accents */}
              <mesh position={[-0.07, 0, 0]}>
                <boxGeometry args={[0.04, bookHeight * 0.7, 0.06]} />
                <meshStandardMaterial
                  color="#f59e0b"
                  metalness={0.85}
                  roughness={0.25}
                />
              </mesh>
            </group>
          ))}
        </group>

        {/* ======================================================== */}
        {/* 5. LEATHER CLASP & JEWELED LOCK MECHANISM                */}
        {/* ======================================================== */}
        <group position={[bookWidth * 0.5, 0, 0]}>
          {/* Leather Strap */}
          <mesh position={[0.05, 0, 0]}>
            <boxGeometry args={[0.25, bookHeight * 0.65, 0.5]} />
            <meshStandardMaterial
              color="#2a0f04"
              roughness={0.8}
            />
          </mesh>
          {/* Brass Clasp Buckle */}
          <mesh position={[0.15, 0, 0]}>
            <boxGeometry args={[0.1, 0.45, 0.35]} />
            <meshStandardMaterial
              color="#f59e0b"
              metalness={0.9}
              roughness={0.25}
            />
          </mesh>
          {/* Jeweled Lock Core */}
          <mesh position={[0.2, 0, 0]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>

        {/* ======================================================== */}
        {/* 6. HANGING SILK RIBBON BOOKMARK                          */}
        {/* ======================================================== */}
        <group ref={ribbonRef} position={[0.2, -bookHeight * 0.5 + 0.1, bookLength * 0.5]}>
          {/* First Ribbon Segment */}
          <mesh position={[0, -0.4, 0.15]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.25, 0.9, 0.03]} />
            <meshStandardMaterial
              color="#991b1b"
              roughness={0.65}
            />
          </mesh>
          {/* Second Curving Tail */}
          <mesh position={[0.03, -0.95, 0.32]} rotation={[0.45, 0.1, 0.1]}>
            <boxGeometry args={[0.25, 0.6, 0.03]} />
            <meshStandardMaterial
              color="#991b1b"
              roughness={0.65}
            />
          </mesh>
          {/* Golden Ribbon Finial / Pendant */}
          <mesh position={[0.05, -1.3, 0.48]}>
            <coneGeometry args={[0.12, 0.28, 4]} />
            <meshStandardMaterial
              color="#f59e0b"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* ======================================================== */}
        {/* 7. ETHEREAL CELESTIAL WINGS (The "Flying" Element)       */}
        {/* ======================================================== */}
        {/* Left Wing (Spine side) */}
        <group ref={leftWingRef} position={[-bookWidth * 0.5 - 0.15, 0.1, 0]}>
          {/* Main Upper Feather */}
          <mesh position={[-1.3, 0.55, -0.2]} rotation={[0.1, 0.15, -0.32]} castShadow>
            <boxGeometry args={[2.2, 0.05, 0.5]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#f59e0b"
              emissiveIntensity={hovered || isSelected ? 0.75 : 0.4}
              transparent
              opacity={0.88}
              roughness={0.25}
            />
          </mesh>
          {/* Tip Feather */}
          <mesh position={[-1.7, 0.95, -0.5]} rotation={[0.15, 0.25, -0.52]} castShadow>
            <boxGeometry args={[1.9, 0.04, 0.42]} />
            <meshStandardMaterial
              color="#fef9c3"
              emissive="#fbbf24"
              emissiveIntensity={hovered || isSelected ? 0.7 : 0.35}
              transparent
              opacity={0.82}
            />
          </mesh>
          {/* Lower Secondary Feather */}
          <mesh position={[-1.0, 0.15, 0.35]} rotation={[0.05, 0.1, -0.15]} castShadow>
            <boxGeometry args={[1.6, 0.04, 0.38]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#f59e0b"
              emissiveIntensity={hovered || isSelected ? 0.65 : 0.3}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>

        {/* Right Wing (Fore-edge side) - Perfectly Mirrored */}
        <group ref={rightWingRef} position={[bookWidth * 0.5 + 0.15, 0.1, 0]}>
          {/* Main Upper Feather */}
          <mesh position={[1.3, 0.55, -0.2]} rotation={[0.1, -0.15, 0.32]} castShadow>
            <boxGeometry args={[2.2, 0.05, 0.5]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#f59e0b"
              emissiveIntensity={hovered || isSelected ? 0.75 : 0.4}
              transparent
              opacity={0.88}
              roughness={0.25}
            />
          </mesh>
          {/* Tip Feather */}
          <mesh position={[1.7, 0.95, -0.5]} rotation={[0.15, -0.25, 0.52]} castShadow>
            <boxGeometry args={[1.9, 0.04, 0.42]} />
            <meshStandardMaterial
              color="#fef9c3"
              emissive="#fbbf24"
              emissiveIntensity={hovered || isSelected ? 0.7 : 0.35}
              transparent
              opacity={0.82}
            />
          </mesh>
          {/* Lower Secondary Feather */}
          <mesh position={[1.0, 0.15, 0.35]} rotation={[0.05, -0.1, 0.15]} castShadow>
            <boxGeometry args={[1.6, 0.04, 0.38]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#f59e0b"
              emissiveIntensity={hovered || isSelected ? 0.65 : 0.3}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>

        {/* Dedicated Cover Illumination Spot */}
        <pointLight
          position={[0, bookHeight * 0.5 + 2.0, 1.2]}
          intensity={hovered || isSelected ? 2.0 : 1.3}
          distance={6}
          color="#fffbeb"
        />

        {/* ======================================================== */}
        {/* 8. 3D TEXT OVER THE BOOK: "My Life"                      */}
        {/* ======================================================== */}
        {/* Pure Floating 3D Text with Golden Extrusion & Glow       */}
        <group position={[0, bookHeight * 0.5 + 1.2, 0]} rotation={[-0.18, 0, 0]}>
          {/* Decorative Golden Filigree Underbar */}
          <group position={[0, -0.38, 0]}>
            <mesh>
              <boxGeometry args={[2.4, 0.04, 0.04]} />
              <meshStandardMaterial
                color="#f59e0b"
                metalness={0.9}
                roughness={0.2}
                emissive="#b45309"
                emissiveIntensity={0.5}
              />
            </mesh>
            {/* Center diamond ornament */}
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.18, 0.18, 0.06]} />
              <meshStandardMaterial
                color="#fef08a"
                metalness={0.95}
                roughness={0.15}
                emissive="#f59e0b"
                emissiveIntensity={0.7}
              />
            </mesh>
          </group>

          {/* Deep Shadow Extrusion Layer */}
          <Text
            position={[0, 0, -0.06]}
            fontSize={0.68}
            color="#451a03"
            anchorX="center"
            anchorY="middle"
          >
            My Life
          </Text>

          {/* Mid Extrusion Bronze/Gold Layer */}
          <Text
            position={[0, 0, -0.03]}
            fontSize={0.68}
            color="#b45309"
            anchorX="center"
            anchorY="middle"
          >
            My Life
          </Text>

          {/* Front Bright 3D Golden Text */}
          <Text
            position={[0, 0, 0]}
            fontSize={0.68}
            color={hovered || isSelected ? "#ffffff" : "#fef3c7"}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.035}
            outlineColor="#92400e"
          >
            My Life
          </Text>

          {/* Subtitle Tag */}
          <Text
            position={[0, -0.56, 0.01]}
            fontSize={0.19}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.18}
          >
            JOURNEY & ROOTS
          </Text>
        </group>
      </group>

      {/* Radiant Completion Aura for Active Island */}
      <Sparkles
        count={28}
        scale={[6, 3, 6]}
        size={2.8}
        speed={0.4}
        opacity={0.6}
        color="#fbbf24"
      />
    </group>
  );
};
