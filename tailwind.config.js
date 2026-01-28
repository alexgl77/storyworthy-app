/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core palette
        canvas: '#FAFAFA',
        'canvas-alt': '#F4F7F9',
        charcoal: '#2D2D2D',
        // Brand accents
        sage: {
          50: '#F2F5ED',
          100: '#E5EBD9',
          200: '#C9D5B3',
          300: '#ADC08D',
          400: '#8A9A5B',
          500: '#7A8A4E',
          600: '#6A7A42',
          glow: '#7AB87A',
        },
        clay: {
          50: '#FAF6F0',
          100: '#F0E6D6',
          200: '#E5D4BB',
          300: '#D2B48C',
          400: '#C4A270',
          500: '#B69058',
        },
        gold: {
          DEFAULT: '#C9A962',
          dim: '#A08840',
          glow: '#D4B872',
        },
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        // Semantic
        coral: {
          400: '#FB8C7E',
          500: '#F97066',
        },
        // Dark mode surfaces — near-black with subtle navy
        dark: {
          base: '#0A0A12',
          surface: '#0D0D18',
          raised: '#12121F',
          border: '#1A1A2A',
          hover: '#1E1E30',
          muted: '#2A2A3D',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'zen': '0 1px 3px rgba(0,0,0,0.03)',
        'zen-md': '0 4px 12px rgba(0,0,0,0.04)',
        'zen-lg': '0 8px 24px rgba(0,0,0,0.06)',
        'glow-sage': '0 0 8px 3px rgba(122, 184, 122, 0.5)',
        'glow-gold': '0 0 8px 3px rgba(201, 169, 98, 0.4)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      keyframes: {
        'pulse-sage': {
          '0%, 100%': { boxShadow: '0 0 4px 1px rgba(122, 184, 122, 0.4)' },
          '50%': { boxShadow: '0 0 8px 3px rgba(122, 184, 122, 0.7)' },
        },
      },
      animation: {
        'pulse-sage': 'pulse-sage 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
