/**
 * Google Drive share links → the addresses the site needs.
 * Works with links like https://drive.google.com/file/d/<ID>/view and
 * https://docs.google.com/presentation/d/<ID>/edit. Anything else is passed through unchanged.
 */

const DRIVE_HOST = /^https:\/\/(drive|docs)\.google\.com\//;

/** The file ID inside a Google Drive / Docs link, if there is one. */
export function driveId(url: string): string | undefined {
  if (!DRIVE_HOST.test(url)) return undefined;
  return url.match(/\/d\/([^/?#]+)/)?.[1] ?? url.match(/[?&]id=([^&#]+)/)?.[1];
}

/** Address for showing the file inside the page (an iframe), or undefined if it can't be embedded. */
export function drivePreviewUrl(url: string): string | undefined {
  const id = driveId(url);
  if (!id) return undefined;
  // Google Slides / Docs / Sheets made in Google's editors have their own preview pages
  const doc = url.match(/docs\.google\.com\/(presentation|document|spreadsheets)\//)?.[1];
  if (doc) return `https://docs.google.com/${doc}/d/${id}/preview`;
  return `https://drive.google.com/file/d/${id}/preview`;
}

/** Direct download address (falls back to the link itself). */
export function driveDownloadUrl(url: string): string {
  const id = driveId(url);
  if (!id) return url;
  const doc = url.match(/docs\.google\.com\/(presentation|document|spreadsheets)\//)?.[1];
  if (doc === 'presentation') return `https://docs.google.com/presentation/d/${id}/export/pptx`;
  if (doc === 'document') return `https://docs.google.com/document/d/${id}/export?format=pdf`;
  if (doc === 'spreadsheets') return `https://docs.google.com/spreadsheets/d/${id}/export?format=xlsx`;
  return `https://drive.google.com/uc?export=download&id=${id}`;
}
