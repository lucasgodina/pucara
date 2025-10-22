/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx}",
  ],
  future: {
    // Habilitar nuevas features de Tailwind
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      screens: {
        'mobile-s': '320px',  // Mobile S
        'mobile-m': '375px',  // Mobile M
        'mobile-l': '425px',  // Mobile L
        'xs': '475px',        // Celulares pequeños
        'sm': '640px',        // Celulares medianos (default)
        'md': '768px',        // Tablets (default)
        'lg': '1024px',       // Laptop pequeña (default)
        'xl': '1280px',       // Desktop (default)
        '2xl': '1536px',      // Desktop grande (default)
        '3xl': '1920px',      // TV 1080p y monitores gaming grandes
      },
      fontFamily: {
        ubuntu: ['Ubuntu', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#ea601a',
          50: '#fef7ed',
          100: '#feebd5',
          500: '#ea601a',
          600: '#d5541a',
          700: '#b44318',
          900: '#9a3412',
        },
        dark: '#000000',
        'dark-subtle': '#1a1a1a',
        light: '#FFFFFF',
      },
      boxShadow: {
        'glow': '0 0 10px rgb(234, 96, 26), 0 0 20px rgb(234, 96, 26)',
        'glow-sm': '0 0 5px rgb(234, 96, 26)',
        'glow-orange': '0 0 10px rgb(234, 96, 26)',
        'glow-xl': '0 0 25px rgb(234, 96, 26), 0 0 50px rgb(234, 96, 26)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-gaming': 'linear-gradient(135deg, #ea601a 0%, #ff8a50 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgb(234, 96, 26)' },
          '50%': { boxShadow: '0 0 25px rgb(234, 96, 26), 0 0 35px rgb(234, 96, 26)' },
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  // Optimizaciones de performance
  corePlugins: {
    // Deshabilitar plugins no utilizados para reducir tamaño del CSS
    preflight: true,
  },
  plugins: [],
}
