# 🤝 Project Handover Document: 3D Isometric Hexagonal Portfolio

> **For the incoming AI Assistant (Antigravity):**
> Welcome! This document gives you full context, architecture details, conventions, and next steps for this repository so you can immediately pick up where we left off without losing momentum.

---

## 🧭 1. Project Vision & Core Design

The project is an interactive, game-like personal portfolio website built around a **top-down (~60° tilt) isometric 3D world**.

### Core Metaphor: The Hexagonal Archipelago
The portfolio consists of **six floating 3D hexagonal islands** arranged symmetrically in an orbit around a central floating celestial nexus beacon:
1. 🌿 **My Life** (North / Top): Personal origins, values, philosophy, and life milestones.
2. 💼 **Professional** (North-East): Career history, roles, technical skills, and resume.
3. 🚀 **Projects** (South-East): Featured software products, live demos, and GitHub repositories.
4. 🎮 **Hobby** (South / Bottom): Creative pursuits (guitar/synths, 35mm film photography, indie gaming, specialty coffee).
5. 📚 **Bookstagram** (South-West): Reading goals, currently reading, reviews, and favorite quotes.
6. ✈️ **Travel** (North-West): Countries visited, expedition highlights, and travel wishlist.

### Dual-Mode Portfolio Experience
When the user clicks any island (or uses the HUD navigation dock), the camera glides smoothly to frame that island and opens an interactive slide-over drawer with two distinct modes:
- **📋 Quick View Dossier**: Polished glassmorphism overview tailored for recruiters and visitors who want to browse achievements, projects, or reading lists quickly.
- **🎮 Play Mini-Game**: An interactive game stage embedded directly into that island's modal.

---

## 🛠️ 2. Tech Stack & Key Libraries

- **Framework**: React 18 + Vite (TypeScript)
- **3D Graphics**: Three.js + React Three Fiber (`@react-three/fiber`) + Drei helpers (`@react-three/drei`)
- **Styling**: Tailwind CSS with custom gaming tokens, glassmorphism styles, and typography
- **Icons**: `lucide-react`
- **Celebrations**: `canvas-confetti`
- **Audio Engine**: Native browser **Web Audio API** procedural synthesizer (`src/utils/soundEffects.ts`) — **100% zero-dependency sound synthesis** (generates hover blips, select chimes, whooshes, and an ambient lo-fi chord pad in real-time without needing any external `.mp3` files).

---

## 📐 3. 3D Coordinate System & Layout

All islands are positioned on an isometric circle around the center `[0, 0, 0]` at radius $\approx 12.5$ units:

```
                  [1. My Life] (x: 0, z: -12.5)
                  /                          \
   [6. Travel] (x: -11, z: -6.3)              [2. Professional] (x: 11, z: -6.3)
          |                [Center Beacon]                |
   [5. Bookstagram] (x: -11, z: 6.3)          [3. Projects] (x: 11, z: 6.3)
                  \                          /
                  [4. Hobby] (x: 0, z: 12.5)
```

- **Default World Camera**: Position `[22, 26, 22]`, Target `[0, 0, 0]`, FOV `38` (~60° isometric perspective).
- **Island Focus Camera**: Position `[x + 6.5, 7.5, z + 7]`, Target `[x, 0.5, z]`.
- **Camera Controller (`CameraController` in `WorldCanvas.tsx`)**: Uses `camera.position.lerp()` and `controls.target.lerp()` in `useFrame` for buttery smooth transitions.
- **Elevation Physics**: Hovering or selecting any island raises its Y position with spring damping and intensifies the glowing runic perimeter ring.

---

## 📂 4. Complete Codebase Map

