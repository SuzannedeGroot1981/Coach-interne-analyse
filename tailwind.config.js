/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Hogeschool Leiden Kleuren
        'hl-green': {
          50: '#E8F5E8',
          100: '#C8E6C8',
          200: '#A3D6A3',
          300: '#7EC67E',
          400: '#5BB85B',
          500: '#00A651', // Primary green
          600: '#008A44',
          700: '#006D37',
          800: '#00502A',
          900: '#00331C',
        },
        'hl-blue': {
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CCFF',
          300: '#66B3FF',
          400: '#3399FF',
          500: '#0066CC', // Primary blue
          600: '#0052A3',
          700: '#003D7A',
          800: '#002952',
          900: '#001429',
        },
        'hl-gray': {
          50: '#F9F9F9',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        // Hogeschool Leiden Lettertypen
        'sans': ['Gantari', 'system-ui', 'sans-serif'], // Default voor lopende tekst
        'heading': ['Gantari', 'system-ui', 'sans-serif'], // Voor koppen en titels
        'body': ['Gantari', 'system-ui', 'sans-serif'], // Voor body tekst
        'gantari': ['Gantari', 'system-ui', 'sans-serif'], // Expliciet Gantari
        'arial': ['Arial', 'Helvetica', 'sans-serif'], // Voor Word export
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'base': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '500' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '500' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        '5xl': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', fontWeight: '700' }],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'hl': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'hl-lg': '0 8px 24px rgba(0, 0, 0, 0.15)',
        'hl-green': '0 4px 12px rgba(0, 166, 81, 0.3)',
        'hl-blue': '0 4px 12px rgba(0, 102, 204, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}