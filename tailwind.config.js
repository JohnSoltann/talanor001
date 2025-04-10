/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/contexts/**/*.{js,ts,jsx,tsx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
    './src/utils/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          '50': '#fffceb',
          '100': '#fff3c4',
          '200': '#fde992',
          '300': '#f9e076',
          '400': '#f5cb49',
          '500': '#e6b10d',
          '600': '#ca8a0a',
          '700': '#a8680f',
          '800': '#855314',
          '900': '#713f18',
        },
        cream: {
          '50': '#fffef9',
          '100': '#fcf9e9',
          '200': '#f9f0d3',
          '300': '#f5e7b8',
          '400': '#f0d892',
          '500': '#e8c46d',
          '600': '#d5a84d',
          '700': '#b4863d',
          '800': '#8e6b37',
          '900': '#785a33',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'noise-pattern': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
      fontFamily: {
        'vazirmatn': ['Vazirmatn', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 4px 6px -1px rgba(251, 191, 36, 0.1), 0 2px 4px -1px rgba(251, 191, 36, 0.06)',
        'gold-sm': '0 1px 2px 0 rgba(249, 224, 118, 0.05)',
        'gold-md': '0 4px 6px -1px rgba(249, 224, 118, 0.1), 0 2px 4px -1px rgba(249, 224, 118, 0.06)',
        'gold-lg': '0 10px 15px -3px rgba(249, 224, 118, 0.1), 0 4px 6px -2px rgba(249, 224, 118, 0.05)',
        'gold-xl': '0 20px 25px -5px rgba(249, 224, 118, 0.1), 0 10px 10px -5px rgba(249, 224, 118, 0.04)',
        'gold-2xl': '0 25px 50px -12px rgba(249, 224, 118, 0.25)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-delay': 'float 3s ease-in-out 0.5s infinite',
        'float-delay-2': 'float 3s ease-in-out 1s infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'shine': 'shine 2s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: 0, transform: 'scale(0) rotate(0deg)' },
          '50%': { opacity: 1, transform: 'scale(1) rotate(180deg)' },
        },
        shine: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      textShadow: {
        'gold': '0 0 10px rgba(249, 224, 118, 0.5)',
        'sm': '0 1px 2px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-gold': {
          textShadow: '0 0 10px rgba(249, 224, 118, 0.5)',
        },
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
        '.gold-bar-3d': {
          background: 'linear-gradient(45deg, #FFD700, #FDB931, #FFE072)',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        '.pattern-overlay': {
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 215, 0, 0.1) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        },
        '.animated-bg': {
          background: 'linear-gradient(-45deg, #FFD700, #FDB931, #FFE072, #F5CB49)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
        },
        '.bg-clip-text': {
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
        },
        '.light-effect': {
          background: 'radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255, 215, 0, 0.15) 0%, transparent 50%)',
          transition: 'background 0.2s ease',
        },
      };
      addUtilities(newUtilities);
    },
  ],
} 