import { Fragment, useEffect, type ReactNode } from 'react';
import { portfolioData } from '../data/portfolioData';
import { achievementTrophies } from '../data/trophies';

/**
 * RECRUITER MODE (/cv): the whole CV on one fast, readable, printable page. No 3D, no sound,
 * no animation. Light arcade flavour only: pixel headings, neon accents (DESIGN.md §2, Recruiter
 * Mode uses pink + cyan). TRUTH RULE: everything here is read from portfolioData.ts / trophies.ts,
 * which come from the resume. The few hand-picked numbers below are copied from those files.
 */

const { profile, professional, projects } = portfolioData;

const DRIVE_ID = profile.resumeUrl.match(/\/d\/([^/]+)/)?.[1];
/** Direct download of the resume PDF (falls back to the Drive viewer) */
const CV_DOWNLOAD = DRIVE_ID ? `https://drive.google.com/uc?export=download&id=${DRIVE_ID}` : profile.resumeUrl;
const email = profile.socials.find((s) => s.icon === 'Mail')?.url ?? 'mailto:divgarg03@gmail.com';
const linkedin = profile.socials.find((s) => s.icon === 'Linkedin')?.url;
const github = profile.socials.find((s) => s.icon === 'Github')?.url;
const emailText = email.replace(/^mailto:/, '');

/** Headline numbers, each copied from a resume bullet in portfolioData.professional / life */
const keyNumbers = [
  { value: '~3 yrs', label: 'Product management', note: 'Wealth management & retail banking' },
  { value: '−95%', label: 'Data ingestion time', note: 'Kotak Private · 2 hrs to 5 mins' },
  { value: '99.4%', label: 'Extraction accuracy', note: 'Kotak Private · 21 provider formats' },
  { value: '−78%', label: 'Regression cycle', note: 'Kotak Private · 8 hrs to 1 hr' },
  { value: '+40%', label: 'User interactions', note: 'ICICI Bank · ML personalisation' },
  { value: '99.60', label: 'CAT percentile', note: 'Rank 1,152 of 2.88L+' },
];

/** Extra line per degree (from the life timeline in portfolioData) */
const educationNotes: Record<string, string> = {
  'IIT Ropar': 'CGPA 8.01 / 10.00 · Certified SolidWorks Professional',
  'XLRI Delhi-NCR': 'CAT 99.60 %ile · XAT Decision Making 99.92 %ile',
};

/** Competitions worth a recruiter's 2 seconds, in order; results come from the data file */
const competitionIds = ['hy-contest', 'flipkart-grid', 'airtel-icreate', 'dataviz-iimb', 'pwc-challenge', 'cadathon'];
const competitions = competitionIds
  .map((id) => projects.projects.find((p) => p.id === id))
  .filter((p): p is NonNullable<typeof p> => !!p && !!p.stats?.metric);

