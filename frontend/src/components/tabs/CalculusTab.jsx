import React, { useState } from 'react';
import { postApi } from '../../utils/api';
import { StepByStepAccordion } from '../StepByStepAccordion';
import { CalculusIcon, WarningIcon } from '../icons';

export const CalculusTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('diff'); // 'diff', 'integ', 'limit', 'series'

  // Form states
  const [diffExpr, setDiffExpr] = useState('x^3 * sin(x)');
  const [diffVar, setDiffVar] = useState('x');
  const [diffOrder, setDiffOrder] = useState(1);

  const [integExpr, setIntegExpr] = useState('2*x / (x^2 + 1)');
  const [integVar, setIntegVar] = useState('x');
  const [integLower, setIntegLower] = useState('');
  const [integUpper, setIntegUpper] = useState('');

  const [limitExpr, setLimitExpr] = useState('sin(x)/x');
  const [limitVar, setLimitVar] = useState('x');
  const [limitPoint, setLimitPoint] = useState('0');
  const [limitDir, setLimitDir] = useState('+-');

  const [seriesExpr, setSeriesExpr] = useState('cos(x)');
  const [seriesVar, setSeriesVar] = useState('x');
  const [seriesPoint, setSeriesPoint] = useState('0');
  const [seriesOrder, setSeriesOrder] = useState(4);

  // Result & Error
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCompute = async () => {
    setLoading(true);
    setError(null);
    setResultData(null);

    try {
      let endpoint = '';
      let payload = {};

      if (activeSubTab === 'diff') {
        endpoint = '/api/calculus/differentiate';
        payload = { expression: diffExpr, variable: diffVar, order: parseInt(diffOrder) || 1 };
      } else if (activeSubTab === 'integ') {
        endpoint = '/api/calculus/integrate';
        payload = {
          expression: integExpr,
          variable: integVar,
          lower_limit: integLower.trim() || null,
          upper_limit: integUpper.trim() || null
        };
      } else if (activeSubTab === 'limit') {
        endpoint = '/api/calculus/limit';
        payload = { expression: limitExpr, variable: limitVar, point: limitPoint, direction: limitDir };
      } else if (activeSubTab === 'series') {
        endpoint = '/api/calculus/series';
        payload = { expression: seriesExpr, variable: seriesVar, point: seriesPoint, order: parseInt(seriesOrder) || 4 };
      }

      const res = await postApi(endpoint, payload);
      setResultData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 text-left">
      {/* Calculus Sub-Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-theme-surface border border-theme-border">
        {[
          { id: 'diff', label: 'Differentiation (d/dx)' },
          { id: 'integ', label: 'Integration (∫ dx)' },
          { id: 'limit', label: 'Limits (lim x→a)' },
          { id: 'series', label: 'Taylor Series' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id);
              setResultData(null);
              setError(null);
            }}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all border ${
              activeSubTab === tab.id
                ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
                : 'text-theme-secondary hover:text-theme-text border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Parameters Card */}
      <div className="card-surface p-4 sm:p-5 flex flex-col gap-3">
        {activeSubTab === 'diff' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-mono text-violet-400 font-semibold">Expression f(x)</label>
              <input
                type="text"
                value={diffExpr}
                onChange={(e) => setDiffExpr(e.target.value)}
                placeholder="e.g. x^3 * sin(x) + exp(2*x)"
                className="w-full px-3 py-2 rounded-lg bg-theme-elevated/70 border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-xs font-mono text-theme-secondary">Variable</label>
                <input
                  type="text"
                  value={diffVar}
                  onChange={(e) => setDiffVar(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-theme-elevated/70 border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-xs font-mono text-theme-secondary">Order (n)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={diffOrder}
                  onChange={(e) => setDiffOrder(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-theme-elevated/70 border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'integ' && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-mono text-violet-400 font-semibold">Integrand f(x)</label>
                <input
                  type="text"
                  value={integExpr}
                  onChange={(e) => setIntegExpr(e.target.value)}
                  placeholder="e.g. 2*x / (x^2 + 1)"
                  className="w-full px-3 py-2 rounded-lg bg-theme-elevated/70 border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono text-theme-secondary">Variable</label>
                <input
                  type="text"
                  value={integVar}
                  onChange={(e) => setIntegVar(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-theme-elevated/70 border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono text-theme-secondary">Lower Limit (Optional)</label>
                <input
                  type="text"
                  value={integLower}
                  onChange={(e) => setIntegLower(e.target.value)}
                  placeholder="e.g. 0 or -oo"
                  className="w-full px-3 py-2 rounded-lg bg-theme-elevated/70 border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono text-theme-secondary">Upper Limit (Optional)</label>
                <input
                  type="text"
                  value={integUpper}
                  onChange={(e) => setIntegUpper(e.target.value)}
                  placeholder="e.g. 1 or oo"
                  className="w-full px-3 py-2 rounded-lg bg-theme-elevated/70 border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'limit' && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-mono text-violet-400 font-semibold">Expression f(x)</label>
              <input
                type="text"
                value={limitExpr}
                onChange={(e) => setLimitExpr(e.target.value)}
                placeholder="e.g. sin(x)/x"
                className="w-full px-3 py-2 rounded-lg bg-theme-elevated/70 border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-secondary">Approaches</label>
              <input
                type="text"
                value={limitPoint}
                onChange={(e) => setLimitPoint(e.target.value)}
                placeholder="0 or oo"
                className="w-full px-3 py-2 rounded-lg bg-theme-elevated/70 border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-secondary">Direction</label>
              <select
                value={limitDir}
                onChange={(e) => setLimitDir(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-theme-elevated/70 border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-violet-500 focus:outline-none"
              >
                <option value="+-">Two-sided (±)</option>
                <option value="+">Right (+)</option>
                <option value="-">Left (−)</option>
              </select>
            </div>
          </div>
        )}

        {activeSubTab === 'series' && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-mono text-violet-400 font-semibold">Function f(x)</label>
              <input
                type="text"
                value={seriesExpr}
                onChange={(e) => setSeriesExpr(e.target.value)}
                placeholder="e.g. cos(x)"
                className="w-full px-3 py-2 rounded-lg bg-theme-elevated/70 border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-secondary">Center (x₀)</label>
              <input
                type="text"
                value={seriesPoint}
                onChange={(e) => setSeriesPoint(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-lg bg-theme-elevated/70 border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-secondary">Order (n)</label>
              <input
                type="number"
                min="1"
                max="12"
                value={seriesOrder}
                onChange={(e) => setSeriesOrder(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-theme-elevated/70 border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Compute Action Button */}
        <button
          disabled={loading}
          onClick={handleCompute}
          className="mt-1 w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-violet-500/20 transition-all disabled:opacity-50"
        >
          {loading ? (
            <span>Computing Symbolic Calculus...</span>
          ) : (
            <>
              <CalculusIcon size={16} />
              <span>Evaluate Calculus Expression</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-left flex items-start gap-2.5">
          <WarningIcon size={16} className="text-rose-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="font-mono text-rose-300 mr-1.5 font-bold">[{error.code || 'ERROR'}]</span>
            <span className="text-rose-200 font-medium">{error.message}</span>
            {error.hint && (
              <p className="text-rose-300/80 font-mono text-[11px] mt-1">Hint: {error.hint}</p>
            )}
          </div>
        </div>
      )}

      {/* Result Card & Step-by-Step Accordion */}
      {resultData && resultData.result && (
        <div className="card-surface p-4 sm:p-5 flex flex-col gap-2.5">
          <div className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider">
            Symbolic Result
          </div>
          <div className="p-3 rounded-lg bg-theme-elevated border border-theme-border font-mono text-base sm:text-lg text-theme-text overflow-x-auto">
            {resultData.result.exact}
          </div>
          {resultData.result.numeric && (
            <div className="text-xs font-mono text-theme-secondary text-right">
              Numerical approx: <span className="text-violet-400 font-semibold">{resultData.result.numeric}</span>
            </div>
          )}

          {/* Derivation Steps */}
          {resultData.steps && resultData.steps.length > 0 && (
            <StepByStepAccordion steps={resultData.steps} />
          )}
        </div>
      )}
    </div>
  );
};
