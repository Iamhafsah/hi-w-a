/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: { 950: '#0d2d26', 900: '#123c32', 800: '#1b5143' },
        champagne: '#d7bd83',
        ivory: '#f8f5ed',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
