import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('calcverse_theme_preference');
      if (saved && ['dark', 'light', 'system'].includes(saved)) {
        return saved;
      }
      return 'dark'; // Dark theme default
    } catch (e) {
      return 'dark';
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState('dark');

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      let active = theme;
      if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        active = systemPrefersDark ? 'dark' : 'light';
      }

      setResolvedTheme(active);
      root.setAttribute('data-theme', active);

      if (active === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
      } else {
        root.classList.remove('light');
        root.classList.add('dark');
      }
    };

    applyTheme();

    try {
      localStorage.setItem('calcverse_theme_preference', theme);
    } catch (e) {}

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  const switchTheme = (newTheme) => {
    if (['dark', 'light', 'system'].includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  return { theme, resolvedTheme, switchTheme };
};
