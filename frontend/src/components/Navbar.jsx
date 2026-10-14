import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';
import { ThemeSwitcher } from './ThemeSwitcher';
import { HistoryIcon, MemoryIcon, WifiOffIcon } from './icons';

export const Navbar = ({
  angleMode,
  onToggleAngle,
  isShiftActive,
  isHypActive,
  hasMemory,
  onToggleHistory,
  historyCount,
  currentTheme,
  onSelectTheme,
  isOffline = false
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-theme-surface/70 border-b border-theme-border/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo with Animation */}
        <div className="flex items-center gap-3">
          <Logo variant="full" size="md" />
        </div>

        {/* Center / Right Control Hub */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          
          {/* Offline Warning Pill (if network drops) */}
          {isOffline && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-mono font-medium"
            >
              <WifiOffIcon size={14} className="text-red-400" />
              <span>Offline Mode</span>
            </motion.div>
          )}

          {/* Angle Mode DEG/RAD Switch */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleAngle}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider border transition-all ${
              angleMode === 'rad'
                ? 'bg-theme-primary/15 border-theme-primary text-theme-primary shadow-glow-primary'
                : 'bg-theme-secondary/15 border-theme-secondary text-theme-secondary shadow-glow-secondary'
            }`}
            title={`Angle Mode: ${angleMode.toUpperCase()}. Click to switch to ${angleMode === 'rad' ? 'DEG' : 'RAD'}.`}
            aria-label={`Toggle angle mode between degrees and radians. Current: ${angleMode.toUpperCase()}`}
          >
            {angleMode.toUpperCase()}
          </motion.button>

          {/* SHIFT Indicator Badge */}
          <span 
            className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold tracking-wider border transition-all ${
              isShiftActive
                ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'opacity-40 border-transparent text-theme-muted bg-theme-glass'
            }`}
          >
            SHIFT
          </span>

          {/* HYP Indicator Badge */}
          <span 
            className={`hidden sm:inline-block px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold tracking-wider border transition-all ${
              isHypActive
                ? 'bg-purple-500/25 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'opacity-40 border-transparent text-theme-muted bg-theme-glass'
            }`}
          >
            HYP
          </span>

          {/* MEM Indicator Badge */}
          <span 
            className={`hidden sm:inline-block px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold tracking-wider border transition-all ${
              hasMemory
                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'opacity-40 border-transparent text-theme-muted bg-theme-glass'
            }`}
          >
            M
          </span>

          {/* 5 Themes Switcher */}
          <ThemeSwitcher 
            currentTheme={currentTheme} 
            onSelectTheme={onSelectTheme} 
          />

          {/* History Drawer Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleHistory}
            className="relative p-2 rounded-xl bg-theme-glass hover:bg-theme-glass-hover border border-theme-border text-theme-text transition-all"
            title="Open History"
            aria-label="Toggle Calculation History"
          >
            <HistoryIcon size={18} />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-theme-primary text-black font-mono text-[9px] font-bold flex items-center justify-center">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </motion.button>

        </div>
      </div>
    </header>
  );
};
