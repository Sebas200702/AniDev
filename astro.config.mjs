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
    build: {
        inlineStylesheets: 'auto',
    },
    prefetch: {
        prefetchAll: true,
        defaultStrategy: 'viewport',
    },

    vite: {
        plugins: [tailwindcss()],
        build: {
            cssCodeSplit: true,
            rollupOptions: {
                output: {
                    manualChunks: {
                        'vidstack': ['@vidstack/react'],
                        'zustand': ['zustand'],
                    }
                }
            },
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                },
            },
        },
        ssr: {
            noExternal: ['@vidstack/react']
        }
    },
})
