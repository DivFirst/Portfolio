import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { IslandMeta } from '../../types/portfolio';
import { sound } from '../../utils/soundEffects';

interface FlyingRocketProps {
  selectedIsland: IslandMeta | null;
  onResetView?: () => void;
}

const HOME_POSITION = new THREE.Vector3(0, 1.8, 0);

export const FlyingRocket: React.FC<FlyingRocketProps> = ({
  selectedIsland,
  onResetView,
}) => {
  const rocketGroupRef = useRef<THREE.Group>(null);
  const flameCoreRef = useRef<THREE.Mesh>(null);
  const flameOuterRef = useRef<THREE.Mesh>(null);
  const thrusterLightRef = useRef<THREE.PointLight>(null);
  const baseDaisRef = useRef<THREE.Group>(null);

  // Position state for smooth physics interpolation
  const currentPos = useRef(new THREE.Vector3().copy(HOME_POSITION));
  const targetPos = useRef(new THREE.Vector3().copy(HOME_POSITION));
  const isTravelling = useRef(false);

  // Trigger launch sound and update target when selected island changes
  useEffect(() => {
    if (selectedIsland) {
      // Offset slightly above and to the front of the selected island
      targetPos.current.set(
        selectedIsland.coordinates[0] - 2.2,
        selectedIsland.coordinates[1] + 2.8,
        selectedIsland.coordinates[2] + 2.4
      );
      isTravelling.current = true;
      sound.playWhoosh();
    } else {
      targetPos.current.copy(HOME_POSITION);
      isTravelling.current = true;
      sound.playWhoosh();
    }
  }, [selectedIsland]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (!rocketGroupRef.current) return;

    // Distance to target
    const dist = currentPos.current.distanceTo(targetPos.current);

    // Calculate lerp speed (faster when traveling, smooth deceleration when close)
    const lerpSpeed = Math.min(1, delta * (dist > 1.0 ? 3.2 : 2.5));
    currentPos.current.lerp(targetPos.current, lerpSpeed);

    if (dist < 0.2) {
      isTravelling.current = false;
    }

    // Gentle idle hovering offset
    const idleHover = Math.sin(t * 2.2) * 0.12;
    const idleSway = Math.sin(t * 1.5) * 0.08;

    rocketGroupRef.current.position.set(
      currentPos.current.x,
      currentPos.current.y + idleHover,
      currentPos.current.z
    );

    // Dynamic rotation / banking physics
    if (dist > 0.4) {
      // Flight direction vector
      const moveDir = new THREE.Vector3()
        .subVectors(targetPos.current, currentPos.current)
        .normalize();

      // Look along trajectory with forward tilt
      const targetLook = new THREE.Vector3()
        .copy(currentPos.current)
        .add(moveDir);

      // Pitch up during flight (nose forward & up)
      targetLook.y += 0.4;
      rocketGroupRef.current.lookAt(targetLook);

      // Bank into turns
      rocketGroupRef.current.rotation.z = -moveDir.x * 0.45;
    } else {
      // Gentle idle orientation when hovering at destination or home
      const defaultRotY = selectedIsland ? Math.PI * 0.25 : t * 0.35;
      rocketGroupRef.current.rotation.x = THREE.MathUtils.damp(
        rocketGroupRef.current.rotation.x,
        -0.15 + Math.sin(t * 1.2) * 0.05,
        4,
        delta
      );
      rocketGroupRef.current.rotation.y = THREE.MathUtils.damp(
        rocketGroupRef.current.rotation.y,
        defaultRotY,
        3,
        delta
      );
      rocketGroupRef.current.rotation.z = THREE.MathUtils.damp(
        rocketGroupRef.current.rotation.z,
        idleSway,
        4,
        delta
      );
    }

    // Engine thruster flame animation
    const isAccelerating = dist > 0.6;
    const flameFlicker = Math.sin(t * 28) * 0.15;
    const flameLen = isAccelerating ? 2.2 + flameFlicker : 1.0 + flameFlicker * 0.6;
    const flameThick = isAccelerating ? 1.4 : 0.8;

    if (flameCoreRef.current) {
      flameCoreRef.current.scale.set(flameThick, flameLen * 0.7, flameThick);
    }
    if (flameOuterRef.current) {
      flameOuterRef.current.scale.set(flameThick * 1.25, flameLen, flameThick * 1.25);
    }
    if (thrusterLightRef.current) {
      thrusterLightRef.current.intensity = isAccelerating ? 3.5 : 1.6;
    }

    // Rotate center pad ring slowly
    if (baseDaisRef.current) {
      baseDaisRef.current.rotation.y = t * 0.2;
    }
  });

  return (
    <group>
      {/* ======================================================== */}
      {/* CENTRAL LAUNCH DAIS (Base platform at the nexus center)   */}
      {/* ======================================================== */}
      <group position={[0, 0, 0]} onClick={onResetView}>
        {/* Floating Hexagonal Stone Dais */}
        <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.0, 1.6, 0.8, 6]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.3} />
        </mesh>

        {/* Outer Glowing Celestial Ring */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 1.9, 6]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
        </mesh>

        {/* Concentric Gyro Rings on Dais */}
        <group ref={baseDaisRef} position={[0, 0.1, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 0.95, 32]} />
            <meshBasicMaterial color="#818cf8" transparent opacity={0.6} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.4, 0.5, 32]} />
            <meshBasicMaterial color="#f472b6" transparent opacity={0.5} />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* THE 3D RETRO-SCIFI ROCKET                                */}
      {/* ======================================================== */}
      <group
        ref={rocketGroupRef}
        position={[0, 1.8, 0]}
        onClick={onResetView}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        {/* Sparkle Exhaust Trail */}
        <Sparkles
          position={[0, -1.2, 0]}
          count={20}
          scale={2.2}
          size={2.4}
          speed={0.8}
          color="#f97316"
          opacity={0.7}
        />

        {/* Thruster Dynamic Glow Light */}
        <pointLight
          ref={thrusterLightRef}
          position={[0, -1.1, 0]}
          color="#ff7b00"
          distance={6}
          intensity={2.0}
        />

        {/* Central Cockpit Warm/Cyan Point Light */}
        <pointLight
          position={[0, 0.4, 0.4]}
          color="#38bdf8"
          distance={3}
          intensity={1.2}
        />

        {/* --- ROCKET BODY STRUCTURE --- */}
        {/* 1. Main Fuselage Upper Body (Glossy Pearl White) */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.46, 1.1, 20]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.25}
            roughness={0.2}
          />
        </mesh>

        {/* 2. Red Mid-Hull Racing Stripe */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.47, 0.47, 0.22, 20]} />
          <meshStandardMaterial
            color="#dc2626"
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>

        {/* 3. Lower Fuselage Body (Pearl White) */}
        <mesh position={[0, -0.6, 0]} castShadow>
          <cylinderGeometry args={[0.47, 0.42, 0.4, 20]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.25}
            roughness={0.2}
          />
        </mesh>

        {/* 4. Nose Cone (Crimson Red with Aerodynamic Taper) */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <coneGeometry args={[0.38, 0.9, 20]} />
          <meshStandardMaterial
            color="#dc2626"
            metalness={0.4}
            roughness={0.25}
          />
        </mesh>

        {/* 5. Needle Antenna / Pitot Tube Tip */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.05, 0.4, 8]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 2.02, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* 6. Cockpit Observation Porthole (Bubble Visor) */}
        <group position={[0, 0.4, 0.36]} rotation={[0.2, 0, 0]}>
          {/* Chrome Bezel Ring */}
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[0.18, 0.035, 12, 24]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>
          {/* Glowing Cyan Glass Window */}
          <mesh position={[0, 0, -0.01]}>
            <sphereGeometry args={[0.16, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={1.4}
              roughness={0.1}
              metalness={0.7}
            />
          </mesh>
        </group>

        {/* 7. Stabilizer Fins (3 Aerodynamic Swept-Back Fins) */}
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
          <group key={`fin-${i}`} rotation={[0, angle, 0]}>
            <group position={[0.42, -0.65, 0]} rotation={[0, 0, -0.2]}>
              {/* Main Fin Blade */}
              <mesh castShadow>
                <boxGeometry args={[0.45, 0.7, 0.06]} />
                <meshStandardMaterial
                  color="#dc2626"
                  metalness={0.35}
                  roughness={0.3}
                />
              </mesh>
              {/* Chrome Fin Leading Edge */}
              <mesh position={[0.22, 0, 0]}>
                <boxGeometry args={[0.04, 0.7, 0.07]} />
                <meshStandardMaterial
                  color="#f1f5f9"
                  metalness={0.85}
                  roughness={0.2}
                />
              </mesh>
            </group>
          </group>
        ))}

        {/* 8. Engine Thruster Nozzle (Titanium Bell) */}
        <group position={[0, -0.9, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.32, 0.35, 16]} />
            <meshStandardMaterial
              color="#334155"
              metalness={0.9}
              roughness={0.35}
            />
          </mesh>
          <mesh position={[0, -0.18, 0]}>
            <torusGeometry args={[0.31, 0.03, 12, 24]} />
            <meshStandardMaterial
              color="#64748b"
              metalness={0.85}
              roughness={0.25}
            />
          </mesh>

          {/* --- THRUSTER FLAME CONES --- */}
          {/* Outer Orange Exhaust Cone */}
          <mesh
            ref={flameOuterRef}
            position={[0, -0.6, 0]}
            rotation={[Math.PI, 0, 0]}
          >
            <coneGeometry args={[0.25, 0.9, 16]} />
            <meshBasicMaterial
              color="#ea580c"
              transparent
              opacity={0.85}
            />
          </mesh>

          {/* Inner Bright Yellow/White Plasma Core */}
          <mesh
            ref={flameCoreRef}
            position={[0, -0.42, 0]}
            rotation={[Math.PI, 0, 0]}
          >
            <coneGeometry args={[0.15, 0.6, 16]} />
            <meshBasicMaterial
              color="#fef08a"
              transparent
              opacity={0.95}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};
