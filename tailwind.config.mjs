/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        base: '#121212',
        secondary: '#1c1c1c',
      },
    },
  },
  plugins: [],
}
