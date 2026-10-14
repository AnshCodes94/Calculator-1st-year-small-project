import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

export const NotFound = ({ onReturnHome }) => {
  const floatingSymbols = [
    { symbol: '∫', top: '15%', left: '10%', size: 'text-6xl', delay: 0 },
    { symbol: 'lim_{x→∞}', top: '25%', right: '15%', size: 'text-4xl', delay: 2 },
    { symbol: '∑', bottom: '20%', left: '18%', size: 'text-5xl', delay: 4 },
    { symbol: '√(-1)=i', bottom: '25%', right: '12%', size: 'text-4xl', delay: 1 },
    { symbol: '∂f/∂x', top: '60%', left: '8%', size: 'text-3xl', delay: 3 },
    { symbol: 'e^{iπ}+1=0', top: '12%', left: '45%', size: 'text-4xl', delay: 5 },
    { symbol: 'λ', bottom: '15%', left: '48%', size: 'text-5xl', delay: 2.5 },
  ];

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden p-6">
      {/* Floating Ambient Mathematical Symbols */}
      {floatingSymbols.map((item, idx) => (
        <motion.div
          key={idx}
          style={{ top: item.top, bottom: item.bottom, left: item.left, right: item.right }}
          animate={{
            y: [-15, 15, -15],
            rotate: [-8, 8, -8],
            opacity: [0.15, 0.35, 0.15]
          }}
          transition={{
            duration: 8 + idx * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: item.delay
          }}
          className={`absolute font-mono font-bold text-theme-primary pointer-events-none select-none ${item.size}`}
        >
          {item.symbol}
        </motion.div>
      ))}

      {/* Center Singularity Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 max-w-lg w-full p-8 sm:p-10 rounded-3xl glass-panel-glow text-center flex flex-col items-center"
      >
        <Logo variant="icon" size="lg" animated={true} className="mb-4" />

        <div className="font-display font-black text-7xl sm:text-8xl tracking-tight bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)] bg-clip-text text-transparent">
          404
        </div>

        <div className="my-2 px-3 py-1 rounded-full bg-theme-primary/10 border border-theme-primary/30 text-theme-primary font-mono text-xs font-semibold">
          {"\\lim_{page \\to \\text{found}} f(x) = \\text{undefined}"}
        </div>

        <h1 className="text-xl sm:text-2xl font-bold font-display text-theme-text mt-3">
          Mathematical Singularity Encountered
        </h1>

        <p className="text-sm text-theme-muted mt-2 mb-6 leading-relaxed">
          The requested coordinate lies beyond the defined domain. The function may have diverged to infinity or dissolved into an imaginary dimension.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReturnHome}
          className="px-6 py-3 rounded-xl bg-theme-equals text-white font-bold text-sm shadow-glow-primary flex items-center gap-2"
        >
          Return to CalcVerse Workspace
        </motion.button>
      </motion.div>
    </div>
  );
};