```
Portfolio/
├── index.html                           # Entry HTML with Google Fonts ("Plus Jakarta Sans" & "JetBrains Mono")
├── package.json                         # Dependencies & npm scripts
├── vite.config.ts                       # Vite server configuration (runs on port 3000)
├── tailwind.config.js                   # Custom game colors (game-gold, game-cyan, etc.) & animations
├── postcss.config.js                    # PostCSS plugins
├── tsconfig.json                        # Strict TypeScript config
├── tsconfig.node.json                   # Node config for Vite
├── README.md                            # High-level repo summary
├── HANDOVER.md                          # THIS HANDOVER DOCUMENT
└── src/
    ├── main.tsx                         # React root entry point
    ├── App.tsx                          # App shell orchestrating 3D canvas and HUD overlays
    ├── index.css                        # Glassmorphism panels, custom scrollbars, Tailwind styles
    ├── types/
    │   └── portfolio.ts                 # Full TypeScript definitions for islands, milestones, books, etc.
    ├── data/
    │   └── portfolioData.ts             # Central typed configuration file for all user data & content
    ├── utils/
    │   └── soundEffects.ts              # Web Audio procedural synthesizer (SFX + ambient music)
    ├── components/
    │   ├── canvas/
    │   │   ├── WorldCanvas.tsx          # R3F Canvas, lighting, fog, stars, camera lerper, OrbitControls
    │   │   ├── HexagonBase.tsx          # Reusable 3D hexagonal base with stone strata, turf, and hover glow
    │   │   ├── CentralBeacon.tsx        # Floating celestial nexus crystal with concentric gyro rings
    │   │   ├── FloatingClouds.tsx       # Low-poly procedural drifting sky clouds
    │   │   └── islands/                 # The 6 custom 3D low-poly themed diorama components:
    │   │       ├── MyLifeIsland.tsx     # Cozy wooden cabin, chimney smoke puffs, Memory Tree with fireflies, bench
    │   │       ├── ProfessionalIsland.tsx # Glass office skyscraper, workstation, dual monitors, server rack LEDs
    │   │       ├── ProjectsIsland.tsx   # Rocket on launchpad gantry, holographic core crystal, satellite dish
    │   │       ├── HobbyIsland.tsx      # Retro CRT arcade machine, artist's easel & canvas, acoustic guitar, camera
    │   │       ├── BookstagramIsland.tsx # Open-air gazebo, fairy lights, tall book stacks, open books
    │   │       └── TravelIsland.tsx     # Mountain campsite, A-frame tent, crackling campfire, pine trees, mini plane
    │   └── ui/
    │       ├── Navbar.tsx               # Top HUD: profile pill, sound toggle, ambient music toggle, reset view
    │       ├── IslandDock.tsx           # Bottom HUD dock: 1-6 island buttons, keyboard listeners, active pills
    │       ├── IslandDossierModal.tsx   # Slide-over glassmorphic modal with Dossier vs Game tabs
    │       ├── MiniGameStage.tsx        # Interactive mini-game arena / alpha launcher
    │       └── dossier/                 # The 6 Quick-View Dossier components:
    │           ├── MyLifeDossier.tsx    # Bio, core motto, origin story, values, milestones timeline
    │           ├── ProfessionalDossier.tsx # Experience timeline, key achievements, skills, resume link
    │           ├── ProjectsDossier.tsx  # Featured projects, live links, GitHub repos, tech badges
    │           ├── HobbyDossier.tsx     # Passions, current obsessions, gear stats, tags
    │           ├── BookstagramDossier.tsx # Reading challenge progress bar, currently reading, reviews, quotes
    │           └── TravelDossier.tsx    # Countries visited, wishlist pins, trip stories & vibes
```

---

## 🎯 5. Current Status vs Next Phase

### ✅ Phase 1: COMPLETE & VERIFIED
- [x] Full 3D isometric world setup with R3F & Drei.
- [x] All 6 hexagonal island biomes and custom 3D dioramas designed and rendered.
- [x] Smooth camera glide navigation with lerping between overview and close-ups.
- [x] Interactive hover elevation physics, glowing runic borders, and central nexus beacon.
- [x] Dual-mode slide-over drawer (Quick View Dossier + Play Mini-Game tabs).
- [x] Complete dossier layouts for all 6 islands reading from typed `portfolioData.ts`.
- [x] Procedural Web Audio API sound effects (hover, select, whoosh) + generative ambient lo-fi music.
- [x] Keyboard shortcuts (`1`-`6` for islands, `Esc` to reset view) and bottom dock.
- [x] Production build tested and verified (`npm run build` succeeds with 0 errors).
- [x] Dev server tested and running on port 3000.

