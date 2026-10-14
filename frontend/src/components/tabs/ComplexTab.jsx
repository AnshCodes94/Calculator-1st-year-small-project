import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { postApi } from '../../utils/api';
import { StepByStepAccordion } from '../StepByStepAccordion';
import { WarningIcon, ScientificIcon } from '../icons';

export const ComplexTab = () => {
  const [expr, setExpr] = useState('(3 + 4*i) / (1 - 2*i)');
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResultData(null);
    try {
      const res = await postApi('/api/complex/evaluate', { expression: expr });
      setResultData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 text-left">
      <div className="glass-panel p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono text-theme-muted">Complex Expression (use 'i' for imaginary unit)</label>
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="e.g. (3 + 4*i) / (1 - 2*i) or (1 + i)^6"
            className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          onClick={handleAnalyze}
          className="w-full py-3 rounded-xl bg-theme-equals text-white font-bold text-sm shadow-glow-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span>Analyzing Complex Domain...</span>
          ) : (
            <>
              <ScientificIcon size={18} />
              <span>Analyze Complex Quantities</span>
            </>
          )}
        </motion.button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/60 text-left flex items-start gap-3">
          <WarningIcon size={20} className="text-red-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="font-mono font-bold text-red-300 mr-2">[{error.code || 'COMPLEX_ERROR'}]</span>
            <span className="text-white font-medium">{error.message}</span>
            <p className="text-red-300 font-mono text-[11px] mt-1">💡 {error.hint}</p>
          </div>
        </div>
      )}

      {resultData && resultData.result && (
        <div className="glass-panel p-5 sm:p-6 flex flex-col gap-4">
          <div className="text-xs font-mono font-bold text-theme-primary uppercase tracking-wider">
            Complex Properties Breakdown
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-theme-surface/80 border border-theme-border">
              <span className="text-[10px] font-mono text-theme-muted uppercase">Real Part Re(z)</span>
              <div className="font-display font-bold text-lg text-theme-text mt-1">
                {resultData.result.real?.numeric || resultData.result.real?.exact}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-theme-surface/80 border border-theme-border">
              <span className="text-[10px] font-mono text-theme-muted uppercase">Imaginary Part Im(z)</span>
              <div className="font-display font-bold text-lg text-theme-text mt-1">
                {resultData.result.imag?.numeric || resultData.result.imag?.exact} i
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-theme-surface/80 border border-theme-border">
              <span className="text-[10px] font-mono text-theme-muted uppercase">Modulus |z|</span>
              <div className="font-display font-bold text-lg text-theme-primary mt-1">
                {resultData.result.modulus?.numeric || resultData.result.modulus?.exact}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-theme-surface/80 border border-theme-border">
              <span className="text-[10px] font-mono text-theme-muted uppercase">Argument Arg(z)</span>
              <div className="font-display font-bold text-base text-theme-secondary mt-1">
                {resultData.result.argument_rad?.numeric || resultData.result.argument_rad?.exact} rad ({resultData.result.argument_deg?.numeric || resultData.result.argument_deg?.exact}°)
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-theme-surface/80 border border-theme-border">
              <span className="text-[10px] font-mono text-theme-muted uppercase">Conjugate z*</span>
              <div className="font-display font-bold text-base text-theme-tertiary mt-1">
                {resultData.result.conjugate?.exact}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-theme-surface/80 border border-theme-border">
              <span className="text-[10px] font-mono text-theme-muted uppercase">Euler Polar Form</span>
              <div className="font-display font-bold text-sm text-theme-text mt-1">
                r e^(iθ)
              </div>
            </div>
          </div>

          {resultData.steps && resultData.steps.length > 0 && (
            <StepByStepAccordion steps={resultData.steps} />
          )}
        </div>
      )}
    </div>
  );
};
