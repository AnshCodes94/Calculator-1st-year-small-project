import React from 'react';
import { motion } from 'framer-motion';

// Base wrapper for consistent 24x24 1.75px rounded stroke icons
const IconBase = ({ 
  children, 
  size = 20, 
  className = '', 
  label, 
  animated = true,
  animateVariants,
  ...props 
}) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-colors ${className}`}
      role="img"
      aria-label={label}
      whileHover={animated ? { scale: 1.1, rotate: 3 } : {}}
      whileTap={animated ? { scale: 0.92 } : {}}
      {...props}
    >
      {label && <title>{label}</title>}
      {children}
    </motion.svg>
  );
};

/* 1. History Icon (Duotone Clock with Reverse Arrow) */
export const HistoryIcon = ({ size, className, label = "History", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M 3 12 A 9 9 0 1 0 5.6 6 L 3 6" opacity="0.9" />
    <polyline points="3 2 3 6 7 6" />
    <path d="M 12 7 L 12 12 L 15 15" stroke="var(--accent-primary, #00f2fe)" strokeWidth="2" />
    <circle cx="12" cy="12" r="1.5" fill="var(--accent-primary, #00f2fe)" />
  </IconBase>
);

/* 2. Memory Icon (Duotone Database / Memory Chip) */
export const MemoryIcon = ({ size, className, label = "Memory", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <rect x="4" y="4" width="16" height="16" rx="4" opacity="0.85" />
    <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="var(--accent-primary, #00f2fe)" fill="var(--accent-primary, #00f2fe)" fillOpacity="0.15" />
    <path d="M 9 1 L 9 4 M 15 1 L 15 4 M 9 20 L 9 23 M 15 20 L 15 23" />
    <path d="M 1 9 L 4 9 M 1 15 L 4 15 M 20 9 L 23 9 M 20 15 L 23 15" />
  </IconBase>
);

/* 3. Theme Sun / Moon Icon (Duotone Day/Night Switch) */
export const ThemeIcon = ({ isDark = true, size, className, label = "Toggle Theme", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    {isDark ? (
      <>
        <path d="M 21 12.79 A 9 9 0 1 1 11.21 3 A 7 7 0 0 0 21 12.79 Z" fill="var(--accent-primary, #00f2fe)" fillOpacity="0.15" />
        <circle cx="16" cy="8" r="1" fill="var(--accent-tertiary, #f43f5e)" />
      </>
    ) : (
      <>
        <circle cx="12" cy="12" r="4.5" fill="var(--accent-primary, #f59e0b)" fillOpacity="0.2" />
        <path d="M 12 2 L 12 4 M 12 20 L 12 22 M 4.93 4.93 L 6.34 6.34 M 17.66 17.66 L 19.07 19.07 M 2 12 L 4 12 M 20 12 L 22 12 M 4.93 19.07 L 6.34 17.66 M 17.66 6.34 L 19.07 4.93" stroke="var(--accent-primary, #f59e0b)" />
      </>
    )}
  </IconBase>
);

/* 4. Settings Icon (Duotone Gear) */
export const SettingsIcon = ({ size, className, label = "Settings", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <circle cx="12" cy="12" r="3" stroke="var(--accent-primary, #00f2fe)" fill="var(--accent-primary, #00f2fe)" fillOpacity="0.15" />
    <path d="M 19.4 15 a 1.65 1.65 0 0 0 .33 1.82 l .06 .06 a 2 2 0 0 1 0 2.83 2 2 0 0 1 -2.83 0 l -.06 -.06 a 1.65 1.65 0 0 0 -1.82 -.33 1.65 1.65 0 0 0 -1 1.51 V 21 a 2 2 0 0 1 -2 2 2 2 0 0 1 -2 -2 v -.09 A 1.65 1.65 0 0 0 9 19.4 a 1.65 1.65 0 0 0 -1.82 .33 l -.06 .06 a 2 2 0 0 1 -2.83 0 2 2 0 0 1 0 -2.83 l .06 -.06 a 1.65 1.65 0 0 0 .33 -1.82 1.65 1.65 0 0 0 -1.51 -1 H 3 a 2 2 0 0 1 -2 -2 2 2 0 0 1 2 -2 h .09 A 1.65 1.65 0 0 0 4.6 9 a 1.65 1.65 0 0 0 -.33 -1.82 l -.06 -.06 a 2 2 0 0 1 0 -2.83 2 2 0 0 1 2.83 0 l .06 .06 a 1.65 1.65 0 0 0 1.82 .33 H 9 a 1.65 1.65 0 0 0 1 -1.51 V 3 a 2 2 0 0 1 2 -2 2 2 0 0 1 2 2 v .09 a 1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82 -.33 l .06 -.06 a 2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83 l -.06 .06 a 1.65 1.65 0 0 0 -.33 1.82 V 9 a 1.65 1.65 0 0 0 1.51 1 H 21 a 2 2 0 0 1 2 2 2 2 0 0 1 -2 2 h -.09 a 1.65 1.65 0 0 0 -1.51 1 Z" />
  </IconBase>
);

/* 5. Graph Icon (Duotone Vector Chart) */
export const GraphIcon = ({ size, className, label = "Graph Plotter", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M 3 3 L 3 21 L 21 21" strokeOpacity="0.6" />
    <path d="M 3 15 Q 8 6, 12 14 T 21 7" stroke="var(--accent-primary, #00f2fe)" strokeWidth="2" />
    <circle cx="12" cy="14" r="2" fill="var(--accent-secondary, #8b5cf6)" />
    <circle cx="21" cy="7" r="2" fill="var(--accent-tertiary, #f43f5e)" />
  </IconBase>
);

/* 6. Matrix Icon (Duotone Grid with Brackets) */
export const MatrixIcon = ({ size, className, label = "Matrix Laboratory", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M 6 4 L 3 4 L 3 20 L 6 20 M 18 4 L 21 4 L 21 20 L 18 20" strokeWidth="2" />
    <circle cx="8" cy="8" r="1.5" fill="var(--accent-primary, #00f2fe)" />
    <circle cx="16" cy="8" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="8" cy="16" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="16" cy="16" r="1.5" fill="var(--accent-primary, #00f2fe)" />
  </IconBase>
);

/* 7. Calculus Icon (Duotone Integral ∫ dx) */
export const CalculusIcon = ({ size, className, label = "Calculus Suite", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M 14 3 C 11 3 9 5 9 8 L 9 16 C 9 19 7 21 4 21" stroke="var(--accent-primary, #00f2fe)" strokeWidth="2" />
    <path d="M 15 11 L 19 11 M 17 9 L 17 13" stroke="var(--accent-secondary, #8b5cf6)" strokeWidth="1.5" />
    <circle cx="14" cy="3" r="1.5" fill="var(--accent-primary, #00f2fe)" />
    <circle cx="4" cy="21" r="1.5" fill="var(--accent-primary, #00f2fe)" />
  </IconBase>
);

/* 8. Algebra Icon (Duotone Square Root & Variable x) */
export const AlgebraIcon = ({ size, className, label = "Algebra & Systems", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M 3 13 L 6 13 L 9 20 L 14 4 L 21 4" strokeWidth="1.75" />
    <path d="M 15 12 L 19 18 M 19 12 L 15 18" stroke="var(--accent-secondary, #8b5cf6)" strokeWidth="2" />
  </IconBase>
);

/* 9. Converter Icon (Duotone Dimension Swap Arrows) */
export const ConverterIcon = ({ size, className, label = "Unit & Base Converter", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M 4 8 L 17 8 M 13 4 L 17 8 L 13 12" stroke="var(--accent-primary, #00f2fe)" strokeWidth="2" />
    <path d="M 20 16 L 7 16 M 11 12 L 7 16 L 11 20" stroke="var(--accent-tertiary, #f43f5e)" strokeWidth="2" />
  </IconBase>
);

/* 10. Scientific Icon (Duotone Function f(x)) */
export const ScientificIcon = ({ size, className, label = "Scientific Mode", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M 6 19 C 7 15 8 7 12 5 C 13.5 4 15 4 16 5" stroke="var(--accent-primary, #00f2fe)" strokeWidth="2" />
    <line x1="5" y1="12" x2="11" y2="12" stroke="var(--accent-primary, #00f2fe)" strokeWidth="2" />
    <path d="M 16 11 L 20 17 M 20 11 L 16 17" stroke="var(--accent-secondary, #8b5cf6)" strokeWidth="1.5" />
  </IconBase>
);

/* 11. Basic Icon (Duotone Plus-Minus ±) */
export const BasicIcon = ({ size, className, label = "Basic Keypad", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <line x1="12" y1="4" x2="12" y2="12" stroke="var(--accent-primary, #00f2fe)" strokeWidth="2" />
    <line x1="8" y1="8" x2="16" y2="8" stroke="var(--accent-primary, #00f2fe)" strokeWidth="2" />
    <line x1="8" y1="16" x2="16" y2="16" stroke="var(--accent-tertiary, #f43f5e)" strokeWidth="2" />
  </IconBase>
);

/* 12. Copy Icon */
export const CopyIcon = ({ size, className, label = "Copy", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" stroke="var(--accent-primary, #00f2fe)" fill="var(--accent-primary, #00f2fe)" fillOpacity="0.1" />
    <path d="M 5 15 H 4 a 2 2 0 0 1 -2 -2 V 4 a 2 2 0 0 1 2 -2 h 9 a 2 2 0 0 1 2 2 v 1" />
  </IconBase>
);

/* 13. Delete / Backspace Icon */
export const DeleteIcon = ({ size, className, label = "Backspace", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M 21 4 H 8 L 2 12 L 8 20 H 21 A 2 2 0 0 0 23 18 V 6 A 2 2 0 0 0 21 4 Z" opacity="0.9" />
    <line x1="18" y1="9" x2="12" y2="15" stroke="var(--accent-tertiary, #f43f5e)" strokeWidth="2" />
    <line x1="12" y1="9" x2="18" y2="15" stroke="var(--accent-tertiary, #f43f5e)" strokeWidth="2" />
  </IconBase>
);

/* 14. Clear Icon (AC Trash/Broom) */
export const ClearIcon = ({ size, className, label = "Clear All", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M 19 6 L 19 19 A 2 2 0 0 1 17 21 L 7 21 A 2 2 0 0 1 5 19 L 5 6" />
    <path d="M 10 11 L 10 17 M 14 11 L 14 17" stroke="var(--accent-tertiary, #f43f5e)" strokeWidth="1.5" />
    <path d="M 9 6 V 4 A 1 1 0 0 1 10 3 H 14 A 1 1 0 0 1 15 4 V 6" />
  </IconBase>
);

/* 15. Undo Icon */
export const UndoIcon = ({ size, className, label = "Undo", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M 3 7 V 13 H 9" />
    <path d="M 3 13 A 9 9 0 0 1 18 7 A 9 9 0 0 1 21 16" stroke="var(--accent-primary, #00f2fe)" strokeWidth="2" />
  </IconBase>
);

/* 16. Warning / Error Icon (with shake animation) */
export const WarningIcon = ({ size, className, label = "Warning", ...props }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size || 20}
    height={size || 20}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`shrink-0 ${className}`}
    role="img"
    aria-label={label}
    animate={{ x: [-2, 2, -2, 2, 0] }}
    transition={{ duration: 0.45 }}
    {...props}
  >
    <path d="M 10.29 3.86 L 1.82 18 A 2 2 0 0 0 3.55 21 H 20.45 A 2 2 0 0 0 22.18 18 L 13.71 3.86 A 2 2 0 0 0 10.29 3.86 Z" stroke="var(--accent-tertiary, #f43f5e)" fill="var(--accent-tertiary, #f43f5e)" fillOpacity="0.15" />
    <line x1="12" y1="9" x2="12" y2="13" stroke="var(--accent-tertiary, #f43f5e)" strokeWidth="2" />
    <circle cx="12" cy="17" r="1" fill="var(--accent-tertiary, #f43f5e)" />
  </motion.svg>
);

/* 17. Success Check Icon (with self-drawing stroke animation) */
export const SuccessCheckIcon = ({ size, className, label = "Success", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <circle cx="12" cy="12" r="10" stroke="var(--accent-primary, #10b981)" fill="var(--accent-primary, #10b981)" fillOpacity="0.15" />
    <motion.path 
      d="M 8 12 L 11 15 L 16 9" 
      stroke="var(--accent-primary, #10b981)" 
      strokeWidth="2.2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
  </IconBase>
);

/* 18. Wifi Off / Offline Icon */
export const WifiOffIcon = ({ size, className, label = "Backend Offline", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <line x1="1" y1="1" x2="23" y2="23" stroke="var(--accent-tertiary, #f43f5e)" strokeWidth="2" />
    <path d="M 16.72 11.06 A 10.94 10.94 0 0 1 19 12.55" />
    <path d="M 5 12.55 A 10.94 10.94 0 0 1 8.5 10.5" />
    <path d="M 12 19 L 12.01 19" strokeWidth="2.5" />
  </IconBase>
);

/* 19. Download Icon */
export const DownloadIcon = ({ size, className, label = "Download", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M 21 15 V 19 A 2 2 0 0 1 19 21 H 5 A 2 2 0 0 1 3 19 V 15" />
    <polyline points="7 10 12 15 17 10" stroke="var(--accent-primary, #00f2fe)" strokeWidth="2" />
    <line x1="12" y1="15" x2="12" y2="3" stroke="var(--accent-primary, #00f2fe)" strokeWidth="2" />
  </IconBase>
);

/* 20. Share Icon */
export const ShareIcon = ({ size, className, label = "Share", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <circle cx="18" cy="5" r="3" fill="var(--accent-primary, #00f2fe)" fillOpacity="0.2" />
    <circle cx="6" cy="12" r="3" fill="var(--accent-secondary, #8b5cf6)" fillOpacity="0.2" />
    <circle cx="18" cy="19" r="3" fill="var(--accent-tertiary, #f43f5e)" fillOpacity="0.2" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </IconBase>
);

/* 21. Info Icon */
export const InfoIcon = ({ size, className, label = "Info", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <circle cx="12" cy="12" r="10" strokeOpacity="0.8" />
    <line x1="12" y1="16" x2="12" y2="12" stroke="var(--accent-primary, #00f2fe)" strokeWidth="2" />
    <circle cx="12" cy="8" r="0.75" fill="var(--accent-primary, #00f2fe)" />
  </IconBase>
);

/* 22. Close Icon */
export const CloseIcon = ({ size, className, label = "Close", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <line x1="18" y1="6" x2="6" y2="18" stroke="var(--accent-tertiary, #f43f5e)" strokeWidth="2" />
    <line x1="6" y1="6" x2="18" y2="18" stroke="var(--accent-tertiary, #f43f5e)" strokeWidth="2" />
  </IconBase>
);

/* 23. Menu Icon */
export const MenuIcon = ({ size, className, label = "Menu", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" stroke="var(--accent-primary, #00f2fe)" strokeWidth="2" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </IconBase>
);

/* 24. Chevrons (Up, Down, Left, Right) */
export const ChevronUpIcon = ({ size, className, label = "Up", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <polyline points="18 15 12 9 6 15" strokeWidth="2" />
  </IconBase>
);

export const ChevronDownIcon = ({ size, className, label = "Down", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <polyline points="6 9 12 15 18 9" strokeWidth="2" />
  </IconBase>
);

export const ChevronLeftIcon = ({ size, className, label = "Left", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <polyline points="15 18 9 12 15 6" strokeWidth="2" />
  </IconBase>
);

export const ChevronRightIcon = ({ size, className, label = "Right", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <polyline points="9 18 15 12 9 6" strokeWidth="2" />
  </IconBase>
);

/* Math Operator Crisp SVG Glyphs */
export const DivideGlyph = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="4" y1="12" x2="20" y2="12" />
    <circle cx="12" cy="6" r="1.5" fill="currentColor" />
    <circle cx="12" cy="18" r="1.5" fill="currentColor" />
  </svg>
);

export const MultiplyGlyph = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

export const SqrtGlyph = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 3 13 L 6 13 L 9 20 L 14 4 L 21 4" />
  </svg>
);

export const PiGlyph = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M 4 7 C 9 6 15 6 20 7" />
    <path d="M 8 7 L 8 18" />
    <path d="M 16 7 L 16 16 C 16 18 17 19 19 18" />
  </svg>
);
