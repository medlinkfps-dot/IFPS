/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d9eb',
          300: '#95bedd',
          400: '#619ecb',
          500: '#3d81b7',
          600: '#2c679a',
          700: '#23527d',
          800: '#1b3e5f',
          900: '#0B2545',
          950: '#07182f',
        },
        medical: {
          50: '#effaf8',
          100: '#d7f3ee',
          200: '#b2e6dd',
          300: '#7fd3c6',
          400: '#46b9ab',
          500: '#299d91',
          600: '#1e7e76',
          700: '#1b645f',
          800: '#19514d',
          900: '#174341',
          950: '#092726',
        },
        iraqiGold: {
          50: '#fbf9ee',
          100: '#f5f0d4',
          200: '#ebe0aa',
          300: '#dfcc79',
          400: '#d3b74f',
          500: '#c5a059',
          600: '#ad832a',
          700: '#8b6324',
          800: '#734f24',
          900: '#614223',
          950: '#392310',
        },
      },
      fontFamily: {
        arabic: ['"IBM Plex Sans Arabic"', '"Noto Sans Arabic"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'premium': '0 10px 30px -5px rgba(11, 37, 69, 0.08), 0 5px 15px -5px rgba(11, 37, 69, 0.04)',
      },
    },
  },
  plugins: [],
}
