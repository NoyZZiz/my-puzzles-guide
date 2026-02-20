/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#020617',
          panel: '#0f172a',
          gold: '#fbbf24',
          goldDim: '#b45309',
          text: '#e2e8f0',
          border: '#1e293b',
          active: '#00dcd7',
          alert: '#ef4444',
        }
      },
      fontFamily: {
        tech: ['Rajdhani', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
