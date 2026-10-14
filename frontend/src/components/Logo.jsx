import React from 'react';

/**
 * CalcVerse Brand Identity Logo - Modern, Tastefully Colorful
 */
export const Logo = ({ 
  variant = 'full', 
  size = 'md', 
  className = '',
  onClick
}) => {
  const sizeMap = {
    xs: { icon: 22, text: 'text-sm', sub: 'text-[9px]' },
    sm: { icon: 28, text: 'text-base', sub: 'text-[10px]' },
    md: { icon: 34, text: 'text-lg', sub: 'text-xs' },
    lg: { icon: 42, text: 'text-xl', sub: 'text-xs' },
    xl: { icon: 54, text: 'text-2xl', sub: 'text-sm' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div 
      className={`inline-flex items-center gap-2.5 select-none cursor-pointer group ${className}`}
      onClick={onClick}
      role="banner"
      aria-label="CalcVerse Logo"
    >
      {/* Modern Gradient Monogram Icon */}
      <div 
        className="flex items-center justify-center shrink-0 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-[1.5px] shadow-sm transition-transform duration-200 group-hover:scale-105"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <div className="w-full h-full rounded-[7px] bg-theme-surface flex items-center justify-center text-white">
          <svg 
            viewBox="0 0 24 24" 
            width={Math.round(currentSize.icon * 0.62)} 
            height={Math.round(currentSize.icon * 0.62)} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-theme-cyan group-hover:text-theme-blue transition-colors"
          >
            <path d="M16 4a3 3 0 0 0-3 3v10a3 3 0 0 1-3 3" />
            <path d="M10 12h4" />
          </svg>
        </div>
      </div>

      {/* Wordmark */}
      {variant !== 'icon' && (
        <div className="flex flex-col text-left leading-tight">
          <div className={`font-sans font-bold tracking-tight text-theme-text ${currentSize.text}`}>
            <span>Calc</span>
            <span className="text-theme-blue">Verse</span>
          </div>
          {size !== 'xs' && (
            <span className={`font-sans text-theme-secondary font-normal tracking-wide ${currentSize.sub}`}>
              Scientific Calculator
            </span>
          )}
        </div>
      )}
    </div>
  );
};
