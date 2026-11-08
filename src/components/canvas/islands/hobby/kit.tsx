// World 4 ride pieces: downloaded when someone enters the world (see world/rideKits.ts).
import { useEffect } from 'react';
import { useQuestTextures, type QuestTextures } from './hobbyTextures';

export { SideScroller } from './SideScroller';
export { questStateAt } from '../../../../data/rides/quests';

/** Draws the ride's pixel textures and hands them to HobbyIsland (and frees them when the ride ends). */
export function QuestTextureMaker({ onChange }: { onChange: (tex: QuestTextures | null) => void }) {
  const tex = useQuestTextures(true);
  useEffect(() => {
    onChange(tex);
    return () => onChange(null);
  }, [tex, onChange]);
  return null;
}
