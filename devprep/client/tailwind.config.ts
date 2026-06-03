/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          800: '#0f1628',
          850: '#0d1320',
          900: '#0a0e1a',
          950: '#060912',
        },
        accent: {
          DEFAULT: '#00d4ff',
          50: 'rgba(0,212,255,0.05)',
          100: 'rgba(0,212,255,0.1)',
          200: 'rgba(0,212,255,0.2)',
          500: '#00d4ff',
        },
        violet: { 500: '#7c3aed', 400: '#8b5cf6' },
        emerald: { 500: '#10b981', 400: '#34d399' },
        amber: { 500: '#f59e0b', 400: '#fbbf24' },
        rose: { 500: '#ef4444', 400: '#f87171' },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Syne', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
