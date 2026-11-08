import { portfolioData } from '../portfolioData';
import { formatNumber, type RideHotspot, type RideMetric, type RideScreen } from './common';

// ---------- helpers that pull real content from portfolioData ----------

export const { profile, professional } = portfolioData;

export function findJob(company: string) {
  const job = professional.experiences.find((e) => e.company === company);
  if (!job) throw new Error(`worldRides: no job "${company}" in portfolioData`);
  return job;
}

/**
 * "?" block on one resume bullet: problem → what I did → result, straight from portfolioData.
 * `topic` is only the short box title (e.g. "Extraction engine"); every fact comes from the data.
 */
export function jobHotspot(company: string, highlightIndex: number, topic: string, extra: Omit<RideHotspot, 'label' | 'content'>): RideHotspot {
  const job = findJob(company);
  const h = job.highlights[highlightIndex];
  if (!h) throw new Error(`worldRides: no highlight ${highlightIndex} for ${company}`);
  const m = h.moreInfo;
  const lines = m
    ? ([m.problem && `The problem: ${m.problem}`, m.action && `What I did: ${m.action}`, m.result && `Result: ${m.result}`].filter(Boolean) as string[])
    : [h.text];
  return {
    ...extra,
    label: `Open: ${company}, ${topic}`,
    content: { title: `${company} · ${topic}`, lines },
  };
}

/**
 * Truth check for the numbers on ride screens: every number must appear in the
 * resume bullet it comes from. A typo here stops the dev build instead of going live.
 */
export function checked(source: string, metrics: RideMetric[]): RideMetric[] {
  for (const m of metrics) {
    const n = formatNumber(m, m.value);
    if (!new RegExp(`(^|[^0-9.,])${n.replace(/[.,]/g, '\\$&')}(?![0-9])`).test(source)) {
      throw new Error(`worldRides: "${m.label} ${n}" is not in the source text: ${source}`);
    }
  }
  return metrics;
}

export const bullets = (company: string, ...idx: number[]) => {
  const job = findJob(company);
  return idx.map((i) => {
    const h = job.highlights[i];
    return [h.text, h.moreInfo?.problem, h.moreInfo?.action, h.moreInfo?.result].filter(Boolean).join(' ');
  }).join(' ');
};

export function jobScreen(company: string, metrics: RideMetric[], ...idx: number[]): RideScreen {
  const job = findJob(company);
  return {
    heading: company,
    sub: [job.role, job.period, job.location?.replace(', India', '')].filter(Boolean).join(' · '),
    metrics: checked(bullets(company, ...idx), metrics),
  };
}
