import React, { useState, useEffect, useRef } from 'react';
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

  // Auto-scale font size for large result strings
  const getResultFontSize = (str) => {
    if (!str) return 'text-2xl sm:text-3xl';
    const len = str.length;
    if (len > 30) return 'text-lg sm:text-xl';
    if (len > 18) return 'text-xl sm:text-2xl';
    return 'text-2xl sm:text-3xl';
  };

  // Render KaTeX for live formula preview
  useEffect(() => {
    if (!katexExprRef.current) return;

    if (!expression || !expression.trim()) {
      katexExprRef.current.innerHTML = '<span class="text-theme-muted/50 font-mono text-sm">0</span>';
      return;
    }

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

  // Render KaTeX for result
  useEffect(() => {
    if (!katexResultRef.current) return;

    if (!result) {
      katexResultRef.current.innerHTML = '<span class="text-theme-secondary font-mono">0</span>';
      return;
    }

    try {
      katex.render(result, katexResultRef.current, {
        throwOnError: false,
        displayMode: false
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
      className={`display-screen p-4 sm:p-5 flex flex-col justify-between min-h-[165px] sm:min-h-[175px] text-right transition-colors ${
        error ? 'border-theme-rose error-nudge' : ''
      }`}
    >
      {/* Top Telemetry & Status Badges */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Angle Mode Badge */}
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            {angleMode.toUpperCase()}
          </span>

          {/* Active Status Badges */}
          {isShiftActive && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
              SHIFT
            </span>
          )}

          {isHypActive && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 border border-purple-500/40 text-purple-300">
              HYP
            </span>
          )}

          {hasMemory && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
              MEM
            </span>
          )}
        </div>

        {/* Copy Result Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-theme-secondary hover:text-theme-text transition-colors text-xs font-sans"
          title="Copy result to clipboard"
          aria-label="Copy mathematical result"
        >
          {copied ? (
            <>
              <SuccessCheckIcon size={13} className="text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <CopyIcon size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Formula Input & Live KaTeX Expression */}
      <div className="my-2.5 overflow-x-auto overflow-y-hidden text-theme-secondary text-sm sm:text-base font-mono">
        <div ref={katexExprRef} className="inline-block" />
        <span className="standard-caret" />
      </div>

      {/* Main Result Output */}
      <div className="mt-auto flex flex-col items-end">
        {isLoading ? (
          <div className="flex items-center gap-2 py-1 text-theme-cyan">
            <span className="w-3.5 h-3.5 border-2 border-theme-cyan border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-xs tracking-wider">Evaluating...</span>
          </div>
        ) : (
          <>
            {/* Exact Rendered Result */}
            <div 
              ref={katexResultRef}
              className={`font-mono font-semibold text-theme-text overflow-x-auto max-w-full ${getResultFontSize(result)}`}
            />

            {/* Numerical Approximation (with soft cyan tint) */}
            {numericResult && isApprox && (
              <div className="font-mono text-xs sm:text-sm text-sky-400/90 mt-1">
                ≈ {numericResult}
              </div>
            )}
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 rounded-md bg-rose-500/10 border border-rose-500/30 text-left flex items-start gap-2.5">
          <WarningIcon size={16} className="text-rose-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[10px] px-1 rounded bg-rose-500/20 text-rose-300">
                {error.code || 'ERROR'}
              </span>
              <span className="text-rose-200 font-medium">{error.message}</span>
            </div>
            {error.hint && (
              <div className="text-rose-300/80 text-[11px] mt-1 font-mono">
                💡 {error.hint}
              </div>
            )}
          </div>
          <button 
            onClick={onClearError}
            className="text-rose-400 hover:text-white text-xs p-1"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
