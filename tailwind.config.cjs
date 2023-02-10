/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontSize: {
        xxs: '.635rem',
      },
      fontFamily: {
        black: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
