# 🕹️ BUILD GUIDE: "DIVYANSHU: THE GAME"
### Turning the portfolio into an arcade-style website, step by step

> **How to use this guide**
> 1. Do the phases **in order**. Each phase has a few **steps**.
> 2. For each step, copy the grey **PROMPT** box into Claude Code (the desktop app, with this `Portfolio` folder open) and press Enter.
> 3. When Claude finishes, do the **✅ CHECK** for that step yourself. If something looks wrong, just tell Claude what you see in plain words ("the title is cut off on my phone").
> 4. After every step that works, paste the **💾 SAVE** prompt. That makes a checkpoint you can always go back to.
> 5. Start a **new Claude session for each phase**. Long sessions get slower and lose focus. Every prompt below tells Claude to read this guide, so a fresh session knows the plan.

---

## 📋 PART 1: Where the website stands today (audit, 22 Oct 2026)

**What the site is:** a 3D world (React + Three.js) with floating hexagon "islands". You click an island, the camera flies to it, and a side panel opens with info ("Quick View Dossier") and a placeholder mini-game. It has sound effects, keyboard shortcuts (1–5, Esc), and a profile card on the left.

**What's genuinely good (keep it):**
- The 3D world is technically solid and already feels game-like. It's a strong base for an arcade look; we don't need to throw it away.
- All the content lives in one file (`src/data/portfolioData.ts`), so changing text is easy.
- The "My Life" timeline is your **real** story and it's well written.
- Sounds are made in code (no audio files), so they're easy to turn into retro "chiptune" beeps.

**What's wrong, ranked by how much it hurts you:**