### 🚀 Phase 2: NEXT UP (The Mini-Games)
During the initial design interview (`/grill-me`), the user stated:
> *"I would like to think deeper into each game separately (can take your recommendations into considerations later), first I would like to start building the pre-game things."*

The "pre-game things" are now 100% complete. The immediate next step is to **design and build the dedicated mini-games for each hexagon**.

Here are the concepts agreed upon during planning:
1. **🌿 My Life — "Memory Path Weaver"**:
   - A relaxed puzzle/journey where players connect glowing memory milestones or guide an orb along life pathways to unlock personal reflections and quotes.
2. **💼 Professional — "Sprint Commander" / "Bug Squash Sprint"**:
   - A fast-paced arcade game where bugs pop up across a simulated code/terminal canvas and the player squashes bugs, sips espresso to boost speed, and ships deploys under a sprint timer.
3. **🚀 Projects — "Pipeline Overdrive" / "Rocket Launchpad"**:
   - Route data packets through microservice nodes without overloading circuits, culminating in launching the 3D rocket into production!
4. **🎮 Hobby — "Polyphony Beats"**:
   - An interactive musical synth / rhythm keyboard or soundboard where hitting notes in rhythm unlocks creative badges and generative lofi melodies.
5. **📚 Bookstagram — "Tower of Alexandria"**:
   - A precision physics/timing book-stacking game (drop falling hardcover books to stack the tallest tower without it toppling over).
6. **✈️ Travel — "Skyborne Wayfarer"**:
   - An endless paper-glider flight game through mountain clouds, collecting golden passport stamps and dodging turbulence.

> **Where to implement**: Each game can be built as a dedicated component inside `src/components/ui/games/` and mounted inside `MiniGameStage.tsx` (or replace the placeholder when that island is selected).

---

## ⚡ 6. How to Run & Verify on the New Device

### Prerequisites
- Node.js (v18+ recommended; tested on v22.16.0)
- npm (v9+)

### Installation & Execution Commands
```bash
# 1. Navigate to the project root
cd c:\Users\divga\OneDrive\Desktop\Portfolio

# 2. Install dependencies (if node_modules is missing or not synced)
npm install
# Note: On Windows PowerShell, if scripts are restricted, run:
npm.cmd install

# 3. Start development server
npm run dev
# (or npm.cmd run dev)
# Default URL: http://localhost:3000

# 4. Run production build verification
npm run build
# (or npm.cmd run build)
```

---

## 📝 7. How the User Customizes Portfolio Content

All personal content is intentionally decoupled from 3D rendering code:
- To customize text, career history, projects, books, travel pins, or profile data, edit:
  👉 **`src/data/portfolioData.ts`**
- To tweak visual colors or accent glows for each island, update `accentColor` in `portfolioData.islands[id]`.
- All fields are strictly typed in `src/types/portfolio.ts`, so TypeScript will catch any typos immediately.

---

## 🤖 8. Quick Checklist for the Incoming Antigravity Agent

When you resume this project on the other machine:
1. Confirm the workspace directory: `c:\Users\divga\OneDrive\Desktop\Portfolio`.
2. Check if `node_modules` exists; if not, run `npm install` (or `npm.cmd install` on Windows).
3. Run `npm run build` to verify that everything compiles cleanly.
4. Start the dev server with `npm run dev` and ensure it's accessible at `http://localhost:3000`.
5. Ask the user which of the 6 mini-games they'd like to brainstorm and implement first, or if they'd like to customize their personal information in `portfolioData.ts`.
