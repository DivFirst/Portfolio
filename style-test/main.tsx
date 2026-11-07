// TEMPORARY arcade design sample (BUILD_GUIDE Phase 2). Open at /style-test in dev.
// Built only from the reusable kit in src/components/arcade, so checking this page checks the kit.
// Every fact shown comes from src/data/portfolioData.ts (resume data).
import { StrictMode, useEffect, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/index.css';
import './style-test.css';
import {
  ArcadeProvider, useArcade, useReducedMotion,
  ArcadeButton, PixelPanel, StatBar, Badge, Tag, ScoreCounter, BlinkingText,
  CRTOverlay, HudBar, Hotspot, ModeSelect, type ArcadeMode,
} from '../src/components/arcade';

function Section({ num, title, children }: { num: string; title: string; children: ReactNode }) {
  return (
    <section className="st-section">
      <div className="st-section-head">
        <span className="arcade-display text-[10px] text-arcade-dim">{num}</span>
        <h2 className="arcade-display arcade-glow arcade-accent-pink text-base text-arcade-pink md:text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Toggle({ on, onClick, children }: { on?: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" className="arcade-toggle" aria-pressed={on} onClick={onClick}>{children}</button>;
}

function StyleTest() {
  const { crtOn, setCrtOn, forceReducedMotion, setForceReducedMotion } = useArcade();
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<ArcadeMode | null>(null);
  const [vt323Body, setVt323Body] = useState(false);

  useEffect(() => { document.body.classList.toggle('st-body-vt323', vt323Body); }, [vt323Body]);

  const pickMode = (m: ArcadeMode) => {
    // Recruiter Mode = same content, effects off (DESIGN.md §5 and §7).
    setCrtOn(m === 'fun');
    setForceReducedMotion(m === 'recruiter');
    setMode(m);
    window.scrollTo(0, 0);
  };

  if (!mode) return <ModeSelect onPick={pickMode} />;

  return (
    <>
      <CRTOverlay />
      <HudBar player="Divyanshu" level={99} lives={3} coins={15} coinsLabel="case competitions" stage="1-6" />

      <main className="st-page">
        <div className="st-note">
          <strong>STYLE TEST · {mode === 'fun' ? 'FUN MODE' : 'RECRUITER MODE'}:</strong> a temporary sample built from the
          arcade components in src/components/arcade. Nothing on the real site has changed.
          {mode === 'recruiter' ? ' Recruiter Mode turns the CRT effect and animations off.' : ' Use the switches below to compare options.'}
        </div>
        <div className="mt-5 flex flex-wrap gap-2.5" role="group" aria-label="Sample options">
          <Toggle onClick={() => setMode(null)}>◀ Change mode</Toggle>
          <Toggle on={crtOn} onClick={() => setCrtOn(!crtOn)}>CRT scanlines</Toggle>
          <Toggle on={vt323Body} onClick={() => setVt323Body(!vt323Body)}>Body font: VT323</Toggle>
          <Toggle on={forceReducedMotion} onClick={() => setForceReducedMotion(!forceReducedMotion)}>Reduced motion</Toggle>
        </div>

        {/* Boot screen */}
        <section className={reduced ? 'st-boot' : 'st-boot animate-arcade-flicker'}>
          <h1 className="arcade-display st-title">Divyanshu Garg<br />· The Game ·</h1>
          <p className="arcade-score mb-6 mt-2 text-2xl text-arcade-cyan">Product Manager | B2B &amp; Platform Strategist | AI Enablement</p>
          <div className="mb-7 inline-flex flex-wrap items-baseline justify-center gap-2.5">
            <span className="arcade-display text-[10px] text-arcade-pink">Hi-Score:</span>
            <ScoreCounter value={99.6} decimals={2} suffix=" %ile" />
          </div>
          <div>
            <BlinkingText className="arcade-display text-xs tracking-[0.08em] text-arcade-yellow md:text-sm">▶ Press Start</BlinkingText>
          </div>
          <div className="mt-7 flex flex-col items-center gap-7">
            <ArcadeButton>Press Start</ArcadeButton>
            <ArcadeButton variant="ghost">[ Recruiter mode: skip to CV ]</ArcadeButton>
          </div>
        </section>

        <Section num="01" title="Type">
          <div className="st-grid-2">
            <div>
              <div className="arcade-display mb-2 text-[10px] text-arcade-muted">Press Start 2P · headings &amp; HUD only</div>
              <h3 className="arcade-display arcade-glow arcade-accent-pink mb-3.5 text-base text-arcade-pink md:text-2xl">World 2: Career Mode</h3>
              <h4 className="arcade-display arcade-glow arcade-accent-cyan mb-3 text-[13px] text-arcade-cyan md:text-base">Floor 3 · Kotak Private</h4>
              <div className="arcade-display text-[10px] text-arcade-muted">Label / HUD · Stage 2-3 · Score</div>
              <div className="mt-3.5 flex flex-wrap gap-2.5">
                <Tag accent="green">Current role</Tag>
                <Tag accent="cyan">FinTech</Tag>
                <Tag>GenAI</Tag>
              </div>
            </div>
            <div>
              <div className="arcade-display mb-2 text-[10px] text-arcade-muted">
                {vt323Body ? 'VT323 · body text (compare)' : 'JetBrains Mono · body text'}
              </div>
              <p className="st-body">
                Product Manager with an engineering foundation from IIT Ropar and strategic grounding from XLRI,
                specializing in scalable enterprise FinTech and AI-assisted platform systems.
              </p>
              <p className="st-body text-arcade-muted">Muted text for dates and captions: Sr. Product Manager · Kotak Private · Current role.</p>
              <p className="st-body">Links look like this: <a href="#resume">download resume ▶</a></p>
            </div>
          </div>
        </Section>

        <Section num="02" title="Buttons">
          <p className="st-body text-arcade-muted">Click and hold: they press down like arcade buttons. Tab to see the focus ring.</p>
          <div className="mt-5 flex flex-wrap items-start gap-x-4 gap-y-5">
            {([
              ['primary', 'Next world ▶', 'Primary'],
              ['secondary', '◀ Back to map', 'Secondary'],
              ['coin', 'Insert coin', 'Coin'],
              ['ghost', 'Email me', 'Ghost'],
            ] as const).map(([variant, label, caption]) => (
              <div key={variant} className="flex flex-col items-center">
                <ArcadeButton variant={variant} sound={variant === 'coin' ? 'coin' : 'press'}>{label}</ArcadeButton>
                <span className="st-caption">{caption}</span>
              </div>
            ))}
            <div className="flex flex-col items-center">
              <ArcadeButton disabled>Locked</ArcadeButton>
              <span className="st-caption">Disabled</span>
            </div>
          </div>
        </Section>

        <Section num="03" title="Panel">
          <div className="st-grid-2">
            <PixelPanel title="Kotak Private · Sr. Product Manager" accent="cyan">
              <ul className="st-bullets arcade-accent-cyan">
                <li>
                  Cut ingestion turnaround by 95% (2 hrs to 5 mins) with 99.4% accuracy across 21 provider formats
                  by architecting a rule-based extraction engine using AI code synthesis.
                </li>
              </ul>
              <dl className="st-kv">
                <dt>Result</dt>
                <dd>Turnaround fell from 2 hours to 5 minutes, with no manual data entry.</dd>
              </dl>
            </PixelPanel>
            <PixelPanel title="ICICI Bank · Product Manager" accent="pink">
              <ul className="st-bullets arcade-accent-pink">
                <li>
                  Orchestrated a 40% increase in user interactions and a 5% CTR improvement by collaborating with
                  data science teams to deploy K-means-driven personalised content delivery.
                </li>
              </ul>
            </PixelPanel>
          </div>
        </Section>

        <Section num="04" title="Score counters">
          <p className="st-body text-arcade-muted">They count up the first time you scroll to them.</p>
          <div className="st-grid-3 mt-4">
            <ScoreCounter label="Turnaround" value={95} prefix="−" suffix="%" />
            <ScoreCounter label="Accuracy" value={99.4} decimals={1} suffix="%" />
            <ScoreCounter label="CTR" value={5} prefix="+" suffix="%" />
          </div>
          <ScoreCounter className="mt-7" label="Score" value={99} pad={6} size="lg" />
        </Section>

        <Section num="05" title="Stat bars">
          <div className="st-grid-2">
            <div>
              <StatBar label="CAT" value={99.6} display="99.60 %ile" accent="green" />
              <StatBar label="XAT · Decision Making" value={99.92} display="99.92 %ile" accent="cyan" />
            </div>
            <div>
              <StatBar label="JEE Mains" value={98.41} display="98.41 %ile" accent="yellow" />
              <StatBar label="Extraction accuracy" value={99.4} display="99.4%" accent="pink" />
            </div>
          </div>
        </Section>

        <Section num="06" title="Trophy room">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            <Badge icon="🏆" title="JEE AIR 5,515" detail="JEE Advanced, first attempt" />
            <Badge icon="⭐" title="CAT 99.60" detail="Percentile · rank 1,152" />
            <Badge icon="🧠" title="XAT DM 99.92" detail="Decision Making percentile" />
            <Badge icon="📜" title="ICSE AIR 33" detail="All-India & abroad merit rank" />
            <Badge icon="⚙️" title="CSWP" detail="SolidWorks Professional" />
            <Badge icon="🌿" title="Patent pending" detail="uBreathe Life air purifier" />
            <Badge icon="🔒" title="???" detail="Locked badge style" locked />
          </div>
        </Section>

        <Section num="07" title="Hotspot">
          <p className="st-body text-arcade-muted">The "?" block used inside each world. Click it (or Tab + Enter). Close with ✕, Esc or clicking outside.</p>
          <div className="st-hotspot-stage">
            <Hotspot label="Open: CAT preparation story" title="Boss: CAT" accent="cyan" className="absolute left-6 top-10">
              <dl className="st-kv mt-0">
                <dt>Quest</dt><dd>Preparing for CAT while working full-time at ICICI Bank.</dd>
                <dt>Loot</dt><dd>99.60 percentile (99.61 in Quant) and a seat at XLRI Delhi-NCR.</dd>
              </dl>
            </Hotspot>
          </div>
        </Section>

        <Section num="08" title="Colours">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {[
              ['bg', 'bg-arcade-bg', '#0b0b1a'], ['panel', 'bg-arcade-panel', '#14142b'], ['text', 'bg-arcade-text', '#e8e8f5'],
              ['muted', 'bg-arcade-muted', '#a0a0c0'], ['pink', 'bg-arcade-pink', '#ff2e88'], ['cyan', 'bg-arcade-cyan', '#00f0ff'],
              ['yellow', 'bg-arcade-yellow', '#ffe600'], ['green', 'bg-arcade-green', '#39ff14'], ['purple', 'bg-arcade-purple', '#9d4dff'],
              ['purple text', 'bg-arcade-purple-text', '#b57bff'], ['dim (decor)', 'bg-arcade-dim', '#6b6b8f'], ['panel-2', 'bg-arcade-panel-2', '#1d1d3a'],
            ].map(([name, cls, hex]) => (
              <div className="bg-arcade-panel p-2" key={name}>
                <div className={`mb-2 h-12 shadow-[inset_0_0_0_2px_#2a2a4a] ${cls}`} />
                <div className="arcade-display text-[8px] text-arcade-text">{name}</div>
                <div className="text-[13px] text-arcade-muted">{hex}</div>
              </div>
            ))}
          </div>
        </Section>

        <section className="st-section">
          <PixelPanel title="World 2 complete" accent="green">
            <div className="px-4 py-7 text-center">
              <p className="arcade-display arcade-glow arcade-accent-green mb-[18px] text-lg text-arcade-green md:text-[28px]">Stage clear!</p>
              <ArcadeButton variant="success" sound="stageClear">Next world ▶</ArcadeButton>
            </div>
          </PixelPanel>
        </section>
      </main>
    </>
  );
}

document.body.classList.add('arcade-page');

// Reuse the root when Vite hot-reloads this file, instead of creating a second one.
const w = window as unknown as { __styleTestRoot?: ReturnType<typeof createRoot> };
w.__styleTestRoot ??= createRoot(document.getElementById('root')!);
w.__styleTestRoot.render(
  <StrictMode>
    <ArcadeProvider>
      <StyleTest />
    </ArcadeProvider>
  </StrictMode>,
);
