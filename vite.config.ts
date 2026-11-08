import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Share previews and Google need full web addresses (https://…/og-image.png), so index.html
 * uses __SITE_URL__ and this fills it in at build time:
 *   1. SITE_URL, if set (e.g. SITE_URL=https://divyanshugarg.com), else
 *   2. Vercel's production address (VERCEL_PROJECT_PRODUCTION_URL, set on every Vercel build;
 *      it switches to a custom domain automatically once one is added).
 * Also writes sitemap.xml and robots.txt for Google.
 */
function siteMeta(): Plugin {
  // (read via globalThis so this file type-checks without the Node types package)
  const env = (globalThis as unknown as { process: { env: Record<string, string | undefined> } }).process.env
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL
  const site = (env.SITE_URL || (vercel ? `https://${vercel}` : '')).replace(/\/+$/, '')
  return {
    name: 'site-meta',
    transformIndexHtml(html) {
      return html.split('__SITE_URL__').join(site)
    },
    generateBundle() {
      if (!site) {
        this.warn('No site address (SITE_URL / VERCEL_PROJECT_PRODUCTION_URL): share previews use relative links and no sitemap is made. Fine for local builds.')
      }
      const robots = ['User-agent: *', 'Allow: /', ...(site ? ['', `Sitemap: ${site}/sitemap.xml`] : [])].join('\n') + '\n'
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
      if (site) {
        const urls = ['/', '/cv'].map((p) => `  <url><loc>${site}${p}</loc></url>`).join('\n')
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    siteMeta(),
  ],
  build: {
    rollupOptions: {
      output: {
        // The 3D engine gets its own files with stable names: they only change when the library
        // is upgraded, so returning visitors keep them cached across site updates.
        // (drei / three-stdlib stay with the code that uses them, so World 1's line helper
        // only downloads with World 1.)
        manualChunks(id) {
          // The small helpers every library shares go with React, so the first download never pulls in a 3D file
          if (/commonjsHelpers/.test(id)) return 'vendor-react'
          if (/node_modules[\\/]three[\\/]/.test(id)) return 'vendor-three'
          if (/node_modules[\\/](@react-three[\\/]fiber|react-reconciler|zustand|its-fine|suspend-react|react-use-measure)[\\/]/.test(id)) return 'vendor-r3f'
          // (after the 3D rules, so react-reconciler's own copy of scheduler stays with the 3D files)
          if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'vendor-react'
        },
      },
    },
  },
  server: {
    port: 3000,
    open: false
  }
})
