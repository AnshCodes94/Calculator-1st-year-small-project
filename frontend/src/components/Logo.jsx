import React from 'react';
import { motion } from 'framer-motion';

/**
 * CalcVerse Brand Identity Logo
 * Concept: Fusion of Integral (∫), Sigma (Σ), and Infinity/Orbit inside a Quantum Hexagon.
 * Variants: 'full' (icon + wordmark), 'icon' (symbol only), 'monochrome'
 */
export const Logo = ({ 
  variant = 'full', 
  size = 'md', 
  animated = true, 
  className = '',
  onClick
}) => {
  const sizeMap = {
    xs: { icon: 24, text: 'text-base' },
    sm: { icon: 32, text: 'text-xl' },
    md: { icon: 42, text: 'text-2xl' },
    lg: { icon: 54, text: 'text-3xl' },
    xl: { icon: 72, text: 'text-5xl' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const isMono = variant === 'monochrome';

  // SVG Drawing animations for paths
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1, 
      transition: { 
        duration: 1.4, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    }
  };

  const glowPulseVariants = {
    animate: {
      filter: [
        'drop-shadow(0 0 6px var(--glow-primary))',
        'drop-shadow(0 0 16px var(--glow-secondary))',
        'drop-shadow(0 0 6px var(--glow-primary))'
      ],
      transition: {
        duration: 3.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div 
      className={`inline-flex items-center gap-3 select-none cursor-pointer group ${className}`}
      onClick={onClick}
      whileHover={animated ? { scale: 1.02 } : {}}
      whileTap={animated ? { scale: 0.98 } : {}}
      role="banner"
      aria-label="CalcVerse Logo"
    >
      {/* Hand-crafted Geometric Icon Mark */}
      <motion.div 
        className="relative flex items-center justify-center shrink-0"
        style={{ width: currentSize.icon, height: currentSize.icon }}
        animate={animated ? "animate" : ""}
        variants={glowPulseVariants}
      >
        <svg 
          viewBox="0 0 120 120" 
          width={currentSize.icon} 
          height={currentSize.icon}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-500 group-hover:rotate-6"
        >
          <defs>
            <linearGradient id="logo-neon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-primary, #00f2fe)" />
              <stop offset="50%" stopColor="var(--accent-secondary, #8b5cf6)" />
              <stop offset="100%" stopColor="var(--accent-tertiary, #f43f5e)" />
            </linearGradient>
            <filter id="logo-core-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Hexagon Frame */}
          <motion.polygon 
            points="60,6 107,33 107,87 60,114 13,87 13,33" 
            stroke={isMono ? 'currentColor' : 'url(#logo-neon-grad)'} 
            strokeWidth="3" 
            strokeOpacity={isMono ? '0.8' : '0.4'}
            fill={isMono ? 'none' : 'rgba(11, 15, 25, 0.7)'}
            initial={animated ? "hidden" : false}
            animate="visible"
            variants={pathVariants}
          />

          {/* Integral Symbol Morphing into Orbit */}
          <motion.path 
            d="M 60,24 C 68,24 72,29 72,36 C 72,46 52,56 46,62 C 38,70 38,82 46,90 C 54,98 68,96 74,90" 
            stroke={isMono ? 'currentColor' : 'url(#logo-neon-grad)'} 
            strokeWidth="5.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            filter={isMono ? undefined : 'url(#logo-core-glow)'}
            initial={animated ? "hidden" : false}
            animate="visible"
            variants={pathVariants}
          />

          {/* Sigma (Σ) Geometric Cross-Branch */}
          <motion.path 
            d="M 44,32 L 76,32 L 60,54 L 76,76" 
            stroke={isMono ? 'currentColor' : 'url(#logo-neon-grad)'} 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            initial={animated ? "hidden" : false}
            animate="visible"
            variants={pathVariants}
          />

          {/* Focal Particle Node */}
          {!isMono && (
            <motion.circle 
              cx="60" 
              cy="54" 
              r="4" 
              fill="var(--accent-primary, #00f2fe)"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </svg>
      </motion.div>

      {/* Wordmark */}
      {variant !== 'icon' && (
        <div className="flex flex-col leading-none">
          <div className={`font-display font-black tracking-tight ${currentSize.text}`}>
            <span className={isMono ? 'text-current' : 'text-theme-text'}>Calc</span>
            <span className={isMono ? 'text-current opacity-75' : 'bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)] bg-clip-text text-transparent'}>
              Verse
            </span>
          </div>
          {size !== 'xs' && (
            <span className="text-[9px] font-mono tracking-widest uppercase text-theme-muted font-semibold mt-0.5">
              Quantum Math Engine
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};
