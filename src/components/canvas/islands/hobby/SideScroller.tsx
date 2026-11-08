import React, { useRef } from 'react';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { QUEST_SCENES, QUEST_STRIP, questStateAt } from '../../../../data/rides/quests';
import { getRideProgress } from '../../../world/rideStore';
import type { QuestTextures } from './hobbyTextures';

/**
 * World 4 (Side Quests) inside the arcade game: a pixel strip far below the island,
 * only drawn while the camera is "inside" the cabinet. Pixel Divyanshu walks along it
 * with the scroll; the shuttlecock rallies, the sound bars bounce and
 * the portal swirls, all driven by the scroll (so scrolling up plays them backwards).
 * A dark veil in front of the camera covers the dive in (and the jump back out).
 */

const { x0, x1, y0, y1, ground, origin, yaw } = QUEST_STRIP;
const [court, booth, portal] = QUEST_SCENES.map((s) => s.sx);
const YOU_W = 24 / 64, YOU_H = 44 / 64; // 12×22 pixel sprite at 2× the strip's pixel size
const tri = (u: number) => 1 - Math.abs((((u % 2) + 2) % 2) - 1);
const tmpV = new THREE.Vector3();

export const SideScroller: React.FC<{ tex: QuestTextures | null; reducedMotion: boolean }> = ({ tex, reducedMotion }) => {
  const { scene, camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const youRef = useRef<THREE.Mesh>(null);
  const youMat = useRef<THREE.MeshBasicMaterial>(null);
  const shuttleRef = useRef<THREE.Mesh>(null);
  const barRefs = useRef<(THREE.Mesh | null)[]>([]);
  const portalRef = useRef<THREE.Mesh>(null);
  const veilRef = useRef<THREE.Mesh>(null);
  const veilMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const s = questStateAt(getRideProgress(), reducedMotion);
    const x = s.x;
    if (groupRef.current) groupRef.current.visible = s.inside;
    if (s.inside) {
      if (youRef.current) youRef.current.position.set(s.walker, ground + YOU_H / 2, 0.03);
      if (youMat.current && tex) {
        const frame = Math.floor(s.walker * 5) % 2 === 0 ? 0 : 1;
        if (youMat.current.map !== tex.you[frame]) { youMat.current.map = tex.you[frame]; youMat.current.needsUpdate = true; }
      }
      // shuttle rallies over the net with the scroll
      if (shuttleRef.current) {
        const k = tri((x - 1.6) * 2.4);
        shuttleRef.current.visible = x < 2.75;
        shuttleRef.current.position.set(court - 0.45 + k * 1.45, ground + 0.45 + Math.sin(Math.PI * k) * 0.55, 0.04);
        shuttleRef.current.rotation.z = (k - 0.5) * 2;
      }
      barRefs.current.forEach((b, i) => {
        if (!b) return;
        const h = 0.08 + 0.32 * Math.abs(Math.sin(x * 9 + i * 1.3));
        b.scale.y = h;
        b.position.y = ground + 0.45 + h / 2;
      });
      if (portalRef.current) {
        portalRef.current.rotation.z = -x * 2.2;
        portalRef.current.scale.setScalar(1 + Math.sin(x * 4) * 0.04);
      }
    }
    const veil = veilRef.current;
    if (veil && veilMat.current) {
      veil.visible = s.veil > 0.01;
      veilMat.current.opacity = s.veil;
      camera.getWorldDirection(tmpV);
      veil.position.copy(camera.position).addScaledVector(tmpV, 0.3);
      veil.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <>
      <group ref={groupRef} position={origin} rotation={[0, yaw, 0]} visible={false}>
        {/* backdrop: hides everything behind the game */}
        <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, -0.4]}>
          <planeGeometry args={[60, 40]} />
          <meshBasicMaterial color="#0b0b1a" />
        </mesh>
        <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, 0]}>
          <planeGeometry args={[x1 - x0, y1 - y0]} />
          <meshBasicMaterial map={tex?.strip ?? null} color={tex ? '#ffffff' : '#120a2c'} />
        </mesh>
        <mesh ref={youRef}>
          <planeGeometry args={[YOU_W, YOU_H]} />
          <meshBasicMaterial ref={youMat} transparent alphaTest={0.5} />
        </mesh>
        <mesh ref={shuttleRef}>
          <planeGeometry args={[0.12, 0.12]} />
          <meshBasicMaterial map={tex?.shuttle ?? null} transparent alphaTest={0.5} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} ref={(el) => { barRefs.current[i] = el; }} position={[booth + 0.5 + i * 0.09, ground + 0.6, 0.02]}>
            <planeGeometry args={[0.06, 1]} />
            <meshBasicMaterial color={i % 2 ? '#00f0ff' : '#39ff14'} />
          </mesh>
        ))}
        <mesh ref={portalRef} position={[portal + 0.635, ground + 0.54, 0.02]}>
          <planeGeometry args={[0.9, 0.9]} />
          <meshBasicMaterial map={tex?.portal ?? null} transparent alphaTest={0.3} />
        </mesh>
      </group>
      {createPortal(
        <mesh ref={veilRef} renderOrder={998} visible={false} frustumCulled={false}>
          <planeGeometry args={[4, 4]} />
          <meshBasicMaterial ref={veilMat} color="#04120a" transparent opacity={0} depthTest={false} depthWrite={false} />
        </mesh>,
        scene,
      )}
    </>
  );
};
