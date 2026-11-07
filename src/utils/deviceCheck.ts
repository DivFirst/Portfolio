/**
 * Can this device run the 3D world well? Checked once, before the 3D code downloads,
 * so old or slow phones are offered Recruiter Mode (/cv) instead of a broken world.
 *
 * - `webgl: false`  → no 3D at all (the world can't draw), so we go straight to /cv.
 * - `lowEnd: true`  → 3D works but is likely to be slow; we ask first.
 * Testing: ?3d skips the check, ?lite fakes a slow phone, ?no3d fakes a device without 3D.
 */
export interface DeviceSupport {
  webgl: boolean;
  lowEnd: boolean;
  /** plain-English reasons, for the console only */
  reasons: string[];
}

type NavigatorExtras = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

function probeWebGL(): { ok: boolean; software: boolean } {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') ?? canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return { ok: false, software: false };
    // A software renderer (no real graphics chip) runs the world at a few frames a second.
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    const software = /swiftshader|llvmpipe|software|basic render/i.test(renderer);
    gl.getExtension('WEBGL_lose_context')?.loseContext(); // free it right away
    return { ok: true, software };
  } catch {
    return { ok: false, software: false };
  }
}

export function checkDevice(): DeviceSupport {
  const q = new URLSearchParams(window.location.search);
  if (q.has('3d')) return { webgl: true, lowEnd: false, reasons: [] };
  // Test switches: ?lite pretends to be a slow phone, ?no3d pretends WebGL is missing.
  if (q.has('no3d')) return { webgl: false, lowEnd: true, reasons: ['test: ?no3d'] };
  if (q.has('lite')) return { webgl: true, lowEnd: true, reasons: ['test: ?lite'] };

  const reasons: string[] = [];
  const { ok, software } = probeWebGL();
  if (!ok) return { webgl: false, lowEnd: true, reasons: ['no WebGL'] };
  if (software) reasons.push('software graphics');

  const nav = navigator as NavigatorExtras;
  if (nav.connection?.saveData) reasons.push('data saver on');
  if (nav.connection?.effectiveType && /(^|-)2g$/.test(nav.connection.effectiveType)) reasons.push('slow network');
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) reasons.push(`${nav.deviceMemory} GB memory`);
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2) reasons.push(`${nav.hardwareConcurrency} CPU cores`);

  return { webgl: true, lowEnd: reasons.length > 0, reasons };
}

/** "Play the 3D game anyway" is remembered for this browser, so we only ask once. */
const PLAY_ANYWAY_KEY = 'arcade-3d-anyway';

export function wantsPlayAnyway(): boolean {
  try { return localStorage.getItem(PLAY_ANYWAY_KEY) === '1'; } catch { return false; }
}

export function rememberPlayAnyway() {
  try { localStorage.setItem(PLAY_ANYWAY_KEY, '1'); } catch { /* storage blocked: fine */ }
}
