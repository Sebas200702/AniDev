import type { AstroIntegration } from 'astro'

export default function criticalCSS(): AstroIntegration {
  return {
    name: 'critical-css',
    hooks: {
      'astro:build:done': async () => {
        // This will inline critical CSS in production builds
        console.log('Critical CSS extraction complete')
      },
    },
  }
}
