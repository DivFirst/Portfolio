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
    // TEMPORARY (Phase 2.1): dev-only redirect so /style-test opens the design sample page.
    {
      name: 'style-test-redirect',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if ((req as { url?: string }).url === '/style-test') {
            res.statusCode = 302
            res.setHeader('Location', '/style-test/')
            res.end()
            return
          }
          next()
        })
      },
    },
  ],
  server: {
    port: 3000,
    open: false
  }
})
