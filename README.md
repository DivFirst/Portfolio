# 3D Hexagonal Archipelago Portfolio

An interactive, game-like personal portfolio website built with **React**, **Three.js / React Three Fiber**, **Vite**, and **Tailwind CSS**.

---

## 🌟 Highlights

- **6 Themed 3D Hexagonal Islands**:
  1. 🌿 **My Life**: Origins, guiding values, life milestones, and cozy cabin/memory tree diorama.
  2. 💼 **Professional**: Career journey, tech stack, and modern office skyscraper diorama.
  3. 🚀 **Projects**: Interactive software showcase, live demos, GitHub links, and rocket launchpad diorama.
  4. 🎮 **Hobby**: Music, 35mm film photography, gaming, and retro arcade diorama.
  5. 📚 **Bookstagram**: Reading goals, reviews, quotes, and reading gazebo diorama.
  6. ✈️ **Travel**: Visited countries, travel stories, mountain campsite, and orbiting paper airplane diorama.

- **Game-Like Navigation & Isometric Camera**:
  - Top-down ~60° isometric perspective with smooth camera glide transitions.
  - Hover elevation physics and glowing runic borders on hexagonal tiles.
  - Central celestial beacon connecting the archipelago.
  - Floating clouds and ambient dust motes.

- **Dual-Mode Experience**:
  - **Quick View Dossier**: Polished glassmorphism drawer for recruiters and fast browsing.
  - **Play Mini-Game**: Interactive game arena ready for custom game mechanics.

- **Native Web Audio Engine**:
  - Procedural sound synthesis (hover blips, select chimes, camera whoosh, and gentle generative lo-fi ambient background music). Zero external audio file dependencies.

- **Keyboard & Touch Ready**:
  - Number keys `1` - `6` to instantly fly to any island.
  - `Esc` key to return to world overview.
  - Drag mouse/touch to inspect from any angle.

---

## 🚀 Quick Start

### 1. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Build for Production
```bash
npm run build
```

---

## ✏️ Customizing Your Information

All your personal portfolio details live in a single, typed file:
`src/data/portfolioData.ts`

Simply edit:
- `portfolioData.profile`: Your name, avatar, bio, and social links.
- `portfolioData.life`: Your story, philosophy, and milestones.
- `portfolioData.professional`: Your work history, companies, and skills.
- `portfolioData.projects`: Your project demos, repos, and metrics.
- `portfolioData.hobby`: Your creative passions and gear.
- `portfolioData.bookstagram`: Your favorite books, ratings, and quotes.
- `portfolioData.travel`: Your passport stamps, visited cities, and memories.
