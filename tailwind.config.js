/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#060816',
        card: '#0b1228',
        glow: '#22d3ee',
        accent: '#a78bfa',
      },
      boxShadow: {
        neon: '0 0 30px rgba(34,211,238,.15)',
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(34,211,238,.15) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
};
