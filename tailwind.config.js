/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        calendar: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d7fd',
          300: '#a5bbfc',
          400: '#8196f8',
          500: '#6272f1',
          600: '#4a52e4',
          700: '#3b3fcc',
          800: '#3234a5',
          900: '#2d3182',
          950: '#1b1c4d',
        },
        paper: {
          50:  '#fefefe',
          100: '#fafaf8',
          200: '#f5f4f0',
          300: '#ede9e4',
          400: '#ddd8cf',
        },
      },
      boxShadow: {
        'calendar': '0 25px 60px -10px rgba(0,0,0,0.3), 0 10px 30px -5px rgba(0,0,0,0.15)',
        'calendar-dark': '0 25px 60px -10px rgba(0,0,0,0.6), 0 10px 30px -5px rgba(0,0,0,0.4)',
        'paper': '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)',
        'date-hover': '0 4px 12px rgba(98, 114, 241, 0.3)',
      },
      animation: {
        'flip-in': 'flipIn 0.4s ease-out',
        'fade-slide': 'fadeSlide 0.35s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        flipIn: {
          '0%': { transform: 'rotateX(-15deg)', opacity: '0' },
          '100%': { transform: 'rotateX(0deg)', opacity: '1' },
        },
        fadeSlide: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
