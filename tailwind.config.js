/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0f1117', 2: '#161a24', 3: '#1c2030' },
        border: { DEFAULT: '#252a3a', 2: '#2e3448' },
        accent: '#38bdf8',
      },
      fontFamily: { mono: ['Consolas', 'monospace'] },
    },
  },
  plugins: [],
}
