import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEMES } from '../hooks/useTheme';
import { ThemeIcon, ChevronDownIcon } from './icons';

export const ThemeSwitcher = ({ currentTheme, onSelectTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const activeThemeObj = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Switcher Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-theme-glass hover:bg-theme-glass-hover border border-theme-border text-theme-text text-xs font-medium transition-all shadow-sm"
        aria-label={`Switch Theme. Current: ${activeThemeObj.name}`}
      >
        {/* Swatch dots preview */}
        <div className="flex -space-x-1 items-center">
          {activeThemeObj.previewColors.slice(0, 3).map((col, idx) => (
            <span
              key={idx}
              className="w-2.5 h-2.5 rounded-full border border-black/30 shadow-xs"
              style={{ backgroundColor: col }}
            />
          ))}
        </div>
        <span className="font-mono font-semibold tracking-wide hidden sm:inline">
          {activeThemeObj.name}
        </span>
        <ChevronDownIcon size={14} className={`text-theme-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-64 p-2 rounded-2xl bg-theme-surface/95 backdrop-blur-2xl border border-theme-border shadow-2xl z-50 overflow-hidden"
          >
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-theme-muted font-bold border-b border-theme-border/50 mb-1">
              Select Theme Engine
            </div>

            <div className="flex flex-col gap-1">
              {THEMES.map((t) => {
                const isSelected = t.id === currentTheme;
                return (
                  <motion.button
                    key={t.id}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelectTheme(t.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all ${
                      isSelected 
                        ? 'bg-theme-glass-hover border border-theme-primary/30 text-theme-primary font-semibold' 
                        : 'hover:bg-theme-glass text-theme-muted hover:text-theme-text'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-theme-text flex items-center gap-1.5">
                        {t.name}
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-theme-primary shadow-glow-primary" />
                        )}
                      </div>
                      <div className="text-[10px] text-theme-subtle line-clamp-1">{t.description}</div>
                    </div>

                    {/* 4-Color Swatch Pill */}
                    <div className="flex gap-1 items-center shrink-0 pl-2">
                      {t.previewColors.map((color, cIdx) => (
                        <span
                          key={cIdx}
                          className="w-3 h-3 rounded-full border border-black/40 shadow-xs"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
