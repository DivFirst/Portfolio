// Arcade kit sounds now come from the site's single 8-bit engine (src/utils/soundEffects.ts),
// so the kit and the 3D world share one volume, one mute switch and the "no sound before a
// click" rule. Call through useArcade().play(), which respects the 🔊 toggle.
import { sound, type Sfx } from '../../utils/soundEffects';

export type ArcadeSfx = Sfx;

export function playArcadeSfx(sfx: ArcadeSfx) {
  sound.playNow(sfx);
}
