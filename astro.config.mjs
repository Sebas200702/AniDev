import react from '@astrojs/react'

import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import auth from 'auth-astro'

export default defineConfig({
  output: 'server',
  site: 'https://anidev.app',
  adapter: vercel(),
  integrations: [react(), auth()],
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
  },
})
