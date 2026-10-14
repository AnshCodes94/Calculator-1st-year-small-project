import { useState, useEffect } from 'react';

export const THEMES = [
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Electric cyan, violet & rose on cosmic navy',
    previewColors: ['#00f2fe', '#8b5cf6', '#f43f5e', '#070a12']
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon pink, yellow & electric blue on black',
    previewColors: ['#ff007f', '#ffe600', '#00f0ff', '#040406']
  },
  {
    id: 'emerald-matrix',
    name: 'Matrix',
    description: 'Digital terminal green & emerald on onyx',
    previewColors: ['#00ff66', '#10b981', '#a7f3d0', '#020704']
  },
  {
    id: 'sunset-gold',
    name: 'Sunset',
    description: 'Solar amber, crimson & twilight purple',
    previewColors: ['#f59e0b', '#f43f5e', '#c084fc', '#11091a']
  },
  {
    id: 'clean-light',
    name: 'Clean Light',
    description: 'Soft pearl white, glass & ocean sapphire',
    previewColors: ['#0284c7', '#7c3aed', '#e11d48', '#f8fafc']
  }
];

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('calcverse_theme');
      if (saved && THEMES.some(t => t.id === saved)) return saved;
      // Default to aurora (dark)
      return 'aurora';
    } catch (e) {
      return 'aurora';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'clean-light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }

    try {
      localStorage.setItem('calcverse_theme', theme);
    } catch (e) {}
  }, [theme]);

  const switchTheme = (newThemeId) => {
    if (THEMES.some(t => t.id === newThemeId)) {
      setTheme(newThemeId);
    }
  };

  return { theme, switchTheme, themes: THEMES };
};
