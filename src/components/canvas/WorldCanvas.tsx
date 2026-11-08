import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ScrollControls, Sparkles } from '@react-three/drei';
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
import { TravelIsland } from './islands/TravelIsland';
import { RetroSky } from './RetroSky';
import { SKY_COLOR } from './skyColor';
import { useReducedMotion } from '../arcade';
import type { Vec3, WorldRide } from '../../data/worldRides';
import { RideController } from '../world/RideController';

interface WorldCanvasProps {
  /** island whose world is open (null = map) */
  activeIsland: IslandMeta | null;
  /** that world's ride, once its script and 3D pieces have downloaded (world/rideKits.ts) */
  ride: WorldRide | null;
  /** clicking an island enters its world */
  onEnterIsland: (island: IslandMeta) => void;
  /** e.g. the rocket's "back" click */
  onLeave: () => void;
  resetKey?: number;
  /** Loading milestones for the boot screen: 'created' = WebGL scene set up, 'ready' = first frames drawn */
  onLoadStage?: (stage: 'created' | 'ready') => void;
  /** the browser dropped the 3D graphics (crash, out of memory): App offers Recruiter Mode */
  onContextLost?: () => void;
}

// Tells the boot screen the world is ready once a few real frames have been drawn
// (shaders compiled, shadows built), so PRESS START never reveals a half-drawn scene.
const FirstFramesWatcher: React.FC<{ onReady?: () => void }> = ({ onReady }) => {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current >= 3) {
      done.current = true;
      onReady?.();
    }
  });
  return null;
};

/**
 * Runs once when a ride opens, during the camera fly-in: uploads the ride's textures and prepares
 * every material (hidden ones too) on the graphics card now, instead of the first time each
 * object appears mid-scroll. Without it, a slow phone freezes for a moment at those points.
 */
const RideWarmup: React.FC = () => {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    // short wait so the ride's pieces and their textures (made on entry) are in the scene
    const id = window.setTimeout(() => {
      scene.traverse((o) => {
        const m = (o as THREE.Mesh).material;
        if (!m) return;
        for (const mat of Array.isArray(m) ? m : [m]) {
          for (const key of ['map', 'emissiveMap', 'alphaMap'] as const) {
            const tex = (mat as THREE.MeshStandardMaterial)[key];
            if (tex) gl.initTexture(tex);
          }
        }
      });
      gl.compileAsync(scene, camera).catch(() => { /* only a warm-up */ });
    }, 300);
    return () => window.clearTimeout(id);
  }, [gl, scene, camera]);
  return null;
};

const DEFAULT_CAMERA_POS: [number, number, number] = [22, 26, 22];
const DEFAULT_TARGET: [number, number, number] = [0, 0, 0];
/** How far an island rises when it's selected (HexagonBase lifts by 0.6) */
const SELECTED_LIFT = 0.6;

type CameraGoal = { position: THREE.Vector3; target: THREE.Vector3 };

/**
 * Map mode: glides to the overview, then hands control to the visitor (orbit / zoom).
 * World mode: follows the ride's camera goal every frame (the fly-in is the same glide).
 * Reduced motion: cuts instead of gliding.
 */
const CameraController: React.FC<{
  inWorld: boolean;
  goal: React.MutableRefObject<CameraGoal>;
  controlsRef: React.RefObject<OrbitControlsType | null>;
  resetKey?: number;
  isTransitioningRef: React.MutableRefObject<boolean>;
  reducedMotion: boolean;
}> = ({ inWorld, goal, controlsRef, resetKey, isTransitioningRef, reducedMotion }) => {
  const { camera } = useThree();
  const mapPos = useRef(new THREE.Vector3(...DEFAULT_CAMERA_POS));
  const mapTarget = useRef(new THREE.Vector3(...DEFAULT_TARGET));

  useEffect(() => {
    isTransitioningRef.current = true;
  }, [inWorld, resetKey, isTransitioningRef]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    const toPos = inWorld ? goal.current.position : mapPos.current;
    const toTarget = inWorld ? goal.current.target : mapTarget.current;

    if (inWorld || isTransitioningRef.current) {
      const k = reducedMotion ? 1 : Math.min(1, delta * (inWorld ? 4 : 3));
      camera.position.lerp(toPos, k);
      if (controls) {
        controls.target.lerp(toTarget, k);
        controls.update();
      } else {
        camera.lookAt(toTarget);
      }
      if (!inWorld && camera.position.distanceTo(toPos) < 0.08 && (!controls || controls.target.distanceTo(toTarget) < 0.08)) {
        isTransitioningRef.current = false; // back on the map: the visitor can orbit again
      }
    } else if (controls) {
      controls.update(); // orbit damping
    }
  });

  return null;
};

