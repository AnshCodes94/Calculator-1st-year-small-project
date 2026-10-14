import React from 'react';

// Base SVG wrapper: 24x24 grid, 1.5px stroke, round caps, currentColor only
const IconBase = ({ 
  children, 
  size = 20, 
  className = '', 
  label, 
  ...props 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      role="img"
      aria-label={label}
      {...props}
    >
      {label && <title>{label}</title>}
      {children}
    </svg>
  );
};

/* 1. History Icon (Clean clock with counter-clockwise arrow) */
export const HistoryIcon = ({ size, className, label = "History", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M3 12a9 9 0 1 0 2.64-6.36L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l3 3" />
  </IconBase>
);

/* 2. Memory Icon (Clean integrated circuit / chip) */
export const MemoryIcon = ({ size, className, label = "Memory", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <rect x="9" y="9" width="6" height="6" rx="1" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
  </IconBase>
);

/* 3. Theme Sun / Moon Icon */
export const ThemeIcon = ({ isDark = true, size, className, label = "Toggle Theme", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    {isDark ? (
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    ) : (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </>
    )}
  </IconBase>
);

/* 4. Settings Icon */
export const SettingsIcon = ({ size, className, label = "Settings", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </IconBase>
);

/* 5. Graph Icon (Clean Line Chart) */
export const GraphIcon = ({ size, className, label = "Graph Plotter", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M3 3v18h18" />
    <path d="M19 9l-5 5-4-4-4 4" />
  </IconBase>
);

/* 6. Matrix Icon (Clean Brackets with grid dots) */
export const MatrixIcon = ({ size, className, label = "Matrix Laboratory", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M5 4H3v16h2M19 4h2v16h-2" />
    <circle cx="8" cy="8" r="1" fill="currentColor" />
    <circle cx="16" cy="8" r="1" fill="currentColor" />
    <circle cx="8" cy="16" r="1" fill="currentColor" />
    <circle cx="16" cy="16" r="1" fill="currentColor" />
  </IconBase>
);

/* 7. Calculus Icon (Clean Integral ∫) */
export const CalculusIcon = ({ size, className, label = "Calculus", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M15 4a3 3 0 0 0-3 3v10a3 3 0 0 1-3 3" />
    <path d="M9 12h6" />
  </IconBase>
);

/* 8. Algebra Icon (Clean Variables x = y) */
export const AlgebraIcon = ({ size, className, label = "Algebra", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M4 8l6 8M10 8l-6 8" />
    <path d="M14 10h6M14 14h6" />
  </IconBase>
);

/* 9. Converter / Extras Icon (Swap arrows) */
export const ConverterIcon = ({ size, className, label = "Converters", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M7 10h14l-4-4" />
    <path d="M17 14H3l4 4" />
  </IconBase>
);

/* 10. Scientific Icon: f(x) */
export const ScientificIcon = ({ size, className, label = "Scientific Mode", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M5 7c0-2 1-3 3-3h2M5 11h6M8 4v16" />
    <path d="M14 13l4 6M18 13l-4 6" />
  </IconBase>
);

/* 11. Copy Icon */
export const CopyIcon = ({ size, className, label = "Copy", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </IconBase>
);

/* 12. Delete / Backspace Icon */
export const DeleteIcon = ({ size, className, label = "Backspace", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M21 4H8l-6 8 6 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
    <path d="M17 9l-6 6M11 9l6 6" />
  </IconBase>
);

/* 13. Clear Icon (AC) */
export const ClearIcon = ({ size, className, label = "Clear All", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15 9l-6 6M9 9l6 6" />
  </IconBase>
);

/* 14. Warning Icon (Error state) */
export const WarningIcon = ({ size, className, label = "Warning", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M12 9v4M12 17h.01" />
  </IconBase>
);

/* 15. Success Check Icon */
export const SuccessCheckIcon = ({ size, className, label = "Success", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12l2.5 2.5L16 9" />
  </IconBase>
);

/* 16. Wifi Off / Offline Icon */
export const WifiOffIcon = ({ size, className, label = "Offline", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
  </IconBase>
);

/* 17. Close Icon */
export const CloseIcon = ({ size, className, label = "Close", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M18 6L6 18M6 6l12 12" />
  </IconBase>
);

/* 18. Chevron Down Icon */
export const ChevronDownIcon = ({ size, className, label = "Expand", ...props }) => (
  <IconBase size={size} className={className} label={label} {...props}>
    <path d="M6 9l6 6 6-6" />
  </IconBase>
);

/* ==========================================================================
   MATH OPERATOR GLYPHS (Crisp SVG 1.5px outline)
   ========================================================================== */

export const DivideGlyph = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className={className}>
    <circle cx="12" cy="6" r="1.5" fill="currentColor" stroke="none" />
    <path d="M5 12h14" />
    <circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export const MultiplyGlyph = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className={className}>
    <path d="M6 6l12 12M6 18L18 6" />
  </svg>
);

export const SqrtGlyph = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 13h3l4 8 5-17h6" />
  </svg>
);

export const PiGlyph = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 7h16M9 7v13M16 7c0 4 0 9 2 13" />
  </svg>
);
