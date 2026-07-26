/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      colors: {
        brand: {
          cyan: '#22d3ee',
          blue: '#3b82f6',
          orange: '#f97316',
          red: '#ef4444',
        },
      },
      backgroundImage: {
        // primary CTA gradient (cyan -> blue), used on nearly every action button
        'brand-primary': 'linear-gradient(to right, #22d3ee, #3b82f6)',
        // price/accent gradient (orange -> red)
        'brand-secondary': 'linear-gradient(to right, #f97316, #ef4444)',
        // heading gradient-clip treatment (gray-800 -> gray-600)
        'brand-heading': 'linear-gradient(to right, #1f2937, #4b5563)',
      },
      boxShadow: {
        glass: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};