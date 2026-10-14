import React from 'react';
import { Logo } from './Logo';

export const SplashLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-theme-base select-none transition-opacity duration-300">
      <div className="flex flex-col items-center gap-4">
        {/* Clean Logo */}
        <Logo variant="full" size="lg" />

        {/* Minimal Progress Bar */}
        <div className="w-40 h-0.5 rounded-full bg-theme-border overflow-hidden relative mt-2">
          <div className="w-full h-full bg-theme-accent animate-pulse" />
        </div>

        <p className="font-mono text-xs text-theme-muted">
          Loading...
        </p>
      </div>
    </div>
  );
};
