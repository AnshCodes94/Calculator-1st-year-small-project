import React from 'react';
import { Logo } from './Logo';

export const Footer = () => {
  return (
    <footer className="w-full mt-12 border-t border-theme-border/60 py-8 px-4 sm:px-6 bg-theme-surface/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-theme-muted">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <Logo variant="full" size="sm" animated={false} />
          <span className="opacity-40 hidden sm:inline">|</span>
          <span className="font-mono text-[11px] hidden sm:inline">
            Production Engineering Suite v2.0
          </span>
        </div>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[10px]">
          <span className="px-2 py-0.5 rounded bg-theme-glass border border-theme-border">Flask 3.0</span>
          <span className="px-2 py-0.5 rounded bg-theme-glass border border-theme-border">SymPy 1.13</span>
          <span className="px-2 py-0.5 rounded bg-theme-glass border border-theme-border">NumPy 2.0</span>
          <span className="px-2 py-0.5 rounded bg-theme-glass border border-theme-border">React 18</span>
          <span className="px-2 py-0.5 rounded bg-theme-glass border border-theme-border">Tailwind</span>
          <span className="px-2 py-0.5 rounded bg-theme-glass border border-theme-border">Framer Motion</span>
        </div>

        {/* Copyright */}
        <div className="text-center sm:text-right font-mono text-[11px]">
          © 2026 CalcVerse. All mathematical rights reserved.
        </div>
      </div>
    </footer>
  );
};
