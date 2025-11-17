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
            chunkSizeWarningLimit: 1000,
            rollupOptions: {
                output: {
                    manualChunks: (id) => {
                        if (id.includes('node_modules')) {
                            if (id.includes('@vidstack')) return 'vidstack';
                            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
                            if (id.includes('zustand')) return 'zustand';
                            if (id.includes('framer-motion')) return 'framer';
                            if (id.includes('@dnd-kit')) return 'dnd-kit';
                            if (id.includes('@supabase')) return 'supabase';
                            return 'vendor';
                        }
                    },
                    experimentalMinChunkSize: 20000,
                }
            },
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ['console.log', 'console.info', 'console.debug'],
                    passes: 2,
                },
                mangle: {
                    safari10: true,
                },
            },
        },
        ssr: {
            noExternal: ['@vidstack/react']
        },
        optimizeDeps: {
            exclude: ['@astrojs/react'],
        },
    },
})
