/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          base: 'var(--bg-base)',
          surface: 'var(--bg-surface)',
          glass: 'var(--bg-glass)',
          'glass-hover': 'var(--bg-glass-hover)',
          border: 'var(--border-glass)',
          'border-glow': 'var(--border-glow)',
          primary: 'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
          tertiary: 'var(--accent-tertiary)',
          text: 'var(--text-main)',
          muted: 'var(--text-muted)',
          subtle: 'var(--text-subtle)',
          operator: 'var(--btn-op-bg)',
          key: 'var(--btn-num-bg)',
          'key-hover': 'var(--btn-num-hover)',
          equals: 'var(--btn-equals-bg)',
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Orbitron', 'Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px var(--glow-primary)',
        'glow-secondary': '0 0 25px var(--glow-secondary)',
        'glow-hud': '0 0 35px var(--glow-hud)',
        'glass-card': '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        'key-press': 'inset 0 3px 6px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'glow-pulse': 'glowPulse 3s infinite ease-in-out',
        'float-slow': 'floatSlow 8s infinite ease-in-out',
        'hud-scan': 'hudScan 6s linear infinite',
        'aurora-flow': 'auroraFlow 14s infinite alternate ease-in-out',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 12px var(--glow-primary))' },
          '50%': { filter: 'drop-shadow(0 0 24px var(--glow-secondary))' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        hudScan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        auroraFlow: {
          '0%': { transform: 'scale(1) translate(0%, 0%)' },
          '50%': { transform: 'scale(1.15) translate(4%, -6%)' },
          '100%': { transform: 'scale(0.95) translate(-4%, 5%)' },
        }
      }
    },
  },
  plugins: [],
};
