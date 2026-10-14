import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import katex from 'katex';
import { HistoryIcon, CloseIcon, ClearIcon, CopyIcon } from './icons';

export const HistoryDrawer = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-out Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-theme-surface/95 backdrop-blur-2xl border-l border-theme-border shadow-2xl flex flex-col"
            role="dialog"
            aria-label="Calculation History"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-theme-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-theme-primary/10 text-theme-primary">
                  <HistoryIcon size={20} />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base text-theme-text">Calculation History</h2>
                  <p className="text-[11px] text-theme-muted font-mono">Last {history.length} calculations saved</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <button
                    onClick={onClearHistory}
                    className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs font-mono transition-colors"
                    title="Clear history"
                  >
                    <ClearIcon size={16} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-theme-muted hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Close History Drawer"
                >
                  <CloseIcon size={18} />
                </button>
              </div>
            </div>

            {/* History Items List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-theme-muted">
                  <HistoryIcon size={42} className="opacity-20 mb-3" />
                  <p className="font-medium text-sm">No calculations yet</p>
                  <p className="text-xs text-theme-subtle mt-1 max-w-[200px]">
                    Evaluated formulas will automatically be preserved here.
                  </p>
                </div>
              ) : (
                history.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => {
                      onSelectHistory(item);
                      onClose();
                    }}
                    className="p-3.5 rounded-xl bg-theme-glass hover:bg-theme-glass-hover border border-theme-border/60 hover:border-theme-primary/40 cursor-pointer transition-all group flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between text-xs text-theme-muted font-mono">
                      <span className="truncate max-w-[240px] font-medium text-theme-text/80">
                        {item.expression}
                      </span>
                      <span className="text-[10px] text-theme-subtle shrink-0">
                        {item.time || 'Recently'}
                      </span>
                    </div>

                    <div className="text-right font-display font-semibold text-theme-primary text-base sm:text-lg group-hover:drop-shadow-glow-primary transition-all">
                      {item.numeric || item.latex || item.exact}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Tip */}
            <div className="p-3.5 border-t border-theme-border text-center text-[11px] text-theme-subtle font-mono">
              Click any calculation to load it back into the keypad.
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
