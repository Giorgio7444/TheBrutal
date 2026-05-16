/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js}',
  ],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: '#f1f1f1',
        secondary: '#000000',
        tertiary: '#0ADD08',
      },
      fontFamily: {
        'sans': ['Suisse Int\'l', 'sans-serif'],
        'mono': ['Suisse Int\'l Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
