/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Jost', 'Plus Jakarta Sans', 'Futura', 'Inter', 'system-ui', 'sans-serif'],
        levents: ['Jost', 'Futura', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      colors: {
        brand: {
          green: '#10B981',
          emerald: '#059669',
          mint: '#34D399'
        },
        primary: {
          light: '#34D399',
          DEFAULT: '#10B981',
          dark: '#059669',
          deep: '#064e3b'
        },
        lime: {
          neon: '#10B981',
          glow: '#34D399',
          electric: '#059669',
          dark: '#064e3b',
          accent: '#10B981'
        },
        cyber: {
          lime: '#10B981',
          cyan: '#34D399',
          blue: '#10B981',
          purple: '#059669',
          violet: '#047857',
          emerald: '#10B981',
          pink: '#059669',
          amber: '#F59E0B'
        },
        insure: {
          bg: '#070d09',
          card: '#0d1810',
          surface: '#122217',
          border: 'rgba(16, 185, 129, 0.15)'
        }
      },
      boxShadow: {
        'glow-lime': '0 0 20px -3px rgba(16, 185, 129, 0.3)',
        'glow-lime-sm': '0 0 10px 0 rgba(16, 185, 129, 0.2)',
        'glow-cyan': '0 0 20px -5px rgba(16, 185, 129, 0.25)',
        'glow-purple': '0 0 20px -5px rgba(16, 185, 129, 0.25)',
        'glow-card': '0 12px 36px -10px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(16, 185, 129, 0.12)',
        'glow-button': '0 0 15px -3px rgba(16, 185, 129, 0.3)'
      },
      backgroundImage: {
        'green-gradient': 'linear-gradient(135deg, #34D399 0%, #10B981 50%, #059669 100%)',
        'lime-gradient': 'linear-gradient(135deg, #34D399 0%, #10B981 50%, #059669 100%)',
        'cyber-gradient': 'linear-gradient(135deg, #34D399 0%, #10B981 60%, #059669 100%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'insure-card': 'linear-gradient(180deg, rgba(18, 34, 23, 0.7) 0%, rgba(7, 13, 9, 0.9) 100%)',
        'insure-hero': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16, 185, 129, 0.15), transparent)'
      }
    }
  },
  plugins: [],
}
