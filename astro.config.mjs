// @ts-check
import { defineConfig } from 'astro/config'

import vercel from '@astrojs/vercel'

import tailwind from '@astrojs/tailwind'

import react from '@astrojs/react'

import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://animeflix.vercel.app',
  adapter: vercel(),
  integrations: [tailwind(), react(), sitemap()],
})
