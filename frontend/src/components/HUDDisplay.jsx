import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import katex from 'katex';
import { CopyIcon, SuccessCheckIcon, WarningIcon } from './icons';

export const HUDDisplay = ({
  expression,
  result,
  numericResult,
  isApprox,
  error,
  angleMode,
  isShiftActive,
  isHypActive,
  hasMemory,
  isLoading,
  onClearError,
  onExpressionChange
}) => {
  const [copied, setCopied] = useState(false);
  const katexExprRef = useRef(null);
  const katexResultRef = useRef(null);

  // Auto-shrink font size for long expressions and results
  const getResultFontSize = (str) => {
    if (!str) return 'text-3xl sm:text-4xl';
    const len = str.length;
    if (len > 30) return 'text-xl sm:text-2xl';
    if (len > 18) return 'text-2xl sm:text-3xl';
    return 'text-3xl sm:text-4xl';
  };

  // Render KaTeX for live formula preview
  useEffect(() => {
    if (!katexExprRef.current) return;

    if (!expression || !expression.trim()) {
      katexExprRef.current.innerHTML = '<span class="text-theme-subtle/50 font-mono text-sm">0</span>';
      return;
    }

    // Convert symbols for prettier KaTeX live preview
    let previewLatex = expression
      .replace(/\*/g, ' \\times ')
      .replace(/\//g, ' \\div ')
      .replace(/pi/g, '\\pi ')
      .replace(/sqrt\(/g, '\\sqrt{')
      .replace(/cbrt\(/g, '\\sqrt[3]{')
      .replace(/\^/g, '^');

    try {
      katex.render(previewLatex, katexExprRef.current, {
        throwOnError: false,
        displayMode: false
      });
    } catch (e) {
      katexExprRef.current.textContent = expression;
    }
  }, [expression]);

  // Render KaTeX for main result
  useEffect(() => {
    if (!katexResultRef.current) return;

    if (!result) {
      katexResultRef.current.innerHTML = '<span class="text-theme-muted font-mono">0</span>';
      return;
    }

    try {
      katex.render(result, katexResultRef.current, {
        throwOnError: false,
        displayMode: true
      });
    } catch (e) {
      katexResultRef.current.textContent = result;
    }
  }, [result]);

  const handleCopy = () => {
    const textToCopy = numericResult || result || expression;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`relative w-full rounded-2xl hud-screen p-4 sm:p-6 transition-all duration-300 flex flex-col justify-between min-h-[175px] sm:min-h-[195px] ${
        error ? 'border-red-500 shadow-[0_0_30px_rgba(244,63,94,0.35)] animate-[shake_0.45s_ease-in-out]' : ''
      }`}
    >
      {/* Scanning Light Beam (Futuristic HUD feel) */}
      <div className="hud-scan-beam" />

      {/* Top HUD Telemetry Status Bar */}
      <div className="flex items-center justify-between text-[11px] font-mono text-theme-muted pb-2 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-bold text-theme-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-theme-primary animate-pulse" />
            HUD.v2
          </span>
          <span className="opacity-40">•</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] ${angleMode === 'rad' ? 'bg-theme-primary/20 text-theme-primary' : 'bg-theme-secondary/20 text-theme-secondary'}`}>
            {angleMode.toUpperCase()}
          </span>
          {isShiftActive && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/25 text-amber-300 font-bold">
              SHIFT
            </span>
          )}
          {isHypActive && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/25 text-purple-300 font-bold">
              HYP
            </span>
          )}
          {hasMemory && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/25 text-emerald-300 font-bold">
              MEM
            </span>
          )}
        </div>

        {/* Copy Result Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-theme-muted hover:text-theme-text transition-colors text-[10px]"
          title="Copy result to clipboard"
          aria-label="Copy mathematical result"
        >
          {copied ? (
            <>
              <SuccessCheckIcon size={12} className="text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <CopyIcon size={12} />
              <span>Copy</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Center Formula Input & Live KaTeX Preview */}
      <div className="my-2 text-right relative z-10">
        <div 
          ref={katexExprRef}
          className="overflow-x-auto overflow-y-hidden text-theme-muted/80 text-base sm:text-lg min-h-[28px] font-mono tracking-wide py-0.5"
        />
      </div>

      {/* Bottom Main Result Output */}
      <div className="mt-auto text-right relative z-10 flex flex-col items-end">
        {isLoading ? (
          <div className="flex items-center gap-2 py-2 text-theme-primary">
            <span className="inline-block w-4 h-4 border-2 border-theme-primary border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-sm tracking-widest uppercase">Calculating...</span>
          </div>
        ) : (
          <>
            {/* KaTeX Rendered Mathematical Exact Result */}
            <div 
              ref={katexResultRef}
              className={`font-display font-bold text-theme-text overflow-x-auto max-w-full drop-shadow-[0_0_15px_var(--glow-primary)] ${getResultFontSize(result)}`}
            />

            {/* Decimal Numerical Approximation */}
            {numericResult && isApprox && (
              <motion.div 
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono text-xs sm:text-sm text-theme-primary/90 mt-1 tracking-wider"
              >
                ≈ {numericResult}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Error Banner Overlay with Shake & Fix Hint */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="mt-3 p-3 rounded-xl bg-red-950/80 border border-red-500/60 shadow-lg text-left relative z-20 flex items-start gap-3"
          >
            <WarningIcon size={20} className="text-red-400 mt-0.5 shrink-0" />
            <div className="flex-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[10px] px-1.5 py-0.2 rounded bg-red-500/30 text-red-200">
                  {error.code || 'CALC_ERROR'}
                </span>
                <span className="text-white font-medium">{error.message}</span>
              </div>
              <div className="text-red-300/90 text-[11px] mt-1 font-mono">
                💡 {error.hint || 'Please check expression format.'}
              </div>
            </div>
            <button 
              onClick={onClearError}
              className="text-red-400 hover:text-white text-xs font-mono px-2 py-0.5 rounded hover:bg-white/10"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
