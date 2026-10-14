import React, { useState, useRef, useEffect } from 'react';
import { ThemeIcon, ChevronDownIcon } from './icons';

export const ThemeSwitcher = ({ currentTheme, onSelectTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const themes = [
    { id: 'dark', label: 'Dark' },
    { id: 'light', label: 'Light' },
    { id: 'system', label: 'System' },
  ];

  const currentLabel = themes.find(t => t.id === currentTheme)?.label || 'Dark';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-theme-surface hover:bg-theme-hover border border-theme-border text-theme-secondary hover:text-theme-text text-xs font-medium transition-colors"
        aria-label={`Theme: ${currentLabel}`}
      >
        <ThemeIcon isDark={currentTheme !== 'light'} size={15} />
        <span className="hidden sm:inline font-sans">{currentLabel}</span>
        <ChevronDownIcon size={12} className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Clean Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-32 py-1 rounded-md bg-theme-surface border border-theme-border shadow-card z-50">
          {themes.map((t) => {
            const isSelected = t.id === currentTheme;
            return (
              <button
                key={t.id}
                onClick={() => {
                  onSelectTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                  isSelected 
                    ? 'text-theme-accent font-medium bg-theme-accent-subtle' 
                    : 'text-theme-secondary hover:text-theme-text hover:bg-theme-hover'
                }`}
              >
                <span>{t.label}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-theme-accent" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