| # | Problem | Why it matters |
|---|---------|----------------|
| 1 | **Fake placeholder content.** Professional says *"Senior Software Engineer at Aether Dynamics, San Francisco"*, Projects shows *"Chronos 3D World Engine"*, Hobbies mentions film cameras and a Steam Deck, Travel lists Tokyo, Iceland, etc. None of it is from your resume. | A recruiter who opens the Professional island today sees a made-up career. **This is the #1 fix**, more important than any design work. |
| 2 | **Your photo is broken.** The Google Drive image link fails, so the card shows "DG" initials. | Your face builds trust; it should load. |
| 3 | **Travel island is missing.** Only 5 of 6 islands appear (the 3D model and panel files exist but aren't connected). | Feels unfinished. |
| 4 | **"COMING SOON" barricades** sit on 3 islands, and every mini-game is a "click the button" placeholder. Opening an island just slides in a text panel, so the island itself never "does" anything. | Reads as an unfinished site, and wastes the 3D world. (The new plan below drops the side panel and placeholder game entirely.) |
| 5 | **Phone view is broken.** On a phone the profile card covers the whole screen, the 3D world doesn't show, and the bottom menu runs off the edge. | Most recruiters first open links on their phone (LinkedIn → your site). |
| 6 | **No fast path for busy people.** Everything needs clicking around a 3D world. | A recruiter gives you ~30 seconds. They need a one-click "just show me the CV" option. |
| 7 | **Numbers don't match your resume.** The site says "4+ Yrs" and "6+ Years"; your resume says "~3 years". | Inconsistency kills credibility. |
| 8 | **Heavy and slow to load.** One 1.3 MB JavaScript file, no loading screen. | Blank screen for several seconds on mobile data. |
| 9 | **No link preview / SEO.** Tab title is "Personal Portfolio \| 3D Hexagonal World"; there's no description or preview image when the link is shared on LinkedIn/WhatsApp. | Your link looks generic when you share it. |
| 10 | **No safety net on this PC.** Git (the "save checkpoints" tool) isn't installed here, so there's no undo if a change breaks things. | Must fix before any building. |

**What I found in your info folder you can use** (`D:\Everything about me`):
- `Resume\Latest\Divyanshu Garg Resume.pdf`: the source of truth for career content (Kotak Private, ICICI Bank, Centrum Broking, XLRI, IIT Ropar, skills).
- `Case Competitions\`: 15 competitions (Airtel iCreate, DataViz @ IIM-B, Sun Pharma, PwC, Bajaj, ITC, Asian Paints, SalarySe, SwasthiQ, Flipkart, Media.net, Reckitt, Pine Labs, Thoucentric, Vivnovation). Great "boss battle" material; **you'll need to tell Claude the result of each** (the folders don't say).
- `IIT Ropar\Projects\` + `G:\Other computers\Asus Zenbook\Ubreathe\` (still on G:): engineering projects (uBreathe Life air purifier, Hydrogen refuelling station / HY Contest, Flipkart GRID robotics, micro pin-fin heat-sink research).
- `Centrum Internship\`: GenAI roadmap + Kite MCP evaluation.
- `Answers to Behavioral Questions\`: your stories in your own words; useful for the "About me" voice.
- Still on the G: drive (`G:\Other computers\Asus Zenbook\`): `Audiobooks\The Lord of The Rings`, `Planned Trips\` (Vietnam + India trips), `Song Cover\`: real hobby, book and travel hints.
- ⚠️ `Personal Documents\` has Aadhaar, passport, PAN etc. **None of that ever goes on the website.** Also keep your **phone number off** the site (email + LinkedIn are enough).

---

## 🎮 PART 2: The arcade concept (the "game design doc")

**Big idea:** your portfolio is a **retro arcade cabinet**. The visitor is "Player 1" and you are the game. We keep the 3D islands (they become the **Stage Select map**) and wrap everything in an 80s/90s arcade look: pixel fonts, neon colours, CRT scanlines, chiptune beeps, score counters.

**The flow a visitor experiences:**

1. **BOOT SCREEN (2 sec):** the screen flickers on like an old CRT TV. `DIVYANSHU GARG · THE GAME` in big pixel letters. Blinking **`PRESS START`**. Top corner: `HI-SCORE: 99.60 %ile`. A small second button: **`[ RECRUITER MODE: skip to CV ]`**.
2. **STAGE SELECT (the 3D world):** the islands, restyled with neon edges and a pixel HUD on top:
   `1UP DIVYANSHU · LVL 99 · ❤❤❤ · 🪙 x 15 (case comps) · STAGE 1-6`
3. **ENTERING A WORLD: a scroll-driven ride (no side panel, no placeholder game).**
   Clicking an island (or pressing 1–6) flies the camera in and turns the island into a **scrollable level**. **Scrolling down plays the island's own animation**, like scrubbing through a short film. Each island has its own story told with the objects already on it. Along the way, glowing **arcade "?" blocks (hotspots)** pop up on specific objects. Clicking one opens a small pixel **info box** right there (what it was, what I did, the result, a link) without leaving the scroll. A thin **level-progress bar** shows how far through the world you are, and a **`◀ BACK TO MAP`** button is always visible. At the end: **`STAGE CLEAR!`** with a **`NEXT WORLD ▶`** button.

   **The six worlds and what scrolling does in each:**

| Island (3D model already there) | Arcade name | 🎞️ What scrolling plays | ❓ Clickable hotspots |
|---|---|---|---|
| My Life (flying leather book) | **WORLD 1: ORIGIN STORY** | The book lands and opens; **scrolling turns the pages**. Each spread is a chapter, and a pixel train travels along a hand-drawn map of India through your 6 cities (Ghaziabad → Delhi → Gorakhpur → Muzaffarpur → Jamnagar → Ranchi), then on to IIT Ropar, ICICI, XLRI and Kotak. Ink "draws itself" as you scroll. | Each city pin · ICSE AIR 33 · JEE AIR 5,515 · IIT Ropar · XLRI · values · fun facts |
| Professional (glass skyscraper + monitors) | **WORLD 2: CAREER MODE** | **An elevator ride up the skyscraper.** Each floor is a job (ICICI Bank → Centrum Broking → Kotak Private penthouse). As each floor arrives the lights switch on, the monitors boot up, and **metrics count up on screen** ("TURNAROUND −95%", "ACCURACY 99.4%", "CTR +5%"). Ends on the roof with a **PLAYER STATS** board (skill bars). | Each monitor = one resume bullet → the story behind it (problem → what I did → result) · each skill bar · resume download |
| Projects (rocket launchpad + satellite dish) | **WORLD 3: BOSS BATTLES** | **Countdown and rocket launch.** Scroll = altitude. The rocket climbs through sky layers; each layer has a "boss" planet or asteroid (one per project/case competition) that flashes **DEFEATED** with a **LOOT** banner as you pass it. Ends in orbit with the satellite dish beaming "MORE COMING". | Each boss → card: the challenge, my role, the result, link (Airtel iCreate, DataViz IIM-B, Flipkart GRID, HY Contest, uBreathe Life, Kite MCP evaluation, AI extraction engine…) |
| Hobbies (CRT arcade cabinet, guitar, camera) | **WORLD 4: SIDE QUESTS** | **The camera dives into the arcade cabinet's screen** and the world becomes a 2D pixel side-scroller. Scrolling walks a little pixel-you through scenes: a badminton court (rally), a recording booth (song covers, with sound waves), a workshop (a 3D-printed gearbox spinning). | Racket · microphone · gearbox · each hobby's "current quest" |
| Books (gazebo, fairy lights, book stacks) | **WORLD 5: LORE LIBRARY** | **Fairy lights switch on one by one as you scroll** while books lift off the stacks, open and fan their pages. The LOTR moment: the scene dims and a golden ring glows. | Each book spine → rating, 2-line review, favourite quote · reading goal |
| Travel (campsite, tent, campfire, paper plane) | **WORLD 6: MAP EXPLORER** | **Ride the paper plane.** It takes off from the campfire and flies a dotted route over a stylised map; scrolling moves it from stop to stop, and **each stop slams a passport stamp** onto the screen. | Each stamp/pin → trip card (place, year, one memory, a photo) |

4. **TROPHY ROOM:** achievements as unlockable badges (JEE AIR 5,515 · CAT 99.60 %ile · XAT DM 99.92 %ile · CSWP · Patent pending · ICSE AIR 33).
5. **CONTINUE? 10… 9… 8…** The contact section is a game-over countdown screen: `INSERT COIN TO CONTINUE` → buttons for Email, LinkedIn, Resume.
6. **Easter egg:** typing the Konami code (↑↑↓↓←→←→BA) unlocks a secret (e.g. confetti + a fun fact).

**Design rules (we'll hand these to Claude in Phase 2):**
- **Fonts:** `Press Start 2P` for headings and HUD only (it's hard to read in paragraphs); `VT323` or `JetBrains Mono` for body text.
- **Colours:** near-black background `#0b0b1a`, neon accents: pink `#ff2e88`, cyan `#00f0ff`, yellow `#ffe600`, green `#39ff14`, purple `#9d4dff`. Each world keeps one accent.
- **Shapes:** chunky square pixel borders, no soft "glass" blur, no rounded pill shapes. Buttons look like arcade buttons and "press down" when clicked.
- **Effects:** subtle CRT scanlines + a slight screen glow, blinking cursors, numbers that count up. **All effects switch off** if the visitor's device asks for reduced motion.
- **Sound:** 8-bit square-wave beeps. **Muted by default**, with a clear 🔊 toggle.
- **Scroll rides:** scrolling must feel smooth and in control. The animation follows the scroll exactly (scroll back up and it plays backwards) and never "hijacks" or locks the page. Each world should take about 6–10 good scrolls to finish, and show a `SCROLL ▼` hint at the start. Works with mouse wheel, trackpad, touch swipe and arrow/space keys.
- **Hotspots:** one consistent look everywhere: a pulsing arcade "?" block in the world's accent colour, at least 44px to tap, reachable with the Tab key. Clicking opens a small pixel info box beside it (a centred pop-up on phones), closed with ✕, Esc or clicking outside. Hotspots never block reading; at most 2–3 visible at once.
- **Reduced motion:** for visitors whose device asks for less motion, the scroll rides become simple fades between "chapters", with the same hotspots.
- **Readability beats style.** If a recruiter can't read your resume line in 2 seconds, the style is wrong.
- **Truth rule:** every fact must come from the resume or from you. No made-up numbers, ever.

---

## 🧰 PART 3: Before you start (one-time setup, ~20 min)

### Install these yourself (Claude can't do these for you)

1. ✅ *Done (Git 2.55 is installed).* **Git for Windows** (your "undo/checkpoint" tool). Open the Terminal panel in the Claude app (or Windows PowerShell) and run:
   ```
   winget install --id Git.Git -e
   ```
   Then **close and reopen the Claude desktop app** so it notices Git.
2. **A GitHub account** (free) at github.com, if you don't have one. Your resume links `github.com/DivFirst`, so you may already have it. This is where your code is backed up online and how Vercel publishes it.
3. **Plugins in Claude** (I'll show install cards in chat):
   - **frontend-design** (by Anthropic): makes Claude produce distinctive, non-generic UI. Strongly recommended.
   - **Design** (by Anthropic): gives Claude "design critique" and "accessibility review" skills for the polish phase.
4. **Already connected, nothing to do:** Vercel (hosting; you already have a project called `my_life`), Figma, and the built-in browser Claude uses to look at your site.

> 💡 You do **not** need the `apple-design` skill that sits in this folder. It's for iPhone/Mac apps, not websites. You can leave it; it won't get in the way.

### How to "talk" to Claude (read once)
- **Ask for a plan first on big steps.** Prompts below say "show me the plan before changing anything". Read the plan; reply "go" or "change X first".
- **Describe what you see, not what to code.** "The text overlaps the button on my phone" is perfect.
- **If something breaks:** say *"Something broke after your last change: [describe]. Fix it, or roll back to the last checkpoint if you can't."*
- **To see the site at any time:** *"Start the site and show it to me in the browser, on desktop and on a phone-size screen."*

---

## 🚀 PART 4: The build, phase by phase

Each prompt is written so you can paste it as-is.

---

### PHASE 0: Safety net & project rules  *(1 session, ~30 min)*

**Step 0.1: Turn on checkpoints**
```
PROMPT:
I just installed Git. In this project folder (C:\Users\admin\Desktop\Portfolio\Portfolio) check that Git works and that the existing .git history is intact. Make sure node_modules, dist and .env files are ignored. Then make a first checkpoint commit called "Starting point before arcade redesign". I'm a beginner, so explain what you did in 3 short lines.
```
✅ CHECK: Claude says a commit was made.

**Step 0.2: Back it up on GitHub and link to Vercel**
```
PROMPT:
Check whether this project is connected to a GitHub repository and whether my Vercel project "my_life" deploys from it. Explain the current setup in plain English. If it's not connected to GitHub, walk me through creating a private GitHub repo and pushing this code. Tell me exactly what to click on github.com, and do the command-line parts yourself after I confirm.
```
✅ CHECK: You can see your code at github.com/<you>/<repo>. You know your live site's web address.

**Step 0.3: Give Claude permanent project rules**
```
PROMPT:
Read BUILD_GUIDE.md (especially Part 2) and HANDOVER.md. Then create a CLAUDE.md file in this project that every future session will follow. Include: what the project is, how to run it (npm run dev on port 3000), the arcade design rules from Part 2, the Truth Rule (never invent facts; only use my resume at "D:\Everything about me\Resume\Latest\Divyanshu Garg Resume.pdf" or what I tell you; never publish my phone number or anything from the Personal Documents folder), and the habit to always check changes in the browser at desktop AND phone size before saying a task is done. Keep it short. Also update HANDOVER.md so the folder paths match this computer.
```
✅ CHECK: A `CLAUDE.md` file now exists. Skim it; it should read like your rules.

💾 SAVE (use this after every step that works):
```
PROMPT:
Everything looks right. Make a checkpoint commit with a clear message describing this step, and push it to GitHub.
```

---

### PHASE 1: Truth pass (real content everywhere)  *(1–2 sessions)*
> Do this **before** any design work. A beautiful site with fake jobs is worse than a plain site with real ones.

**Step 1.1: Career + skills from the resume**
```
PROMPT:
Read BUILD_GUIDE.md Phase 1 and my latest resume at "D:\Everything about me\Resume\Latest\Divyanshu Garg Resume.pdf". In src/data/portfolioData.ts, replace ALL placeholder content in the "professional" section (Aether Dynamics, Nexus Labs, Catalyst Interactive, "Senior Software Engineer", University of California, etc.) with my real experience: Kotak Private, ICICI Bank, Centrum Broking internship, education (XLRI, IIT Ropar), and my real skills and tools. Fix any number that disagrees with the resume (for example "4+ Yrs" and "6+ Years" should match "~3 years"). Don't invent anything. If a field has no real data, list it for me instead of filling it. Show me a before/after summary.
```
✅ CHECK: Open the Professional island. Every line should be something you'd say in an interview.

**Step 1.2: The interview (Claude asks, you answer)**
Some things aren't in any file: your real hobbies, books, trips, case-comp results. Let Claude interview you.
```
PROMPT:
Read BUILD_GUIDE.md Phase 1. The hobby, bookstagram, travel and projects sections in src/data/portfolioData.ts are fake placeholders. Interview me to replace them with real content. Ask me questions in small batches (max 5 at a time), one topic at a time. Each world will have clickable "?" hotspots that open a short info box, so for every item also capture a 2–3 line "more info" story (the problem, what I did, the result, and a link or photo if I have one) and store it in the data file next to that item. Topics: (0) the story behind each bullet on my resume (Kotak, ICICI, Centrum) and the cities/milestones in my life timeline; (1) projects & case competitions: use the folder names in "D:\Everything about me\Case Competitions" and "D:\Everything about me\IIT Ropar\Projects" plus "G:\Other computers\Asus Zenbook\Ubreathe" (this one is still on the G: drive) as prompts, and ask me the result/role for each; (2) hobbies (hints: badminton captain, song covers, 3D-printed gearbox, fantasy lore); (3) books (hint: Lord of the Rings audiobooks); (4) travel (hint: Vietnam trip, trips within India). After each topic, update the data file and show me what you wrote in plain English. Never make up details. If I say "skip", remove that item instead.
```
✅ CHECK: Click through every island. Nothing should surprise you.

**Step 1.3: Photo, links and the missing Travel island**
Before this step, copy a nice photo of yourself into the project's `public` folder and name it `me.jpg` (create the `public` folder inside `Portfolio\Portfolio` if it doesn't exist). A clear, smiling head-and-shoulders photo works best.
```
PROMPT:
Read BUILD_GUIDE.md Phase 1. Three fixes: (1) My profile photo is broken because the Google Drive link doesn't load. I've put my photo at public/me.jpg; use that instead, and make sure it's compressed to a small file size. (2) The Travel island is missing: the 3D model TravelIsland.tsx exists but isn't connected, and there's no "travel" entry in portfolioData.islands. Connect the 3D island properly (don't bother wiring up TravelDossier.tsx, because the side panel is being removed in Phase 3) as island 6 with keyboard shortcut 6, and place it in the empty spot in the 3D world. (3) Check that every link works: resume, LinkedIn, GitHub, email. Tell me if any link is broken. Then show me the site in the browser.
```
✅ CHECK: Your face shows. Six islands. Pressing `6` flies to Travel. Resume opens.

💾 SAVE.

---

### PHASE 2: Arcade design system  *(1 session)*
> We decide the look once, write it down, and build a small kit of reusable arcade pieces. Every later step reuses them, so the site stays consistent.

**Step 2.1: Design document + visual sample**
```
PROMPT:
Use the frontend-design skill. Read BUILD_GUIDE.md Part 2 (the arcade concept and design rules). Write a DESIGN.md for this project describing the retro arcade style: fonts (Press Start 2P for headings/HUD only, a readable pixel or mono font for body), the neon colour palette, pixel borders, button styles, the CRT scanline effect, sounds, motion rules (respect reduced-motion), and readability rules. Then build ONE temporary sample page at /style-test that shows all the pieces together (headings, body text, buttons, a stat bar, a badge, a panel, a score counter) so I can judge the look before you apply it everywhere. Show me the sample on desktop and phone size. Don't change the real site yet.
```
✅ CHECK: Look at the sample. Ask yourself: *Does it feel like an arcade? Can I read the body text easily?* Ask for changes freely ("more pink", "the font is too small", "less glow").

**Step 2.2: Build the arcade component kit**
```
PROMPT:
I approve the look in DESIGN.md (with these changes: [write any, or "none"]). Now set it up properly: add the fonts, put the colours and styles into tailwind.config.js and index.css, and create reusable arcade components in src/components/arcade/ (for example: PixelPanel, ArcadeButton, StatBar, Badge, ScoreCounter, BlinkingText, CRTOverlay). Keep the /style-test page using these components so I can check them. Don't restyle the real site yet. Show me the result.
```
✅ CHECK: The test page still looks right and nothing on the main site broke.

💾 SAVE.

---

### PHASE 3: Make the whole site an arcade  *(2–3 sessions; one step per session is fine)*

**Step 3.1: Boot screen + "PRESS START"**
```
PROMPT:
Read BUILD_GUIDE.md Part 2 and DESIGN.md. Build the arcade boot screen that appears when someone opens the site: a quick CRT power-on flicker, "DIVYANSHU GARG" / "THE GAME" in pixel letters, a blinking "PRESS START" (works with click, tap, Enter or Space), a "HI-SCORE: 99.60 %ile" corner, and a smaller second button "RECRUITER MODE: skip to CV" (for now it can just scroll or link to the resume; we'll build Recruiter Mode later). It should also act as the loading screen: show a pixel "LOADING…" bar while the 3D world loads in the background. Remember returning visitors so they aren't forced to watch it every time. Plan first, then build, then show me desktop + phone.
```

**Step 3.2: The HUD (top bar, profile card, island menu)**
```
PROMPT:
Read DESIGN.md. Restyle the top bar (Navbar), the left profile card (HeroCard) and the bottom island menu (IslandDock) as an arcade HUD using the components in src/components/arcade. Top bar like "1UP DIVYANSHU · LVL 99 · ❤❤❤ · 🪙 x[number of case comps]" with sound and music toggles (sound muted by default). Profile card becomes a "PLAYER 1" card with my photo in a pixel frame. Island menu becomes a "STAGE SELECT" bar with names "WORLD 1: ORIGIN STORY" etc. from BUILD_GUIDE.md Part 2. On phones the profile card must start collapsed so the world is visible, and the stage menu must fit the screen without sideways scrolling. Show me desktop + phone.
```

**Step 3.3: The 3D world gets the arcade look**
```
PROMPT:
Read DESIGN.md. Make the 3D world match the arcade style without rebuilding it: neon outline glow on island edges in each world's accent colour, a darker retro sky with a pixel-style starfield or synthwave grid, and replace the "COMING SOON" barricades with arcade signs showing each world's name (e.g. "WORLD 2: CAREER MODE"). Add the CRT scanline overlay on top of everything (subtle; must not reduce readability; off when reduced motion is on). Keep performance smooth on a normal laptop. Show me.
```

**Step 3.4: Remove the side panel + build the scroll-ride engine and hotspots**
> This step builds the **shared machinery** every world will use. Phase 5 then designs each world's ride one at a time.
```
PROMPT:
Read BUILD_GUIDE.md Part 2 (step 3 "ENTERING A WORLD", the worlds table, and the Scroll rides / Hotspots / Reduced motion rules) and DESIGN.md. I'm changing the concept: remove the slide-out side panel (IslandDossierModal), all 6 dossier components and the placeholder mini-game (MiniGameStage) completely. Their content stays in src/data/portfolioData.ts and will be shown through scroll rides and hotspots instead. Build the shared system:
(1) Entering a world: clicking an island or pressing 1–6 flies the camera in and switches to "world mode", where scrolling drives that island's animation from 0% to 100% (scrolling back plays it backwards). Leaving: a "◀ BACK TO MAP" button and Esc fly back to the overview.
(2) A reusable Hotspot component (pulsing arcade "?" block in the world's accent colour) that can be pinned to a 3D object or a screen position and appear only during a chosen part of the scroll. Clicking it opens a small pixel InfoBox (title, 2–3 lines, optional image and link), a centred pop-up on phones, closed with ✕, Esc or clicking outside. Hotspot content comes from the data file.
(3) A world HUD: level-progress bar, "SCROLL ▼" hint at the start, and at 100% a "STAGE CLEAR!" banner with "NEXT WORLD ▶".
(4) Each world gets its own web address (like /#career) so I can send a recruiter straight to one world, and the browser Back button works.
(5) A simple ordered "chapters" structure per world in the data file (what's on screen + which hotspots appear) so every ride is built the same way.
Use what fits the existing React Three Fiber setup (for example drei's ScrollControls/useScroll for scroll-driven 3D, and drei's Html for hotspots on 3D objects); ask me before adding any big new library. Must work with mouse wheel, trackpad, touch and keyboard, respect reduced motion, and stay smooth. To prove it works, make a SIMPLE placeholder ride for World 2 only (camera slowly rises up the skyscraper with 3 hotspots on real resume bullets). Plan first and wait for my OK, then build, then show me on desktop and phone.
```
✅ CHECK: Click the Professional island. The side panel is gone; scrolling moves the camera; "?" blocks appear and open info boxes; Back/Esc returns to the map; a phone swipe works too.

**Step 3.5: Trophy room + "CONTINUE?" contact screen + Konami easter egg**
```
PROMPT:
Read BUILD_GUIDE.md Part 2. Add: (1) a TROPHY ROOM (a HUD button that opens a grid of unlocked achievement badges: JEE Advanced AIR 5,515, CAT 99.60 %ile, XAT Decision Making 99.92 %ile, ICSE AIR 33, CSWP certified, uBreathe patent pending, plus the case-comp wins from my data file); (2) a "CONTINUE? 10…9…" contact screen (a countdown that ends on "INSERT COIN TO CONTINUE" with big Email, LinkedIn and Resume buttons, no phone number); (3) the Konami code ↑↑↓↓←→←→BA unlocks a small celebration with a fun fact. Show me.
```

**Step 3.6: Chiptune sound pass**
```
PROMPT:
Update src/utils/soundEffects.ts so all sounds feel 8-bit: square/triangle-wave blips for hover and select, a coin sound for entering a world, a "?" block "bonk" when a hotspot opens, a short "STAGE CLEAR" fanfare at the end of each scroll ride, a "level up" jingle for the trophy room, and a short chiptune loop for the music toggle. Keep everything quiet, muted by default, and never playing before the visitor clicks something. Let me test it.
```

💾 SAVE after each step that works.

---

### PHASE 4: Recruiter Mode, phones & sharing  *(1 session)*
> This phase is what actually gets you interviews. Don't skip it.

**Step 4.1: Recruiter Mode**
```
PROMPT:
Read BUILD_GUIDE.md and DESIGN.md. Build "Recruiter Mode": a fast, simple, scrollable page (no 3D) at /cv that shows my headline, photo, summary, experience with key numbers, education, skills, top achievements and contact buttons, plus a "Download CV" button. Keep a light arcade flavour (pixel headings, neon accents) but prioritise speed and readability. It must load fast, be printable, and work perfectly on phones. Link it from the boot screen's "RECRUITER MODE" button and from the HUD. Also: if a phone is old/slow or doesn't support 3D, automatically offer Recruiter Mode instead of a broken world.
```

**Step 4.2: Phone pass**
```
PROMPT:
Test the whole site at phone size (375px wide) and tablet size. Go through: boot screen, stage select, every world's scroll ride from start to STAGE CLEAR (swiping must feel natural, and hotspot info boxes must fit the screen), trophy room, contact screen, Recruiter Mode. Fix anything that overlaps, gets cut off, is too small to tap (min 44px), or needs sideways scrolling. Show me screenshots of each screen at phone size when done.
```

**Step 4.3: Link previews + Google**
Before this step, decide what title you want people to see, e.g. *"Divyanshu Garg: Product Manager | Play my portfolio"*.
```
PROMPT:
Make my site look great when shared and findable on Google: set the page title to "[my chosen title]", add a meta description from my resume summary, add Open Graph/Twitter preview tags, and create a 1200x630 arcade-style preview image (my name, "PRESS START", my title) in public/. Add a pixel-art favicon. Also add basic structured data (Person) for Google. Tell me how I can test the LinkedIn preview after it's live.
```

💾 SAVE.

---

### PHASE 5: The six scroll rides (one world at a time)  *(1 session per world)*
> Every ride uses the engine and hotspots from Step 3.4, so each world only needs its own animation and content. **Do them in this order** (most important to a recruiter first, hardest last), and make each one great before starting the next. If you run out of energy, the unfinished worlds keep their simple ride from the engine and the site still works.

| Order | World | The ride (from Part 2) | Difficulty |
|---|---|---|---|
| 1 | **WORLD 2: CAREER MODE** | Elevator up the skyscraper; floors = ICICI → Centrum → Kotak; monitors boot and count up metrics; PLAYER STATS on the roof | ⭐⭐ |
| 2 | **WORLD 1: ORIGIN STORY** | The leather book opens; scroll turns pages; a pixel train crosses your map of India | ⭐⭐⭐ |
| 3 | **WORLD 3: BOSS BATTLES** | Rocket countdown and launch; scroll = altitude; pass and defeat a boss per project/competition | ⭐⭐ |
| 4 | **WORLD 5: LORE LIBRARY** | Fairy lights switch on; books lift and open; the LOTR ring moment | ⭐⭐ |
| 5 | **WORLD 6: MAP EXPLORER** | The paper plane flies a dotted route; passport stamps slam down at each stop | ⭐⭐ |
| 6 | **WORLD 4: SIDE QUESTS** | Dive into the arcade cabinet; a 2D pixel side-scroller through your hobbies | ⭐⭐⭐⭐ |

**Use this prompt for each world** (swap in the world's name):
```
PROMPT:
Read BUILD_GUIDE.md (Part 2: the worlds table and the Scroll rides / Hotspots rules; Phase 5) and DESIGN.md. Build the full scroll ride for [WORLD 2: CAREER MODE] using the shared scroll engine and Hotspot/InfoBox components from Step 3.4. Use the 3D objects already on that island as the stars of the show; add new 3D or pixel elements only where the story needs them, matching the island's theme and accent colour. First give me a short "storyboard": a numbered list of 5–8 scroll moments (what the visitor sees at 0%, 15%, 30%… 100%), which hotspots appear at each moment and what each one says (only real content from my data file; list anything missing instead of inventing it). Wait for my OK on the storyboard, then build it. It must feel smooth on a normal laptop and a mid-range phone, play backwards when scrolling up, and have a simple fade version for reduced motion. Show me a short walkthrough with screenshots at a few scroll positions on desktop and phone.
```
✅ CHECK (for each world):
- Scroll slowly from start to **STAGE CLEAR**. Does it feel like the island's theme, like a little film?
- Scroll back up. Does it rewind smoothly?
- Click **every** "?" block. Is each info box true, short and readable?
- On your phone: does swiping feel natural, with no stutter?
- Ask yourself: *Would a recruiter scrolling for 20 seconds learn something real about me?*

Tell Claude what felt off in plain words: "too slow", "the elevator stops too long on floor 2", "I can't read the numbers", "the ? block is covering the text".

💾 SAVE after each world.

---

### PHASE 6: Polish & quality check  *(1 session)*

**Step 6.1: Speed**
```
PROMPT:
Make the site load faster. Run a production build and tell me the size of what visitors download. Then: split the 3D code so the boot screen and Recruiter Mode appear immediately while 3D loads in the background, load each world's scroll-ride code only when someone enters that world, check that every ride stays smooth (no stutter while scrolling) on a slowed-down phone setting, compress images, and remove unused code and files. Show me the before/after sizes in plain English.
```

**Step 6.2: Accessibility + design review**
```
PROMPT:
Use the Design plugin's accessibility-review and design-critique skills on my site. Check: text contrast on the neon colours, keyboard-only navigation (Tab/Enter/Esc), screen-reader labels, reduced-motion mode turning off flicker/scanlines/shake, and that sound is never forced. Give me a short ranked list of issues, then fix the top ones.
```

**Step 6.3: Final real-world test (you do this)**
- [ ] Open the site on **your phone** with mobile data (not Wi-Fi). Does something appear within ~3 seconds?
- [ ] Send the link to **2 friends** and ask: *"What do I do for a living?"* They should answer within 30 seconds.
- [ ] Scroll through **all 6 worlds** on your phone and click every "?" block.
- [ ] Click every link (resume, LinkedIn, email).
- [ ] Read every word once. Typos? Anything not 100% true?
- [ ] Try it in Chrome **and** Safari/Edge if possible.

---

### PHASE 7: Launch 🚀  *(1 session)*

```
PROMPT:
I'm ready to launch. Push the latest version to GitHub and make sure Vercel deploys it to my production site. Check the live site works (boot screen, all 6 worlds' scroll rides and hotspots, Recruiter Mode at /cv, contact links, link preview). Give me the final web address. Then tell me step by step how I could connect a custom domain like divyanshugarg.com in Vercel. Don't buy anything; I'll do any purchase myself.
```

**After launch, you do:**
1. (Optional) Buy a domain (e.g. `divyanshugarg.com` / `.in`, roughly ₹800–1,500/yr) and connect it using Claude's instructions.
2. Update the **"Product Portfolio"** link in your resume and your **LinkedIn "Featured"** section with the new address.
3. Post a short LinkedIn update: *"I turned my portfolio into an arcade game. Press start →"*. As a PM, this shows product thinking + shipping.

---

## 🔁 Keeping it fresh later
When something changes (new job, new book, new trip):
```
PROMPT:
Read CLAUDE.md. Update my portfolio: [describe the change, e.g. "I finished reading Dune, 5 stars, favourite quote: ..."]. Only change the data file unless needed, show me the result, then commit, push and confirm the live site updated.
```

---

## 🆘 Quick help
| Situation | What to say to Claude |
|---|---|
| Something broke | "After your last change, [what you see]. Fix it, or roll back to the last checkpoint." |
| You hate a change | "Undo the last change and go back to the previous checkpoint." |
| Too technical an answer | "Explain that like I'm not a developer, in 3 lines." |
| Claude seems lost/slow | Start a **new session** and say "Read CLAUDE.md and BUILD_GUIDE.md. We're on Phase X, Step Y." |
| Want to see the site | "Start the site and show me on desktop and phone size." |
| A scroll ride feels jumpy or slow | "In [world], scrolling feels [jumpy / too slow / too fast] around [where]. Smooth it out and check it on phone size too." |
| A "?" box says something wrong | "In [world], the hotspot about [thing] is wrong. The truth is: [...]. Update the data file." |
| Not sure what's next | "Read BUILD_GUIDE.md and tell me which step I'm on based on the code and commits." |
