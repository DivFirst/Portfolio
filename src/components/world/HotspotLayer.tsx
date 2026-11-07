import React, { useEffect, useRef } from 'react';
import { Hotspot } from '../arcade';
import type { Accent } from '../arcade';
import { chapterRange, type RideHotspot, type WorldRide } from '../../data/worldRides';
import { hotspotPositions, useRidePercent } from './rideStore';

/** Inside an info box: 2–3 lines, optional image and link. */
function InfoBoxBody({ hotspot }: { hotspot: RideHotspot }) {
  const { lines, image, link } = hotspot.content;
  return (
    <div className="arcade-infobox">
      {image && <img src={image.src} alt={image.alt} className="mb-3 w-full" loading="lazy" />}
      {lines.map((l, i) => <p key={i}>{l}</p>)}
      {link && (
        <p className="mt-3">
          <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
        </p>
      )}
    </div>
  );
}

/** One hotspot that follows its 3D anchor (or sits at a fixed screen spot). */
function PlacedHotspot({ hotspot, accent }: { hotspot: RideHotspot; accent: Accent }) {
  const ref = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = React.useState<'right' | 'left'>('right');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (hotspot.screen) {
      el.style.left = `${hotspot.screen.x * 100}%`;
      el.style.top = `${hotspot.screen.y * 100}%`;
      setPlacement(hotspot.screen.x > 0.55 ? 'left' : 'right');
      return;
    }
    // Follow the 3D anchor every frame. left/top (not transform) so the phone pop-up,
    // which is position: fixed, stays centred on the screen.
    let raf = 0;
    let lastSide: 'right' | 'left' = 'right';
    const tick = () => {
      const pos = hotspotPositions.get(hotspot.id);
      if (pos) {
        el.style.left = `${Math.round(pos.x)}px`;
        el.style.top = `${Math.round(pos.y)}px`;
        el.style.visibility = pos.onScreen ? 'visible' : 'hidden';
        const side = pos.x > window.innerWidth * 0.55 ? 'left' : 'right';
        if (side !== lastSide) { lastSide = side; setPlacement(side); }
      }
      raf = requestAnimationFrame(tick);
    };
    el.style.visibility = 'hidden'; // until the first position arrives
    tick();
    return () => cancelAnimationFrame(raf);
  }, [hotspot]);

  return (
    <div ref={ref} className="arcade-hotspot-pin">
      <Hotspot label={hotspot.label} title={hotspot.content.title} accent={accent} placement={placement}>
        <InfoBoxBody hotspot={hotspot} />
      </Hotspot>
    </div>
  );
}

/**
 * All "?" blocks of the open world. Each shows only during its part of the scroll
 * (default: its chapter's part). Sits above the 3D scene, below the HUD bars.
 */
export function HotspotLayer({ ride, accent }: { ride: WorldRide; accent: Accent }) {
  const percent = useRidePercent();
  const p = percent / 100;

  const visible = ride.chapters.flatMap((ch, i) =>
    ch.hotspots.filter((h) => {
      const [from, to] = h.show ?? chapterRange(ride, i);
      return p >= from && p <= to;
    }),
  );

  return (
    <div className="arcade-hotspot-layer">
      {visible.map((h) => <PlacedHotspot key={h.id} hotspot={h} accent={accent} />)}
    </div>
  );
}