/** Makes the numbers in a resume line stand out: 95%, 700+, 2 hrs, USD 5M (not years like 2023). */
function withNumbers(text: string): ReactNode {
  const parts = text.split(/((?:USD\s)?\d(?:[\d,.]*\d)?(?:\+|%|M\b)?)/g);
  return parts.map((part, i) => {
    const isNumber = i % 2 === 1 && !/^(19|20)\d\d$/.test(part);
    return isNumber ? <strong key={i} className="cv-num">{part}</strong> : <Fragment key={i}>{part}</Fragment>;
  });
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="cv-section" aria-labelledby={`cv-${id}`}>
      <h2 id={`cv-${id}`} className="cv-h2 arcade-display">
        <span className="cv-h2-mark" aria-hidden="true">▶</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function RecruiterPage() {
  const from = new URLSearchParams(window.location.search).get('from');
  const no3d = from === 'no3d';

  // This page scrolls and lets visitors select text (the game page doesn't).
  useEffect(() => {
    document.title = 'CV (Recruiter Mode) · Divyanshu Garg Journey';
    document.body.classList.remove('overflow-hidden', 'select-none');
    document.body.classList.add('arcade-page');
  }, []);

  return (
    <div className="arcade-root cv-page">
      <a href="#cv-main" className="cv-skip">Skip to CV</a>

      <header className="cv-topbar cv-no-print">
        <span className="arcade-display text-[10px] text-arcade-pink">
          DG <span className="text-arcade-muted">·</span> <span className="text-arcade-cyan">Recruiter mode</span>
        </span>
        {!no3d && (
          <a href="/?play" className="arcade-btn arcade-btn-ghost cv-play" aria-label="Play my portfolio as an arcade game">
            🕹️ <span className="hidden min-[400px]:inline">Play the</span> game ▶
          </a>
        )}
      </header>

      <main id="cv-main" className="cv-wrap">
        {from && (
          <p className="cv-notice cv-no-print" role="status">
            {no3d
              ? 'This device can’t show the 3D game, so here’s the quick version of my CV.'
              : 'Here’s the fast version of my portfolio. Everything a recruiter needs is on this page.'}
          </p>
        )}

        {/* ---- Headline + photo + contact ---- */}
        <section className="cv-hero" aria-label="About">
          <div className="cv-photo arcade-accent-cyan">
            <picture>
              {profile.avatarWebpUrl && <source srcSet={profile.avatarWebpUrl} type="image/webp" />}
              <img src={profile.avatarUrl} alt={`Photo of ${profile.name}`} width={400} height={400} decoding="async" />
            </picture>
          </div>
          <div className="min-w-0">
            <p className="arcade-display text-[10px] text-arcade-pink">Player 1</p>
            <h1 className="cv-h1 arcade-display">{profile.name}</h1>
            <p className="cv-title">{profile.title}</p>
            <p className="cv-meta">📍 {profile.location} · {professional.yearsOfExperience} experience</p>
          </div>
        </section>

        <div className="cv-actions cv-no-print">
          <a href={CV_DOWNLOAD} className="arcade-btn arcade-btn-coin" download>⬇ Download CV</a>
          <a href={email} className="arcade-btn arcade-btn-secondary">✉ Email me</a>
          {linkedin && <a href={linkedin} className="arcade-btn arcade-btn-ghost" target="_blank" rel="noopener noreferrer">LinkedIn</a>}
          {github && <a href={github} className="arcade-btn arcade-btn-ghost" target="_blank" rel="noopener noreferrer">GitHub</a>}
          <button type="button" className="arcade-btn arcade-btn-ghost cv-print-btn" onClick={() => window.print()}>🖨 Print</button>
        </div>

        {/* On paper: contact details as plain text instead of buttons */}
        <p className="cv-print-only cv-print-contact">
          {emailText}{linkedin && <> · {linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</>}
          {github && <> · {github.replace(/^https?:\/\//, '')}</>}
        </p>

        <Section id="summary" title="Summary">
          <p className="cv-lead">{professional.headline}</p>
          <p className="cv-body">{professional.summary}</p>
        </Section>

        <Section id="numbers" title="Key numbers">
          <ul className="cv-stats">
            {keyNumbers.map((n) => (
              <li key={n.label} className="cv-stat">
                <span className="cv-stat-value arcade-score">{n.value}</span>
                <span className="cv-stat-label">{n.label}</span>
                <span className="cv-stat-note">{n.note}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="experience" title="Experience">
          <ol className="cv-jobs">
            {professional.experiences.map((job) => (
              <li key={job.company} className="cv-job">
                <div className="cv-job-head">
                  <h3 className="cv-job-company">{job.company}</h3>
                  <span className="cv-job-period">{job.period}</span>
                </div>
                <p className="cv-job-role">
                  {job.role}
                  <span className="cv-job-where"> · {job.type}{job.location ? ` · ${job.location}` : ''}</span>
                </p>
                <ul className="cv-bullets">
                  {job.highlights.map((h) => <li key={h.text}>{withNumbers(h.text)}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="achievements" title="Top achievements">
          <ul className="cv-awards">
            {achievementTrophies.map((t) => (
              <li key={t.id}><span aria-hidden="true">{t.icon}</span><span><strong>{t.title}</strong> · {t.detail}</span></li>
            ))}
            {competitions.map((p) => (
              <li key={p.id}><span aria-hidden="true">🏁</span><span><strong>{p.title}</strong> · {p.stats?.metric}</span></li>
            ))}
          </ul>
        </Section>

        <Section id="education" title="Education">
          <ul className="cv-edu">
            {professional.education.map((e) => (
              <li key={e.institution}>
                <div className="cv-job-head">
                  <h3 className="cv-job-company">{e.institution}</h3>
                  <span className="cv-job-period">{e.year}</span>
                </div>
                <p className="cv-job-role">{e.degree}</p>
                {educationNotes[e.institution] && <p className="cv-edu-note">{educationNotes[e.institution]}</p>}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="skills" title="Skills">
          <div className="cv-skills">
            {professional.coreCompetencies.map((group) => (
              <div key={group.category}>
                <h3 className="cv-skill-cat">{group.category}</h3>
                <ul className="cv-chips">
                  {group.skills.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <section className="cv-contact cv-no-print" aria-labelledby="cv-contact">
          <h2 id="cv-contact" className="arcade-display cv-contact-title">Continue?</h2>
          <p className="cv-body">Let’s talk. Email is the fastest way to reach me: <a href={email}>{emailText}</a></p>
          <div className="cv-actions cv-actions-center">
            <a href={email} className="arcade-btn arcade-btn-secondary">✉ Email</a>
            {linkedin && <a href={linkedin} className="arcade-btn" target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            <a href={CV_DOWNLOAD} className="arcade-btn arcade-btn-coin" download>⬇ Download CV</a>
          </div>
        </section>

        <footer className="cv-footer cv-no-print">
          {!no3d && <a href="/?play">🕹️ Prefer the fun version? Play my portfolio as an arcade game ▶</a>}
        </footer>
      </main>
    </div>
  );
}
