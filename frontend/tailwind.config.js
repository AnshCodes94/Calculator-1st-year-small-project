/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        theme: {
          base: 'var(--bg-base)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
          'elevated-hover': 'var(--bg-elevated-hover)',
          hover: 'var(--bg-hover)',
          border: 'var(--border-color)',
          'border-subtle': 'var(--border-subtle)',
          text: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          accent: 'var(--accent)',
          'accent-hover': 'var(--accent-hover)',
          'accent-subtle': 'var(--accent-subtle)',
          error: 'var(--semantic-error)',
          'error-subtle': 'var(--semantic-error-subtle)',
          success: 'var(--semantic-success)',
          warning: 'var(--semantic-warning)',
          // Distinct Functional Palette
          blue: 'var(--color-blue)',
          indigo: 'var(--color-indigo)',
          violet: 'var(--color-violet)',
          cyan: 'var(--color-cyan)',
          emerald: 'var(--color-emerald)',
          amber: 'var(--color-amber)',
          rose: 'var(--color-rose)',
          fuchsia: 'var(--color-fuchsia)',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        elevation: 'var(--shadow-sm)',
        card: 'var(--shadow-md)',
        equals: 'var(--btn-equals-shadow)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      }
    },
  },
  plugins: [],
};
