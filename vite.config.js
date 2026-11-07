var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
/**
 * Share previews and Google need full web addresses (https://…/og-image.png), so index.html
 * uses __SITE_URL__ and this fills it in at build time:
 *   1. SITE_URL, if set (e.g. SITE_URL=https://divyanshugarg.com), else
 *   2. Vercel's production address (VERCEL_PROJECT_PRODUCTION_URL, set on every Vercel build;
 *      it switches to a custom domain automatically once one is added).
 * Also writes sitemap.xml and robots.txt for Google.
 */
function siteMeta() {
    // (read via globalThis so this file type-checks without the Node types package)
    var env = globalThis.process.env;
    var vercel = env.VERCEL_PROJECT_PRODUCTION_URL;
    var site = (env.SITE_URL || (vercel ? "https://".concat(vercel) : '')).replace(/\/+$/, '');
    return {
        name: 'site-meta',
        transformIndexHtml: function (html) {
            return html.split('__SITE_URL__').join(site);
        },
        generateBundle: function () {
            if (!site) {
                this.warn('No site address (SITE_URL / VERCEL_PROJECT_PRODUCTION_URL): share previews use relative links and no sitemap is made. Fine for local builds.');
            }
            var robots = __spreadArray(['User-agent: *', 'Allow: /'], (site ? ['', "Sitemap: ".concat(site, "/sitemap.xml")] : []), true).join('\n') + '\n';
            this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
            if (site) {
                var urls = ['/', '/cv'].map(function (p) { return "  <url><loc>".concat(site).concat(p, "</loc></url>"); }).join('\n');
                this.emitFile({
                    type: 'asset',
                    fileName: 'sitemap.xml',
                    source: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n".concat(urls, "\n</urlset>\n"),
                });
            }
        },
    };
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
            configureServer: function (server) {
                server.middlewares.use(function (req, res, next) {
                    if (req.url === '/style-test') {
                        res.statusCode = 302;
                        res.setHeader('Location', '/style-test/');
                        res.end();
                        return;
                    }
                    next();
                });
            },
        },
    ],
    server: {
        port: 3000,
        open: false
    }
});
