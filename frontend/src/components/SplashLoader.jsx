import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

export const SplashLoader = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-theme-base select-none"
    >
      {/* Background Aurora Glow */}
      <div className="absolute w-96 h-96 rounded-full bg-theme-primary/10 blur-[100px] animate-pulse" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Animated Brand Logo */}
        <Logo variant="full" size="xl" animated={true} />

        {/* Loading Progress Bar */}
        <div className="w-56 h-1 rounded-full bg-white/10 overflow-hidden relative mt-2">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)]"
          />
        </div>

        <p className="font-mono text-xs text-theme-muted tracking-widest uppercase">
          Initializing Symbolic Engines...
        </p>
      </div>
    </motion.div>
  );
};
