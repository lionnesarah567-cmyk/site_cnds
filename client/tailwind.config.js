/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cnds-white': '#FFFFFF',
        'cnds-offwhite': '#FAFAF8',
        'cnds-red': '#CE1126',
        'cnds-green': '#1A7F3C',
        'cnds-gold': '#B5852E',
        'cnds-ink': '#161616',
        'cnds-ink-soft': '#5A5A56',
        'cnds-line': '#E7E5DF',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['IBM Plex Sans', 'Segoe UI', '-apple-system', 'sans-serif'],
      },
      screens: {
        'xs': '560px',
        'sm': '760px',
        'md': '860px',
        'lg': '920px',
        'xl': '1200px',
      }
    },
  },
  plugins: [],
}
