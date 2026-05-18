/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cenit: {
          50: '#F4F6F8',
          100: '#E2E8F0',
          200: '#CBD5E1',
          300: '#94A3B8',
          400: '#64748B',
          500: '#475569',
          600: '#334155',
          700: '#1E293B',
          800: '#0F172A',
          900: '#020617',
          accent: '#059669',
          accentLight: '#D1FAE5',
          alert: '#F97316',
          alertLight: '#FFEDD5',
          danger: '#EF4444',
          dangerLight: '#FEE2E2',
          success: '#10B981',
          successLight: '#D1FAE5',
          info: '#3B82F6',
          infoLight: '#DBEAFE',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out both',
        'skeleton': 'skeletonShimmer 1.5s infinite linear',
        'toast-in': 'toastIn 0.35s ease-out both',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        skeletonShimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
