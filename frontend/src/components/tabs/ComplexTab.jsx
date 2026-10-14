import React, { useState } from 'react';
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
    <div className="w-full flex flex-col gap-4 text-left">
      <div className="card-surface p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-mono font-semibold text-fuchsia-400">Complex Expression (use 'i' for imaginary unit)</label>
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="e.g. (3 + 4*i) / (1 - 2*i) or (1 + i)^6"
            className="w-full px-3 py-2 rounded-lg bg-theme-elevated/70 border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-fuchsia-400 focus:outline-none"
          />
        </div>

        <button
          disabled={loading}
          onClick={handleAnalyze}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-fuchsia-500/20 transition-all disabled:opacity-50"
        >
          {loading ? (
            <span>Analyzing Complex Domain...</span>
          ) : (
            <>
              <ScientificIcon size={16} />
              <span>Analyze Complex Number</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-left flex items-start gap-2.5">
          <WarningIcon size={16} className="text-rose-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="font-mono text-rose-300 mr-1.5 font-bold">[{error.code || 'COMPLEX_ERROR'}]</span>
            <span className="text-rose-200 font-medium">{error.message}</span>
            {error.hint && (
              <p className="text-rose-300/80 font-mono text-[11px] mt-1">Hint: {error.hint}</p>
            )}
          </div>
        </div>
      )}

      {resultData && resultData.result && (
        <div className="card-surface p-4 sm:p-5 flex flex-col gap-3">
          <div className="text-xs font-mono font-bold text-fuchsia-400 uppercase tracking-wider">
            Complex Properties Breakdown
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-lg bg-theme-elevated border border-cyan-500/20">
              <span className="text-[10px] font-mono font-semibold text-cyan-400 uppercase">Real Part Re(z)</span>
              <div className="font-mono font-bold text-base text-cyan-300 mt-0.5">
                {resultData.result.real?.numeric || resultData.result.real?.exact}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-theme-elevated border border-violet-500/20">
              <span className="text-[10px] font-mono font-semibold text-violet-400 uppercase">Imaginary Part Im(z)</span>
              <div className="font-mono font-bold text-base text-violet-300 mt-0.5">
                {resultData.result.imag?.numeric || resultData.result.imag?.exact} i
              </div>
            </div>

            <div className="p-3 rounded-lg bg-theme-elevated border border-emerald-500/20">
              <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase">Modulus |z|</span>
              <div className="font-mono font-bold text-base text-emerald-300 mt-0.5">
                {resultData.result.modulus?.numeric || resultData.result.modulus?.exact}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-theme-elevated border border-amber-500/20">
              <span className="text-[10px] font-mono font-semibold text-amber-400 uppercase">Argument Arg(z)</span>
              <div className="font-mono font-bold text-sm text-amber-300 mt-0.5">
                {resultData.result.argument_rad?.numeric || resultData.result.argument_rad?.exact} rad ({resultData.result.argument_deg?.numeric || resultData.result.argument_deg?.exact}°)
              </div>
            </div>

            <div className="p-3 rounded-lg bg-theme-elevated border border-rose-500/20">
              <span className="text-[10px] font-mono font-semibold text-rose-400 uppercase">Conjugate z*</span>
              <div className="font-mono font-bold text-sm text-rose-300 mt-0.5">
                {resultData.result.conjugate?.exact}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-theme-elevated border border-fuchsia-500/20">
              <span className="text-[10px] font-mono font-semibold text-fuchsia-400 uppercase">Polar Form</span>
              <div className="font-mono font-bold text-sm text-fuchsia-300 mt-0.5">
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
