# DESIGN.md: "DIVYANSHU: THE GAME" arcade style

The single source of truth for how the site looks, sounds and moves.
Concept and flow live in `BUILD_GUIDE.md` Part 2; this file is the rulebook for building it.
Live sample of every piece: run `npm run dev` and open **http://localhost:3000/style-test/**.

**One-line brief:** an 80s/90s arcade cabinet that a recruiter can still read in 2 seconds.
When style and readability disagree, **readability wins**.

---

## 1. Fonts

| Role | Font | Where | Rules |
|---|---|---|---|
| **Display / HUD** | `Press Start 2P` | Page titles, section headings, HUD labels, button labels, badges, tags | Never for sentences. Max ~6 words per line. Uppercase. Sizes 10–32px only (it looks huge). Letter-spacing `0.04em`. Line-height 1.5+. |
| **Body** | `JetBrains Mono` | Paragraphs, resume bullets, info boxes, links, form text | Default 16px (never below 14px). Line-height 1.6. Max line length ~65 characters. Weight 400 body, 700 for emphasis. |
| **Numbers / terminal accents** | `VT323` | Score counters, big stats ("−95%"), boot-screen lines, the `>` prompt | Only at 24px+ (it's tiny and thin below that). Never for paragraphs. |

Why JetBrains Mono for body and not VT323: VT323 looks more "pixel", but at paragraph size its small letters
are hard to read on phones. JetBrains Mono keeps the terminal feel and stays readable. (The sample page has a
switch to compare both.)

Load from Google Fonts with `display=swap`:
`Press+Start+2P` · `VT323` · `JetBrains+Mono:wght@400;700`.
Fallbacks: `"Press Start 2P", "Courier New", monospace` · `"JetBrains Mono", ui-monospace, Consolas, monospace` · `VT323, monospace`.

### Type scale

| Token | Font | Desktop | Phone |
|---|---|---|---|
| `title-xl` (boot screen) | Press Start 2P | 32px | 18px |
| `h1` | Press Start 2P | 24px | 16px |
| `h2` | Press Start 2P | 16px | 13px |
| `hud` / `label` | Press Start 2P | 10–12px | 10px |
| `body` | JetBrains Mono | 16px | 15px |
| `small` | JetBrains Mono | 14px | 14px |
| `score` | VT323 | 48px | 36px |

---

## 2. Colour palette

Dark arcade background, neon accents. Contrast ratios are measured against the page background (`bg`) and panel (`panel`).

| Token | Hex | Contrast on bg / panel | Use |
|---|---|---|---|
| `bg` | `#0b0b1a` | – | Page background |
| `panel` | `#14142b` | – | Panels, info boxes, cards |
| `panel-2` | `#1d1d3a` | – | Insets, stat-bar tracks, hover fill |
| `text` | `#e8e8f5` | 16.1 / 14.8 | All body text |
| `muted` | `#a0a0c0` | 7.7 / 7.1 | Secondary text, captions, dates |
| `dim` | `#6b6b8f` | 3.8 / 3.5 | **Decoration and disabled states only, never text a recruiter must read** |
| `pink` | `#ff2e88` | 5.6 / 5.2 | Primary accent, primary buttons, "1UP", hearts |
| `cyan` | `#00f0ff` | 13.8 / 12.8 | Links, focus rings, info |
| `yellow` | `#ffe600` | 15.4 / 14.2 | Scores, coins, "PRESS START", warnings |
| `green` | `#39ff14` | 14.4 / 13.3 | Success, "STAGE CLEAR", stat bars filling |
| `purple` | `#9d4dff` | 4.6 / 4.2 | Borders, glows, large shapes |
| `purple-text` | `#b57bff` | 6.7 / 6.2 | Purple when it's used **as text** (raw purple is too dark on panels) |

**Rules**
- Body text is always `text` or `muted`. Neon colours are for headings, labels, numbers, borders and buttons, not paragraphs.
- On a neon fill (buttons, badges), text is `bg` (`#0b0b1a`), never white. All neons pass 5:1+ with dark text.
- Max **2 neon colours** in any one component. Max 3 on screen at once outside the HUD.
- **Each world owns one accent** (used for its hotspots, progress bar and headings):
  World 1 Origin Story = `yellow` · World 2 Career Mode = `cyan` · World 3 Boss Battles = `pink` ·
  World 4 Side Quests = `green` · World 5 Lore Library = `purple` · World 6 Map Explorer = `yellow` (shares with World 1; the map makes it look different).
  Global UI (HUD, nav, Recruiter Mode) uses `pink` + `cyan`.
- Glow is a coloured `box-shadow`/`text-shadow` at low strength (see §5). Never glow body text.

---

## 3. Pixel borders and shapes

- **Square corners everywhere.** `border-radius: 0`. No pills, no circles (except actual round objects in 3D).
- **No glassmorphism.** No `backdrop-filter: blur`. Panels are solid `panel` colour (95–100% opaque).
- **Pixel border** = a 4px solid border plus "notched" corners (corner pixels cut out), drawn with stacked
  `box-shadow`s so it stays crisp at any size:

  ```css
  .pixel-border {
    --px: 4px;            /* one "pixel" */
    --c: var(--cyan);     /* border colour */
    box-shadow:
      /* outer frame, with the 4 corner pixels left empty */
      0 calc(var(--px) * -1) 0 0 var(--c),
      0 var(--px) 0 0 var(--c),
      calc(var(--px) * -1) 0 0 0 var(--c),
      var(--px) 0 0 0 var(--c);
  }
  ```
- **Hard drop shadow** (no blur) for anything raised: `box-shadow: 4px 4px 0 0 #000`.
- Spacing grid: multiples of **4px** (4, 8, 12, 16, 24, 32, 48). Sizes snap to the grid so edges look pixel-sharp.
- Icons: simple pixel glyphs or text symbols (`▶ ◀ ▼ ✕ ❤ ★ ?`). Lucide icons are allowed only at 16/24px, stroke 2.5, square caps.

---

## 4. Components

### Panel (`PixelPanel`)
Solid `panel` background, pixel border in an accent colour, 4px hard black shadow, padding 16px (phone) / 24px (desktop).
Optional title bar: a strip in the accent colour with the title in Press Start 2P 10px, `bg`-coloured text, and a `✕` on the right if closable.

### Buttons (`ArcadeButton`)
They look like physical arcade buttons and **press down** when clicked.

| Variant | Look |
|---|---|
| `primary` | `pink` fill, `bg` text, 4px "base" shadow in a darker shade (`#a3104f`) below |
| `secondary` | `cyan` fill, `bg` text, base shadow `#007a85` |
| `ghost` | transparent, accent-coloured pixel border and text, no base |
| `danger/coin` | `yellow` fill, `bg` text, base `#9e8c00` (used for "INSERT COIN", resume download) |

- Label: Press Start 2P 12px (10px on phone), uppercase, letter-spacing 0.04em.
- **Min height 44px**, min width 44px (touch target). Padding 12px × 20px.
- Rest: `transform: translateY(0)`, base shadow `0 4px 0 0 <dark>` + `4px 8px 0 0 #000`.
- Hover: 1px lighter fill (brightness 1.1), optional beep.
- **Active (pressed):** `translateY(4px)`, base shadow collapses to `0 0 0 0`. Duration 60ms. Plays the `press` beep if sound is on.
- Focus: 3px `cyan` outline, offset 4px (`yellow` outline on cyan buttons). Always visible on keyboard focus (`:focus-visible`).
- Disabled: `panel-2` fill, `dim` text, no shadow, `cursor: not-allowed`.

### Stat bar (`StatBar`)
Label (Press Start 2P 10px) on the left, value on the right (VT323 24px).
Track: `panel-2`, 16px tall, pixel border. Fill is **segmented** (blocks 8px wide with 2px gaps) in the world accent.
Fills from 0 to value on first view (600ms, stepped), then stays. Reduced motion: shown full instantly.
Must also carry the number as text (`aria-valuenow`) so it's not colour-only. **Truth rule: skill values must come from Divyanshu, not invented.**

### Badge (`Badge`) for the Trophy Room
Square tile, pixel border in `yellow` (unlocked) or `dim` (locked). Inside: a pixel icon/emoji, title in Press Start 2P 10px, detail in JetBrains Mono 14px `muted`.
Unlocked badges get a subtle yellow glow. Small inline tags (`<Tag>`) use the same style at one line: neon fill, `bg` text, Press Start 2P 8–10px.

### Score counter (`ScoreCounter`)
VT323 48px, `yellow`, zero-padded (`000099`), slight yellow text-glow.
Counts up from 0 when it enters the screen (~800ms, ease-out, whole numbers only; decimals like `99.60` count on the last 2 digits).
Reduced motion: shows the final number immediately. Always readable as plain text for screen readers (`aria-label` with the real value).

### HUD bar
Top strip: `1UP DIVYANSHU · LVL 99 · ❤❤❤ · 🪙 x 15 · STAGE 1-6`. Press Start 2P 10px, solid `bg` with a 4px `pink` bottom border.
On phones it collapses to `1UP · ❤❤❤ · 🪙15` + the sound toggle.

### Blinking text (`BlinkingText`)
For `PRESS START`, cursors `▌`, `SCROLL ▼`. Hard on/off blink (`steps(1)`), 1s cycle. Reduced motion: no blink, stays visible.

### Mode select (first screen)
The very first screen a visitor sees, before the boot screen. One question and two big choices:
- Heading: "How would you like to explore?" in **JetBrains Mono bold** (26px phone / 34px desktop), not the pixel font, so it reads instantly.
  A small Press Start 2P label above it ("DIVYANSHU GARG · PORTFOLIO") is the only pixel text.
- Two large card buttons, side by side on desktop and stacked on phones: **Fun Mode** (`pink`) and **Recruiter Mode** (`cyan`).
  Each has an icon, the name (JetBrains Mono bold 26px in its accent colour), one plain sentence (17px, `text` colour) and a small "Start ▶" / "Open ▶" tag.
  They press down like arcade buttons and show a yellow focus ring on Tab.
- No CRT scanlines or animation on this screen: it must be readable in under 2 seconds.
- **Fun Mode** goes to the boot screen with all effects on. **Recruiter Mode** opens the `/cv` page (below) and is remembered, so a returning recruiter lands on `/cv` directly.

### Recruiter Mode page (`/cv`, `src/pages/RecruiterPage.tsx`)
One scrollable, printable CV page that never downloads the 3D code. Pink + cyan only, pixel font for headings,
JetBrains Mono for everything you read, numbers in resume lines highlighted in `yellow`. No CRT, sound or animation.
Linked from the mode select, the boot screen's "Recruiter mode" button and the HUD's "📄 CV" button; "Play the game" goes to `/?play`.
Print styles turn it black-on-white with contact details as plain text.
**Slow or no-3D devices** (`src/utils/deviceCheck.ts`): no WebGL → straight to `/cv`; old/slow device → an offer before the 3D loads;
a 3D crash, a 25 s load or a low frame rate → the same offer. Test with `?lite` or `?no3d`; `?3d` skips the check.
- A "◀ Change mode" button stays available afterwards.

### Hotspot "?" block
`yellow`-on-world-accent arcade block, 44×44px minimum, pixel border, gentle pulse (scale 1 → 1.06, 1.6s).
Is a real `<button>` with an `aria-label` ("Open: ICICI Bank turnaround story"). Opens an info box (a Panel) beside it; a centred modal on phones.
Close with ✕, Esc or clicking outside. Max 2–3 visible at a time.

---

## 5. CRT scanline effect (`CRTOverlay`)

One fixed, full-screen overlay on top of everything, `pointer-events: none`:

- **Scanlines:** `repeating-linear-gradient(to bottom, rgba(0,0,0,0.18) 0 1px, transparent 1px 3px)`. Opacity is the main dial: keep it **≤ 0.25** so text stays sharp.
- **Vignette / glow:** `radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.45) 100%)`.
- **Flicker:** a 0.97↔1 opacity flicker, **only on the boot screen**, for 2 seconds. Never continuous.
- **Text glow:** headings get `text-shadow: 0 0 8px <accent at 50%>`. Body text never glows.
- Never apply blur, chromatic aberration or curvature to text. The effect sits on top; it must not distort content.
- Reduced motion: the whole CRT overlay (scanlines, vignette, flicker) is off.
- The main site uses a lighter version (`<CRTOverlay soft />`: lines at 0.12, vignette 0.35); the boot screen uses the full one.
- A "CRT: on/off" option can live next to the sound toggle later (Phase 4 Recruiter Mode turns CRT off).

---

## 6. Sound

- 8-bit square-wave beeps made in code (Web Audio `OscillatorNode` type `square`, extends `src/utils/soundEffects.ts`). No audio files.
- **On when the visitor picks Fun Mode** (sound effects + the chiptune music loop); **off in Recruiter Mode**.
  Opening a world link skips the mode question, so there PRESS START counts as picking Fun Mode.
- Clear toggles in the HUD: `🔊 SOUND: ON/OFF` and `🎵 MUSIC: ON/OFF`, both remembered in `localStorage`
  (a returning visitor who turned music off keeps it off).
- Audio starts only after a user click, tap or key press (browsers require it); nothing plays before that.
- Volume low (gain ≈ 0.05–0.08). Every sound is < 250ms except the "STAGE CLEAR" jingle (< 1.2s).

| Event | Sound |
|---|---|
| `hover` (buttons, hotspots) | 1 blip, 880Hz, 30ms (optional, can be skipped on touch) |
| `press` | 2 quick notes 660→990Hz, 60ms each |
| `open` (info box) | rising 3-note arpeggio |
| `close` | falling 2 notes |
| `coin` / badge unlock | classic 988Hz → 1319Hz coin |
| `stage-clear` | short 5-note fanfare |

Sound is never the only signal: every sound accompanies a visible change.

---

## 7. Motion

- **Feel:** snappy and stepped, like old hardware. Prefer `steps()` timing and short durations (60–300ms). No floaty, bouncy, elastic easing.
- **Allowed motion:** button press, blinking, counters counting up, stat bars filling, hotspot pulse, panel "pop" in (scale 0.96→1 in 4 steps, 160ms), scroll-ride animations.
- **Scroll rides** follow the scroll position exactly, reverse when scrolling up, and never lock or hijack the page (see BUILD_GUIDE Part 2).
- Nothing auto-moves forever except: blinking cursors, the hotspot pulse, and the 3D world's idle float.
- No flashing faster than 3 times a second.

### Reduced motion (`prefers-reduced-motion: reduce`)
Every animation has an off switch. When the device asks for less motion:
- Blinking, pulsing, flicker and panel pop: **off** (things just appear).
- Counters and stat bars: show final values immediately.
- Button press: keeps the colour/shadow change, drops the movement.
- Scroll rides become simple fades between "chapters" with the same hotspots.
- 3D camera flights become instant cuts.

Implement with one global CSS block plus a `useReducedMotion()` hook for JS-driven animation:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

---

## 8. Readability rules (non-negotiable)

1. **The 2-second test:** a recruiter must be able to read any resume line in 2 seconds on a phone. If not, the style is wrong.
2. Press Start 2P is for **labels and headings only**. Anything longer than ~6 words is in JetBrains Mono.
3. Body text: ≥ 15px on phone, 16px desktop, line-height 1.6, `text` or `muted` colour, max ~65 characters per line.
4. Contrast ≥ 4.5:1 for all readable text (table in §2). `dim` and raw `purple` are never used for reading text.
5. Text sits on a solid panel, never directly on the 3D scene or a busy image.
6. Effects (scanlines, glow) never reduce text legibility; if in doubt, lower them.
7. Every interactive thing is ≥ 44×44px, works with Tab + Enter/Space, and shows a visible focus ring.
8. Information is never colour-only or sound-only (stat bars show numbers, badges show text).
9. Phone first: layouts are checked at 375px wide with a 16px side margin and no sideways scrolling.
10. **Truth rule:** every fact and number comes from the resume or from Divyanshu. No made-up stats, even in samples.

---

## 9. Tokens (for Phase 2.2)

These go into `tailwind.config.js` (`theme.extend`) and `src/index.css` (`:root` CSS variables):

```css
:root {
  --bg: #0b0b1a;  --panel: #14142b;  --panel-2: #1d1d3a;
  --text: #e8e8f5; --muted: #a0a0c0; --dim: #6b6b8f;
  --pink: #ff2e88; --cyan: #00f0ff; --yellow: #ffe600; --green: #39ff14;
  --purple: #9d4dff; --purple-text: #b57bff;
  --pink-dark: #a3104f; --cyan-dark: #007a85; --yellow-dark: #9e8c00; --green-dark: #1f8f0a;
  --px: 4px;
  --font-display: "Press Start 2P", "Courier New", monospace;
  --font-body: "JetBrains Mono", ui-monospace, Consolas, monospace;
  --font-score: "VT323", monospace;
}
```

**Where they live now (Phase 2.2 done):**
- Colours: `tailwind.config.js` → `arcade.*` (e.g. `bg-arcade-panel`, `text-arcade-pink`); same values as `--arcade-*` CSS variables in `src/index.css`.
- Fonts: `font-pixel` (Press Start 2P), `font-arcade` (JetBrains Mono), `font-score` (VT323); loaded in `index.html`.
- Animations: `animate-arcade-blink`, `animate-arcade-pulse`, `animate-arcade-pop`, `animate-arcade-flicker`.
- Shared CSS classes in `src/index.css`, all prefixed `arcade-` (panel, buttons, pixel border, badge, HUD, hotspot, CRT, accents).

## 10. Component kit (`src/components/arcade/`)

```tsx
import { ArcadeProvider, HudBar, CRTOverlay, PixelPanel, ArcadeButton } from './components/arcade';

<ArcadeProvider>            {/* required: holds sound / CRT / reduced-motion settings, adds .arcade-root */}
  <CRTOverlay />
  <HudBar player="Divyanshu" level={99} coins={15} stage="1-6" />
  <PixelPanel title="Kotak Private" accent="cyan">…</PixelPanel>
  <ArcadeButton variant="secondary">◀ Back to map</ArcadeButton>
</ArcadeProvider>
```

| Component | What it is |
|---|---|
| `ArcadeProvider`, `useArcade()`, `useReducedMotion()` | Settings: `soundOn` (on after picking Fun Mode, remembered), `crtOn`, `forceReducedMotion` (Recruiter Mode), `play(sfx)` |
| `ModeSelect` | First screen: Fun Mode / Recruiter Mode |
| `HudBar` | Top strip with lives, coins, stage and the sound toggle |
| `PixelPanel` | Panel with optional title bar and ✕ |
| `ArcadeButton` | `primary` · `secondary` · `coin` · `success` · `ghost`; pass `href` for a link; `sound` picks the beep |
| `StatBar` | Segmented bar, fills on first view |
| `ScoreCounter` | Counts up on first view; `prefix`, `suffix`, `decimals`, `pad`, `size` |
| `Badge`, `Tag` | Trophy badge (with `locked`) and small label |
| `BlinkingText` | Hard blink, still when motion is reduced |
| `Hotspot` | "?" block + info box (Esc / ✕ / click outside to close) |
| `CRTOverlay`, `SoundToggle` | Scanlines; sound switch |

Every component takes an `accent` (`pink` · `cyan` · `yellow` · `green` · `purple`) where colour applies.
The live check page is `/style-test` (temporary; delete `style-test/` and the redirect in `vite.config.ts`/`.js` when the real site is done).
