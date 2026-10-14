import React from 'react';
import { Logo } from './Logo';

export const Footer = () => {
  return (
    <footer className="w-full mt-12 border-t border-theme-border py-6 px-4 sm:px-6 bg-theme-surface">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-theme-muted">
        
        {/* Logo and Subtitle */}
        <div className="flex items-center gap-2">
          <Logo variant="full" size="xs" />
        </div>

        {/* Tech Stack Info */}
        <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] text-theme-secondary">
          <span>Flask 3.0</span>
          <span>•</span>
          <span>SymPy 1.13</span>
          <span>•</span>
          <span>NumPy 2.0</span>
          <span>•</span>
          <span>React 18</span>
        </div>

        {/* Copyright */}
        <div className="text-center sm:text-right font-sans text-xs text-theme-muted">
          © 2026 CalcVerse
        </div>
      </div>
    </footer>
  );
};
