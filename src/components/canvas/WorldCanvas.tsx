import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import { IslandMeta } from '../../types/portfolio';
import { portfolioData } from '../../data/portfolioData';
import { HexagonBase } from './HexagonBase';
import { CentralBeacon } from './CentralBeacon';
import { FloatingClouds } from './FloatingClouds';
import { MyLifeIsland } from './islands/MyLifeIsland';
import { ProfessionalIsland } from './islands/ProfessionalIsland';
import { ProjectsIsland } from './islands/ProjectsIsland';
import { HobbyIsland } from './islands/HobbyIsland';
import { BookstagramIsland } from './islands/BookstagramIsland';
import { TravelIsland } from './islands/TravelIsland';

interface WorldCanvasProps {
  selectedIsland: IslandMeta | null;
  onSelectIsland: (island: IslandMeta | null) => void;
}

const DEFAULT_CAMERA_POS: [number, number, number] = [22, 26, 22];
const DEFAULT_TARGET: [number, number, number] = [0, 0, 0];

// Smooth camera controller that lerps between overview and island focus
const CameraController: React.FC<{
  selectedIsland: IslandMeta | null;
  controlsRef: React.RefObject<OrbitControlsType | null>;
}> = ({ selectedIsland, controlsRef }) => {
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
  }, [selectedIsland]);

  useFrame((_, delta) => {
    // Smooth damp towards target
    camera.position.lerp(targetPos.current, Math.min(1, delta * 3.2));

    if (controlsRef.current) {
      controlsRef.current.target.lerp(lookTarget.current, Math.min(1, delta * 3.2));
      controlsRef.current.update();
    }
  });

  return null;
};

export const WorldCanvas: React.FC<WorldCanvasProps> = ({
  selectedIsland,
  onSelectIsland,
}) => {
  const controlsRef = useRef<OrbitControlsType | null>(null);

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

        {/* Central Beacon */}
        <CentralBeacon onResetView={() => onSelectIsland(null)} />

        {/* 1. My Life */}
        <HexagonBase
          meta={islands.life}
          isSelected={selectedIsland?.id === 'life'}
          onSelect={onSelectIsland}
        >
          <MyLifeIsland />
        </HexagonBase>

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

        {/* 6. Travel */}
        <HexagonBase
          meta={islands.travel}
          isSelected={selectedIsland?.id === 'travel'}
          onSelect={onSelectIsland}
        >
          <TravelIsland />
        </HexagonBase>

        {/* Camera Lerp Controller */}
        <CameraController selectedIsland={selectedIsland} controlsRef={controlsRef} />

        {/* Orbit Controls (constrained to maintain ~60° isometric perspective) */}
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          minDistance={10}
          maxDistance={50}
          minPolarAngle={Math.PI / 4.8} // ~37° angle
          maxPolarAngle={Math.PI / 2.3} // ~78° angle (keeps world visible from above)
          dampingFactor={0.08}
          rotateSpeed={0.6}
        />
      </Canvas>
    </div>
  );
};