export const WorldCanvas: React.FC<WorldCanvasProps> = ({
  activeIsland,
  ride: rideIn,
  onEnterIsland,
  onLeave,
  resetKey = 0,
  onLoadStage,
  onContextLost,
}) => {
  const selectedIsland = activeIsland;
  const onSelectIsland = (island: IslandMeta | null) => { if (island) onEnterIsland(island); else onLeave(); };
  const ride = activeIsland && rideIn?.islandId === activeIsland.id ? rideIn : null;
  const rideOrigin: Vec3 | null = activeIsland
    ? [activeIsland.coordinates[0], activeIsland.coordinates[1] + SELECTED_LIFT, activeIsland.coordinates[2]]
    : null;
  const cameraGoal = useRef<CameraGoal>({ position: new THREE.Vector3(), target: new THREE.Vector3() });
  // Device "reduce motion" setting or Recruiter Mode: stop idle animations in the world.
  const reducedMotion = useReducedMotion();
  const controlsRef = useRef<OrbitControlsType | null>(null);
  const isTransitioningRef = useRef(false);

  const handleControlStart = () => {
    // Instantly yield 100% control to user drag / scroll so it never fights or reverts
    isTransitioningRef.current = false;
  };

  const islands = portfolioData.islands;

  return (
    <div className={ride ? 'w-full h-full relative' : 'w-full h-full relative cursor-grab active:cursor-grabbing'}>
      <Canvas
        shadows
        camera={{
          position: DEFAULT_CAMERA_POS,
          fov: 38,
          near: 0.1,
          far: 200,
        }}
        // cap pixel density: crisp on retina laptops without rendering 4x the pixels
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', () => onContextLost?.(), { once: true });
          onLoadStage?.('created');
        }}
      >
        <FirstFramesWatcher onReady={() => onLoadStage?.('ready')} />
        <color attach="background" args={[SKY_COLOR]} />
        <fog attach="fog" args={[SKY_COLOR, 30, 85]} />

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
        {/* Retro sky: pixel stars + synthwave grid floor */}
        <RetroSky reducedMotion={reducedMotion} />
        <Sparkles count={60} scale={35} size={2.5} speed={reducedMotion ? 0 : 0.4} opacity={0.35} color="#9d4dff" />

        {/* Central Flying Rocket (Navigates to selected island) */}
        <FlyingRocket
          selectedIsland={ride ? null : selectedIsland}
          onResetView={() => onSelectIsland(null)}
        />

        {/* 1. My Life (3D Flying Leatherbound Book) */}
        <FlyingBookIsland
          meta={islands.life}
          isSelected={selectedIsland?.id === 'life'}
          onSelect={onSelectIsland}
          reducedMotion={reducedMotion}
          hideSign={!!ride}
          rideActive={ride?.islandId === 'life'}
        />

        {/* 2. Professional */}
        <HexagonBase
          meta={islands.professional}
          isSelected={selectedIsland?.id === 'professional'}
          onSelect={onSelectIsland}
          reducedMotion={reducedMotion}
          hideSign={!!ride}
        >
          <ProfessionalIsland rideActive={ride?.islandId === 'professional'} reducedMotion={reducedMotion} />
        </HexagonBase>

        {/* 3. Projects */}
        <HexagonBase
          meta={islands.projects}
          isSelected={selectedIsland?.id === 'projects'}
          onSelect={onSelectIsland}
          reducedMotion={reducedMotion}
          hideSign={!!ride}
        >
          <ProjectsIsland rideActive={ride?.islandId === 'projects'} reducedMotion={reducedMotion} />
        </HexagonBase>

        {/* 4. Hobby */}
        <HexagonBase
          meta={islands.hobby}
          isSelected={selectedIsland?.id === 'hobby'}
          onSelect={onSelectIsland}
          reducedMotion={reducedMotion}
          hideSign={!!ride}
        >
          <HobbyIsland rideActive={ride?.islandId === 'hobby'} reducedMotion={reducedMotion} />
        </HexagonBase>

        {/* 5. Bookstagram */}
        <HexagonBase
          meta={islands.bookstagram}
          isSelected={selectedIsland?.id === 'bookstagram'}
          onSelect={onSelectIsland}
          reducedMotion={reducedMotion}
          hideSign={!!ride}
        >
          <BookstagramIsland rideActive={ride?.islandId === 'bookstagram'} reducedMotion={reducedMotion} />
        </HexagonBase>

        {/* 6. Travel */}
        <HexagonBase
          meta={islands.travel}
          isSelected={selectedIsland?.id === 'travel'}
          onSelect={onSelectIsland}
          reducedMotion={reducedMotion}
          hideSign={!!ride}
        >
          <TravelIsland rideActive={ride?.islandId === 'travel'} reducedMotion={reducedMotion} />
        </HexagonBase>

        {/* Camera Lerp Controller */}
        <CameraController
          inWorld={!!ride}
          goal={cameraGoal}
          controlsRef={controlsRef}
          resetKey={resetKey}
          isTransitioningRef={isTransitioningRef}
          reducedMotion={reducedMotion}
        />

        {/* World mode: a native scroll area over the canvas drives the ride (wheel, trackpad, touch) */}
        {ride && rideOrigin && (
          <ScrollControls
            key={ride.slug}
            pages={ride.pages ?? ride.chapters.length + 1}
            damping={reducedMotion ? 0.0001 : 0.18}
            style={{ zIndex: '1' } as React.CSSProperties}
          >
            <RideController ride={ride} origin={rideOrigin} goal={cameraGoal.current} reducedMotion={reducedMotion} />
          </ScrollControls>
        )}
        {ride && <RideWarmup key={`warmup-${ride.slug}`} />}

        {/* Orbit Controls (smooth, responsive rotation & zoom) */}
        <OrbitControls
          ref={controlsRef}
          enabled={!ride}
          onStart={handleControlStart}
          enablePan={false}
          enableZoom={true}
          enableDamping={true}
          dampingFactor={0.06}
          rotateSpeed={0.85}
          zoomSpeed={1.2}
          // same for close-ups: World 5 reads books from about 4 units away
          minDistance={ride ? 1 : 8}
          // the zoom limit is for the visitor on the map; ride cameras (e.g. World 3's orbit shot) may go further
          maxDistance={ride ? 400 : 55}
          minPolarAngle={Math.PI / 6} // ~30° angle
          maxPolarAngle={Math.PI / 2.15} // ~83.7° angle (above horizon)
        />
      </Canvas>
    </div>
  );
};
