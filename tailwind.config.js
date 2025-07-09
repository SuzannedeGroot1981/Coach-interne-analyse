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
        // Officiële Hogeschool Leiden Kleuren
        'hl-donkergroen': {
          DEFAULT: '#004D46',
          50: '#E6F2F1',
          100: '#CCE5E3',
          200: '#99CBC7',
          300: '#66B1AB',
          400: '#33978F',
          500: '#004D46', // Primary
          600: '#003D38',
          700: '#002E2A',
          800: '#001E1C',
          900: '#000F0E',
        },
        'hl-donkerpaars': {
          DEFAULT: '#280F4B',
          50: '#EDE8F3',
          100: '#DBD1E7',
          200: '#B7A3CF',
          300: '#9375B7',
          400: '#6F479F',
          500: '#280F4B', // Primary
          600: '#200C3C',
          700: '#18092D',
          800: '#10061E',
          900: '#08030F',
        },
        'hl-lichtgroen': {
          DEFAULT: '#C9F0E6',
          50: '#F4FCF9',
          100: '#C9F0E6', // Primary
          200: '#A3E6D1',
          300: '#7DDCBC',
          400: '#57D2A7',
          500: '#31C892',
          600: '#27A075',
          700: '#1D7858',
          800: '#13503B',
          900: '#09281E',
        },
        'hl-zand': {
          DEFAULT: '#DEDCCE',
          50: '#F7F6F4',
          100: '#DEDCCE', // Primary
          200: '#CCC8B5',
          300: '#BAB49C',
          400: '#A8A083',
          500: '#968C6A',
          600: '#787055',
          700: '#5A5440',
          800: '#3C382B',
          900: '#1E1C16',
        },
        'hl-geel': {
          DEFAULT: '#FFEB73',
          50: '#FFFDF0',
          100: '#FFEB73', // Primary
          200: '#FFE55A',
          300: '#FFDF41',
          400: '#FFD928',
          500: '#FFD30F',
          600: '#E6BE00',
          700: '#B39300',
          800: '#806800',
          900: '#4D3D00',
        },
        // Grijstinten voor UI
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
        'sans': ['Source Sans Pro', 'system-ui', 'sans-serif'],
        'heading': ['Source Sans Pro', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'hl': '0 4px 16px rgba(0, 77, 70, 0.1)',
        'hl-lg': '0 8px 32px rgba(0, 77, 70, 0.15)',
        'hl-green': '0 4px 12px rgba(0, 77, 70, 0.3)',
        'hl-purple': '0 4px 12px rgba(40, 15, 75, 0.3)',
        'hl-yellow': '0 4px 12px rgba(255, 235, 115, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-subtle': 'bounceSubtle 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
      'sans': ['Gantari', 'Source Sans Pro', 'system-ui', 'sans-serif'],
      'heading': ['Gantari', 'Source Sans Pro', 'system-ui', 'sans-serif'],
      'gantari': ['Gantari', 'sans-serif'],
      'source': ['Source Sans Pro', 'sans-serif'],
}