/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,jsx,cjs,mjs,ts,tsx,cts,ctsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neutral: {
          50: '#F8F6F1',
          100: '#F0EEEA',
          200: '#E0DDD8',
          300: '#D0CCC6',
          400: '#B8B3AA',
          500: '#A09892',
          600: '#888077',
          700: '#706860',
          800: '#5A524E',
          900: '#464140',
          950: '#1A1A1A',
        },
      },
      fontFamily: {
        'sans': ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        'prose': '18px',
      },
      lineHeight: {
        'prose': '1.8',
      },
      maxWidth: {
        'prose': '680px',
      },
      spacing: {
        'prose-x': '2rem',
        'prose-y': '1.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
