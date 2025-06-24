import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import auth from 'auth-astro'

export default defineConfig({
    output: 'server',
    site: 'https://ani-dev.vercel.app',
    adapter: vercel(),
    integrations: [react(), sitemap(), auth()],
    compressHTML: true,
    compressStaticAssets: true,
    compressPublicAssets: true,
    prefetch: {
        prefetchAll: true
    },

    vite: {
        plugins: [tailwindcss()],
    },
})
