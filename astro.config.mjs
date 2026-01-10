import react from '@astrojs/react'
import node from '@astrojs/node'
import sentry from '@sentry/astro'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import auth from 'auth-astro'

export default defineConfig({
  output: 'server',
  site: 'https://anidev.app',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    react(),
    auth(),
    sentry({
      project: 'anidev',
      org: 'sebas2007',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@vidstack/react'],
    },
    server: {
      fs: {
        // Modo estricto para prevenir path traversal
        strict: true,
      },
    },
  },
})
