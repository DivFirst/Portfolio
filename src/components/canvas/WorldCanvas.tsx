import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import { IslandMeta } from '../../types/portfolio';
import { portfolioData } from '../../data/portfolioData';
import { HexagonBase } from './HexagonBase';
import { FlyingRocket } from './FlyingRocket';
import { FloatingClouds } from './FloatingClouds';
import { FlyingBookIsland } from './islands/FlyingBookIsland';
import { ProfessionalIsland } from './islands/ProfessionalIsland';
import { ProjectsIsland } from './islands/ProjectsIsland';
import { HobbyIsland } from './islands/HobbyIsland';
import { BookstagramIsland } from './islands/BookstagramIsland';

interface WorldCanvasProps {
  selectedIsland: IslandMeta | null;
  onSelectIsland: (island: IslandMeta | null) => void;
  resetKey?: number;
}

const DEFAULT_CAMERA_POS: [number, number, number] = [22, 26, 22];
const DEFAULT_TARGET: [number, number, number] = [0, 0, 0];

// Smooth camera controller that lerps between overview and island focus without fighting user interactions
const CameraController: React.FC<{
  selectedIsland: IslandMeta | null;
  controlsRef: React.RefObject<OrbitControlsType | null>;
  resetKey?: number;
  isTransitioningRef: React.MutableRefObject<boolean>;
}> = ({ selectedIsland, controlsRef, resetKey, isTransitioningRef }) => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(...DEFAULT_CAMERA_POS));
  const lookTarget = useRef(new THREE.Vector3(...DEFAULT_TARGET));

  useEffect(() => {
    if (selectedIsland) {
      targetPos.current.set(...selectedIsland.cameraPosition);
      lookTarget.current.set(...selectedIsland.cameraTarget);
    } else {
      targetPos.current.set(...DEFAULT_CAMERA_POS);
      lookTarget.current.set(...DEFAULT_TARGET);
    }
    isTransitioningRef.current = true;
  }, [selectedIsland, resetKey, isTransitioningRef]);

  useFrame((_, delta) => {
    if (isTransitioningRef.current) {
      // Smooth damped interpolation towards destination
      const lerpFactor = Math.min(1, delta * 3.0);
      camera.position.lerp(targetPos.current, lerpFactor);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(lookTarget.current, lerpFactor);
        controlsRef.current.update();
      }

      // Check if camera has reached close enough to destination
      const posDist = camera.position.distanceTo(targetPos.current);
      const targetDist = controlsRef.current
        ? controlsRef.current.target.distanceTo(lookTarget.current)
        : 0;

      if (posDist < 0.08 && targetDist < 0.08) {
        camera.position.copy(targetPos.current);
        if (controlsRef.current) {
          controlsRef.current.target.copy(lookTarget.current);
          controlsRef.current.update();
        }
        isTransitioningRef.current = false;
      }
    } else {
      // Not transitioning: user is orbiting or idle.
      // OrbitControls computes smooth inertia damping
      if (controlsRef.current) {
        controlsRef.current.update();
      }
    }
  });

  return null;
};

export const WorldCanvas: React.FC<WorldCanvasProps> = ({
  selectedIsland,
  onSelectIsland,
  resetKey = 0,
}) => {
  const controlsRef = useRef<OrbitControlsType | null>(null);
  const isTransitioningRef = useRef(false);

  const handleControlStart = () => {
    // Instantly yield 100% control to user drag / scroll so it never fights or reverts
    isTransitioningRef.current = false;
  };

  const islands = portfolioData.islands;

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        camera={{
          position: DEFAULT_CAMERA_POS,
          fov: 38,
          near: 0.1,
          far: 200,
        }}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={["#070a13"]} />
        <fog attach="fog" args={["#070a13", 25, 75]} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.65} color="#e0e7ff" />
        <directionalLight
          position={[18, 30, 15]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={70}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
          shadow-bias={-0.0001}
          color="#fffbeb"
        />
        <hemisphereLight args={["#818cf8", "#1e1b4b", 0.45]} />

        {/* Floating Clouds & Atmosphere */}
        <FloatingClouds />
        <Stars radius={60} depth={30} count={1200} factor={4} saturation={0.5} fade speed={1} />
        <Sparkles count={90} scale={35} size={2.5} speed={0.4} opacity={0.4} color="#818cf8" />

        {/* Central Flying Rocket (Navigates to selected island) */}
        <FlyingRocket
          selectedIsland={selectedIsland}
          onResetView={() => onSelectIsland(null)}
        />

        {/* 1. My Life (3D Flying Leatherbound Book) */}
        <FlyingBookIsland
          meta={islands.life}
          isSelected={selectedIsland?.id === 'life'}
          onSelect={onSelectIsland}
        />

        {/* 2. Professional */}
        <HexagonBase
          meta={islands.professional}
          isSelected={selectedIsland?.id === 'professional'}
          onSelect={onSelectIsland}
        >
          <ProfessionalIsland />
        </HexagonBase>

        {/* 3. Projects */}
        <HexagonBase
          meta={islands.projects}
          isSelected={selectedIsland?.id === 'projects'}
          onSelect={onSelectIsland}
        >
          <ProjectsIsland />
        </HexagonBase>

        {/* 4. Hobby */}
        <HexagonBase
          meta={islands.hobby}
          isSelected={selectedIsland?.id === 'hobby'}
          onSelect={onSelectIsland}
        >
          <HobbyIsland />
        </HexagonBase>

        {/* 5. Bookstagram */}
        <HexagonBase
          meta={islands.bookstagram}
          isSelected={selectedIsland?.id === 'bookstagram'}
          onSelect={onSelectIsland}
        >
          <BookstagramIsland />
        </HexagonBase>

        {/* Camera Lerp Controller */}
        <CameraController
          selectedIsland={selectedIsland}
          controlsRef={controlsRef}
          resetKey={resetKey}
          isTransitioningRef={isTransitioningRef}
        />

        {/* Orbit Controls (smooth, responsive rotation & zoom) */}
        <OrbitControls
          ref={controlsRef}
          onStart={handleControlStart}
          enablePan={false}
          enableZoom={true}
          enableDamping={true}
          dampingFactor={0.06}
          rotateSpeed={0.85}
          zoomSpeed={1.2}
          minDistance={8}
          maxDistance={55}
          minPolarAngle={Math.PI / 6} // ~30° angle
          maxPolarAngle={Math.PI / 2.15} // ~83.7° angle (above horizon)
        />
      </Canvas>
    </div>
  );
};
