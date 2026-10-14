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
    <header className="sticky top-0 z-40 w-full bg-theme-surface border-b border-theme-border">
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
              className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-theme-error-subtle border border-theme-error/40 text-theme-error text-xs font-mono font-medium"
            >
              <WifiOffIcon size={13} className="text-theme-error" />
              <span>Offline</span>
            </div>
          )}

          {/* Angle Mode DEG/RAD Switch */}
          <button
            onClick={onToggleAngle}
            className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium border transition-colors ${
              angleMode === 'rad'
                ? 'bg-theme-elevated border-theme-border text-theme-text'
                : 'bg-theme-elevated border-theme-accent text-theme-accent'
            }`}
            title={`Angle Mode: ${angleMode.toUpperCase()}. Click to switch to ${angleMode === 'rad' ? 'DEG' : 'RAD'}.`}
            aria-label={`Toggle angle mode between degrees and radians. Current: ${angleMode.toUpperCase()}`}
          >
            {angleMode.toUpperCase()}
          </button>

          {/* SHIFT Indicator Badge */}
          <span 
            className={`px-2 py-1 rounded-md text-[11px] font-mono font-medium border transition-colors ${
              isShiftActive
                ? 'bg-theme-accent-subtle border-theme-accent text-theme-accent'
                : 'border-transparent text-theme-muted'
            }`}
          >
            SHIFT
          </span>

          {/* HYP Indicator Badge */}
          <span 
            className={`hidden sm:inline-block px-2 py-1 rounded-md text-[11px] font-mono font-medium border transition-colors ${
              isHypActive
                ? 'bg-theme-accent-subtle border-theme-accent text-theme-accent'
                : 'border-transparent text-theme-muted'
            }`}
          >
            HYP
          </span>

          {/* MEM Indicator Badge */}
          <span 
            className={`hidden sm:inline-block px-2 py-1 rounded-md text-[11px] font-mono font-medium border transition-colors ${
              hasMemory
                ? 'bg-theme-accent-subtle border-theme-accent text-theme-accent'
                : 'border-transparent text-theme-muted'
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
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-theme-accent text-white font-mono text-[8px] font-medium flex items-center justify-center">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
