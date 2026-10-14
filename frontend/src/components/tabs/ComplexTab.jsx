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
          <label className="text-xs font-mono text-theme-secondary">Complex Expression (use 'i' for imaginary unit)</label>
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="e.g. (3 + 4*i) / (1 - 2*i) or (1 + i)^6"
            className="w-full px-3 py-2 rounded-md bg-theme-surface border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-theme-accent focus:outline-none"
          />
        </div>

        <button
          disabled={loading}
          onClick={handleAnalyze}
          className="w-full py-2.5 rounded-md bg-theme-accent hover:bg-theme-accent-hover text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
        >
          {loading ? (
            <span>Analyzing...</span>
          ) : (
            <>
              <ScientificIcon size={16} />
              <span>Analyze Complex Number</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-theme-error-subtle border border-theme-error/30 text-left flex items-start gap-2.5">
          <WarningIcon size={16} className="text-theme-error mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="font-mono text-theme-error mr-1.5 font-medium">[{error.code || 'COMPLEX_ERROR'}]</span>
            <span className="text-theme-text font-medium">{error.message}</span>
            {error.hint && (
              <p className="text-theme-secondary font-mono text-[11px] mt-1">Hint: {error.hint}</p>
            )}
          </div>
        </div>
      )}

      {resultData && resultData.result && (
        <div className="card-surface p-4 sm:p-5 flex flex-col gap-3">
          <div className="text-xs font-mono text-theme-secondary uppercase">
            Properties Breakdown
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-md bg-theme-elevated border border-theme-border">
              <span className="text-[10px] font-mono text-theme-secondary uppercase">Real Part Re(z)</span>
              <div className="font-mono font-medium text-base text-theme-text mt-0.5">
                {resultData.result.real?.numeric || resultData.result.real?.exact}
              </div>
            </div>

            <div className="p-3 rounded-md bg-theme-elevated border border-theme-border">
              <span className="text-[10px] font-mono text-theme-secondary uppercase">Imaginary Part Im(z)</span>
              <div className="font-mono font-medium text-base text-theme-text mt-0.5">
                {resultData.result.imag?.numeric || resultData.result.imag?.exact} i
              </div>
            </div>

            <div className="p-3 rounded-md bg-theme-elevated border border-theme-border">
              <span className="text-[10px] font-mono text-theme-secondary uppercase">Modulus |z|</span>
              <div className="font-mono font-medium text-base text-theme-text mt-0.5">
                {resultData.result.modulus?.numeric || resultData.result.modulus?.exact}
              </div>
            </div>

            <div className="p-3 rounded-md bg-theme-elevated border border-theme-border">
              <span className="text-[10px] font-mono text-theme-secondary uppercase">Argument Arg(z)</span>
              <div className="font-mono text-sm text-theme-text mt-0.5">
                {resultData.result.argument_rad?.numeric || resultData.result.argument_rad?.exact} rad ({resultData.result.argument_deg?.numeric || resultData.result.argument_deg?.exact}°)
              </div>
            </div>

            <div className="p-3 rounded-md bg-theme-elevated border border-theme-border">
              <span className="text-[10px] font-mono text-theme-secondary uppercase">Conjugate z*</span>
              <div className="font-mono text-sm text-theme-text mt-0.5">
                {resultData.result.conjugate?.exact}
              </div>
            </div>

            <div className="p-3 rounded-md bg-theme-elevated border border-theme-border">
              <span className="text-[10px] font-mono text-theme-secondary uppercase">Polar Form</span>
              <div className="font-mono text-sm text-theme-text mt-0.5">
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
