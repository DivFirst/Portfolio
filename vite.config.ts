import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
