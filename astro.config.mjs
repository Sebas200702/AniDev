import auth from 'auth-astro'
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import vercel from '@astrojs/vercel'

export default defineConfig({
  output: 'server',
  site: 'https://ani-dev.vercel.app',
  adapter: vercel(),
  integrations: [react(), sitemap(), auth()],

  vite: {
    plugins: [tailwindcss()],
  },
})
