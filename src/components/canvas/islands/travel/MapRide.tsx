import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  TRAVEL_MAP, TRAVEL_ROUTE, TRAVEL_STAMPS, TRAVEL_STAMP_SIZE, travelStateAt,
} from '../../../../data/rides/explorer';
import { getRideProgress } from '../../../world/rideStore';
import { useTravelTextures } from './travelTextures';

/**
 * Everything World 6 (Map Explorer) adds to the Travel island while its ride is open:
 * the parchment map that unfolds above the island, the dotted route that draws itself
 * behind the plane, and the passport stamps that slam down at each trip.
 * Every state is a pure function of the scroll (worldRides.ts → travelStateAt).
 */

const MAP_W = (TRAVEL_MAP.lonSpan[1] - TRAVEL_MAP.lonSpan[0]) * TRAVEL_MAP.scale;
const MAP_H = (TRAVEL_MAP.latSpan[1] - TRAVEL_MAP.latSpan[0]) * TRAVEL_MAP.scale;
const LAST = TRAVEL_ROUTE.length - 1;

/** The plane's flight path (shared with TravelIsland's plane) */
export const travelCurve = new THREE.CatmullRomCurve3(TRAVEL_ROUTE.map((v) => new THREE.Vector3(...v)), false, 'centripetal');
/** point on the route at route position r (0 … LAST points) */
export const routePoint = (r: number, out: THREE.Vector3) => travelCurve.getPoint(Math.min(LAST, Math.max(0, r)) / LAST, out);
export const routeTangent = (r: number, out: THREE.Vector3) => travelCurve.getTangent(Math.min(LAST - 0.001, Math.max(0.001, r)) / LAST, out);

// dotted route: dots from the climb point to the last stop, flat on the map
const DOTS_PER_LEG = 26;
const dotRoute: { r: number; p: THREE.Vector3 }[] = [];
for (let r = 1; r <= LAST; r += 1 / DOTS_PER_LEG) {
  const p = routePoint(r, new THREE.Vector3());
  p.y = TRAVEL_MAP.y + 0.012;
  dotRoute.push({ r, p });
}
const dotGeo = new THREE.BoxGeometry(0.05, 0.012, 0.05);
const pinGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.02, 8);
const stampGeo = new THREE.PlaneGeometry(TRAVEL_STAMP_SIZE, TRAVEL_STAMP_SIZE);
const tmpM = new THREE.Matrix4();

export const MapRide: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const tex = useTravelTextures(true);
  const mapRef = useRef<THREE.Group>(null);
  const dotsRef = useRef<THREE.InstancedMesh | null>(null);
  const stampRefs = useRef<(THREE.Mesh | null)[]>([]);
  const pinRefs = useRef<(THREE.Mesh | null)[]>([]);
  const stampMats = useMemo(() => TRAVEL_STAMPS.map(() => new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, opacity: 0 })), []);

  // stamp textures arrive after the first render
  useEffect(() => { if (tex) stampMats.forEach((m, i) => { m.map = tex.stamps[i]; m.needsUpdate = true; }); }, [tex, stampMats]);
  useEffect(() => () => stampMats.forEach((m) => m.dispose()), [stampMats]);

  useFrame(() => {
    const s = travelStateAt(getRideProgress(), reducedMotion);
    const g = mapRef.current;
    if (g) {
      // unfolds sideways first, then top to bottom
      const sx = Math.max(0.001, Math.min(1, s.unfold / 0.55));
      const sz = Math.max(0.001, Math.min(1, (s.unfold - 0.35) / 0.65));
      g.visible = s.unfold > 0.01;
      g.scale.set(sx, 1, sz);
    }
    const dots = dotsRef.current;
    if (dots) {
      let n = 0;
      while (n < dotRoute.length && dotRoute[n].r <= s.route + 1e-4) n++;
      dots.count = s.unfold > 0.95 ? n : 0;
    }
    TRAVEL_STAMPS.forEach((st, i) => {
      const m = stampRefs.current[i];
      const t = s.stamps[i];
      if (m) {
        m.visible = t > 0.01;
        // slam: drops from above, big and faint, onto the map
        const k = 1 - t;
        m.position.set(st.position[0], st.position[1] + k * k * 1.6, st.position[2]);
        m.scale.setScalar(1 + k * 1.4);
        stampMats[i].opacity = Math.min(1, t * 1.6);
      }
      const pin = pinRefs.current[i];
      if (pin) pin.visible = t > 0.6;
    });
  });

  return (
    <group>
      {/* the map */}
      <group ref={mapRef} position={[0, TRAVEL_MAP.y, 0]} visible={false}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[MAP_W, MAP_H]} />
          <meshStandardMaterial map={tex?.map ?? null} emissiveMap={tex?.map ?? null} emissive="#ffffff" emissiveIntensity={0.45} color="#ffffff" roughness={0.95} />
        </mesh>
        {/* paper back, seen from below */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[MAP_W, MAP_H]} />
          <meshStandardMaterial color="#c9b483" roughness={1} />
        </mesh>
      </group>

      {/* dotted route (drawn behind the plane) */}
      <instancedMesh
        ref={(el) => {
          dotsRef.current = el;
          if (el && !el.userData.placed) {
            dotRoute.forEach((d, i) => el.setMatrixAt(i, tmpM.makeTranslation(d.p.x, d.p.y, d.p.z)));
            el.instanceMatrix.needsUpdate = true;
            el.userData.placed = true;
            el.count = 0;
          }
        }}
        args={[dotGeo, undefined, dotRoute.length]}
        frustumCulled={false}
      >
        <meshBasicMaterial color="#b3261e" />
      </instancedMesh>

      {/* pins + passport stamps */}
      {TRAVEL_STAMPS.map((st, i) => (
        <group key={st.city}>
          <mesh ref={(el) => { pinRefs.current[i] = el; }} geometry={pinGeo} position={st.pin} visible={false}>
            <meshBasicMaterial color="#b3261e" />
          </mesh>
          <mesh
            ref={(el) => { stampRefs.current[i] = el; }}
            geometry={stampGeo}
            material={stampMats[i]}
            rotation={[-Math.PI / 2, 0, st.tilt]}
            visible={false}
            renderOrder={2}
          />
        </group>
      ))}
    </group>
  );
};
