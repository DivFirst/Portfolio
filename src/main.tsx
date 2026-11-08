import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { checkDevice } from './utils/deviceCheck';

/**
 * Two pages share this entry:
 *   /cv  → Recruiter Mode: a light page, never downloads the 3D code.
 *   /    → the arcade game (3D world).
 * Each one is its own download, so /cv stays fast.
 */
const path = window.location.pathname.replace(/\/+$/, '') || '/';
const params = new URLSearchParams(window.location.search);
const root = ReactDOM.createRoot(document.getElementById('root')!);

function savedRecruiter(): boolean {
  try {
    const raw = localStorage.getItem('arcade-intro'); // written by IntroGate
    return !!raw && (JSON.parse(raw) as { mode?: string }).mode === 'recruiter';
  } catch {
    return false;
  }
}

function goToCv(reason?: string) {
  window.location.replace(reason ? `/cv?from=${reason}` : '/cv');
}

if (path === '/cv') {
  import('./pages/RecruiterPage').then(({ RecruiterPage }) => {
    root.render(<React.StrictMode><RecruiterPage /></React.StrictMode>);
  });
} else {
  const device = checkDevice();
  const onWorldLink = /^#./.test(window.location.hash);
  if (device.reasons.length) console.info('[3D check]', device.reasons.join(', '));

  if (!device.webgl) {
    // No 3D on this device: the world would be a blank screen, so show the CV instead.
    goToCv('no3d');
  } else if (savedRecruiter() && !onWorldLink && !params.has('intro') && !params.has('play')) {
    // Returning visitor who picked Recruiter Mode last time (?play / ?intro = they asked for the game).
    goToCv();
  } else {
    // The boot screen code is small and loads first; App starts the big 3D download as soon as it
    // mounts. (Starting both at once made them share the connection and delayed the first screen.)
    import('./App').then(({ App }) => {
      root.render(<React.StrictMode><App lowEndDevice={device.lowEnd} /></React.StrictMode>);
    });
  }
}
