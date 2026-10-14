import React from 'react';
import { Logo } from './Logo';
import { ThemeSwitcher } from './ThemeSwitcher';
import { HistoryIcon, WifiOffIcon } from './icons';

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
    <header className="sticky top-0 z-40 w-full bg-theme-surface/90 backdrop-blur-md border-b border-theme-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Logo variant="full" size="sm" />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Offline Indicator */}
          {isOffline && (
            <div 
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-medium"
            >
              <WifiOffIcon size={13} className="text-rose-400" />
              <span>Offline</span>
            </div>
          )}

          {/* Angle Mode DEG/RAD Switch */}
          <button
            onClick={onToggleAngle}
            className="px-2.5 py-1 rounded-md text-xs font-mono font-bold border transition-colors bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-400"
            title={`Angle Mode: ${angleMode.toUpperCase()}. Click to switch to ${angleMode === 'rad' ? 'DEG' : 'RAD'}.`}
            aria-label={`Toggle angle mode between degrees and radians. Current: ${angleMode.toUpperCase()}`}
          >
            {angleMode.toUpperCase()}
          </button>

          {/* SHIFT Indicator Badge */}
          <span 
            className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold border transition-colors ${
              isShiftActive
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'border-transparent text-theme-muted/50'
            }`}
          >
            SHIFT
          </span>

          {/* HYP Indicator Badge */}
          <span 
            className={`hidden sm:inline-block px-2 py-1 rounded-md text-[11px] font-mono font-bold border transition-colors ${
              isHypActive
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                : 'border-transparent text-theme-muted/50'
            }`}
          >
            HYP
          </span>

          {/* MEM Indicator Badge */}
          <span 
            className={`hidden sm:inline-block px-2 py-1 rounded-md text-[11px] font-mono font-bold border transition-colors ${
              hasMemory
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'border-transparent text-theme-muted/50'
            }`}
          >
            M
          </span>

          {/* Theme Switcher */}
          <ThemeSwitcher 
            currentTheme={currentTheme} 
            onSelectTheme={onSelectTheme} 
          />

          {/* History Drawer Toggle Button */}
          <button
            onClick={onToggleHistory}
            className="relative p-1.5 rounded-md hover:bg-theme-hover border border-theme-border text-theme-secondary hover:text-theme-text transition-colors"
            title="Open History"
            aria-label="Toggle Calculation History"
          >
            <HistoryIcon size={16} />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-500 text-white font-mono text-[8px] font-bold flex items-center justify-center">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
