import React, { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import type { WorldRide, Vec3 } from '../../data/worldRides';
import { hotspotPositions, rideScroll, setRideProgress } from './rideStore';

interface RideControllerProps {
  ride: WorldRide;
  /** island centre in world space (incl. its "selected" lift) */
  origin: Vec3;
  /** written every frame: where the camera should be */
  goal: { position: THREE.Vector3; target: THREE.Vector3 };
  reducedMotion: boolean;
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const projected = new THREE.Vector3();

/**
 * Lives inside <ScrollControls>. Each frame it reads the scroll position (0–1) and
 *  - moves the camera goal along the chapter cameras (exactly follows scroll, both ways),
 *  - publishes progress for the HUD,
 *  - projects pinned hotspots to screen positions for the hotspot layer.
 * Reduced motion: the camera cuts from chapter to chapter instead of gliding.
 */
export const RideController: React.FC<RideControllerProps> = ({ ride, origin, goal, reducedMotion }) => {
  const scroll = useScroll();
  const { camera, size } = useThree();

  // Give the HUD a handle on the scroll area (keyboard + hints), and reset on leave.
  useEffect(() => {
    rideScroll.el = scroll.el;
    scroll.el.scrollTop = 0;
    scroll.el.setAttribute('aria-label', 'World ride: scroll to play');
    // The map's OrbitControls attach to this element too and set touch-action: none,
    // which blocks phone swipes; the .arcade-ride-scroll CSS rule turns vertical swiping back on.
    scroll.el.classList.add('arcade-ride-scroll');
    return () => { if (rideScroll.el === scroll.el) rideScroll.el = null; };
  }, [scroll.el]);

  useFrame(() => {
    const p = scroll.offset;
    setRideProgress(p);

    const chapters = ride.chapters;
    const n = chapters.length;
    let a = 0, b = 0, t = 0;
    if (n > 1) {
      const x = p * (n - 1);
      a = Math.min(n - 2, Math.floor(x));
      b = a + 1;
      t = reducedMotion ? (x - a < 0.5 ? 0 : 1) : smooth(x - a);
    }
    const [ox, oy, oz] = origin;
    // Tall, narrow screens (phones): use the ride's own phone cameras when every chapter has one
    const aspect = size.width / size.height;
    const phoneCams = aspect < 1 && chapters.every((c) => c.cameraPortrait);
    const ca = (phoneCams && chapters[a].cameraPortrait) || chapters[a].camera;
    const cb = (phoneCams && chapters[b].cameraPortrait) || chapters[b].camera;
    goal.position.copy(tmpA.set(...ca.position)).lerp(tmpB.set(...cb.position), t).add(tmpA.set(ox, oy, oz));
    goal.target.copy(tmpA.set(...ca.target)).lerp(tmpB.set(...cb.target), t).add(tmpA.set(ox, oy, oz));

    // Otherwise phones see less side-to-side: pull the camera back so the shot still fits.
    if (aspect < 1 && !phoneCams) {
      const pull = Math.min(1.8, Math.sqrt(1 / aspect)) * (ride.portrait?.pull ?? 1);
      goal.position.sub(goal.target).multiplyScalar(pull).add(goal.target);
      if (ride.portrait?.shift) {
        tmpA.set(...ride.portrait.shift);
        goal.position.add(tmpA);
        goal.target.add(tmpA);
      }
    }

    // pinned hotspots -> screen pixels
    for (const ch of chapters) {
      for (const h of ch.hotspots) {
        const at = (phoneCams && h.anchorPortrait) || h.anchor;
        if (!at) continue;
        projected.set(at[0] + ox, at[1] + oy, at[2] + oz).project(camera);
        hotspotPositions.set(h.id, {
          x: (projected.x * 0.5 + 0.5) * size.width,
          y: (-projected.y * 0.5 + 0.5) * size.height,
          onScreen: projected.z < 1 && Math.abs(projected.x) < 1.1 && Math.abs(projected.y) < 1.1,
        });
      }
    }
  });

  return null;
};
