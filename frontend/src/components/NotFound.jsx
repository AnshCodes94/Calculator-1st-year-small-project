import React from 'react';
import { Logo } from './Logo';

export const NotFound = ({ onReturnHome }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="card-surface max-w-md w-full p-8 flex flex-col items-center">
        <Logo variant="icon" size="md" className="mb-4" />

        <div className="font-mono font-semibold text-5xl text-theme-text mb-2">
          404
        </div>

        <h1 className="text-lg font-semibold text-theme-text mb-2">
          Mathematical Singularity Encountered
        </h1>

        <p className="text-xs text-theme-secondary mb-6 leading-relaxed">
          The requested mathematical coordinate or route lies outside the defined domain.
        </p>

        <button
          onClick={onReturnHome}
          className="px-4 py-2 rounded-md bg-theme-accent hover:bg-theme-accent-hover text-white font-medium text-xs transition-colors"
        >
          Back to Calculator
        </button>
      </div>
    </div>
  );
};
