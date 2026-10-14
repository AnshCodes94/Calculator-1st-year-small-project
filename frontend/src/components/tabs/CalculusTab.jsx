import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    <div className="w-full flex flex-col gap-5">
      {/* Calculus Sub-Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-theme-surface/80 border border-theme-border/60">
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
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === tab.id
                ? 'bg-theme-primary/15 text-theme-primary border border-theme-primary/40 shadow-glow-primary'
                : 'text-theme-muted hover:text-theme-text hover:bg-theme-glass'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Parameters Card */}
      <div className="glass-panel p-5 sm:p-6 flex flex-col gap-4 text-left">
        {activeSubTab === 'diff' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-mono text-theme-muted">Expression f(x)</label>
              <input
                type="text"
                value={diffExpr}
                onChange={(e) => setDiffExpr(e.target.value)}
                placeholder="e.g. x^3 * sin(x) + exp(2*x)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-mono text-theme-muted">Variable</label>
                <input
                  type="text"
                  value={diffVar}
                  onChange={(e) => setDiffVar(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-mono text-theme-muted">Order (n)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={diffOrder}
                  onChange={(e) => setDiffOrder(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'integ' && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-mono text-theme-muted">Integrand f(x)</label>
                <input
                  type="text"
                  value={integExpr}
                  onChange={(e) => setIntegExpr(e.target.value)}
                  placeholder="e.g. 2*x / (x^2 + 1)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-theme-muted">Variable</label>
                <input
                  type="text"
                  value={integVar}
                  onChange={(e) => setIntegVar(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-theme-muted">Lower Limit (Optional)</label>
                <input
                  type="text"
                  value={integLower}
                  onChange={(e) => setIntegLower(e.target.value)}
                  placeholder="e.g. 0 or -oo"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-theme-muted">Upper Limit (Optional)</label>
                <input
                  type="text"
                  value={integUpper}
                  onChange={(e) => setIntegUpper(e.target.value)}
                  placeholder="e.g. 1 or oo"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'limit' && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-mono text-theme-muted">Expression f(x)</label>
              <input
                type="text"
                value={limitExpr}
                onChange={(e) => setLimitExpr(e.target.value)}
                placeholder="e.g. sin(x)/x"
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-theme-muted">Approaches Point</label>
              <input
                type="text"
                value={limitPoint}
                onChange={(e) => setLimitPoint(e.target.value)}
                placeholder="0 or oo"
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-theme-muted">Direction</label>
              <select
                value={limitDir}
                onChange={(e) => setLimitDir(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
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
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-mono text-theme-muted">Function f(x)</label>
              <input
                type="text"
                value={seriesExpr}
                onChange={(e) => setSeriesExpr(e.target.value)}
                placeholder="e.g. cos(x)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-theme-muted">Center Point (x₀)</label>
              <input
                type="text"
                value={seriesPoint}
                onChange={(e) => setSeriesPoint(e.target.value)}
                placeholder="0 for Maclaurin"
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-theme-muted">Order (n)</label>
              <input
                type="number"
                min="1"
                max="12"
                value={seriesOrder}
                onChange={(e) => setSeriesOrder(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Compute Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          onClick={handleCompute}
          className="mt-2 w-full py-3 rounded-xl bg-theme-equals text-white font-bold text-sm shadow-glow-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Evaluating via SymPy Engine...</span>
            </>
          ) : (
            <>
              <CalculusIcon size={18} />
              <span>Compute Symbolic Calculus</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/60 text-left flex items-start gap-3">
          <WarningIcon size={20} className="text-red-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="font-mono font-bold text-red-300 mr-2">[{error.code || 'ERROR'}]</span>
            <span className="text-white font-medium">{error.message}</span>
            <p className="text-red-300 font-mono text-[11px] mt-1">💡 {error.hint}</p>
          </div>
        </div>
      )}

      {/* Result Card & Step-by-Step Accordion */}
      {resultData && resultData.result && (
        <div className="glass-panel p-5 sm:p-6 text-left flex flex-col gap-3">
          <div className="text-xs font-mono font-bold text-theme-primary uppercase tracking-wider">
            Symbolic Result
          </div>
          <div className="p-4 rounded-xl bg-theme-surface/90 border border-theme-border font-display text-xl sm:text-2xl text-theme-text overflow-x-auto">
            {resultData.result.exact}
          </div>
          {resultData.result.numeric && (
            <div className="text-xs font-mono text-theme-muted text-right">
              Numerical approx: <span className="text-theme-primary font-bold">{resultData.result.numeric}</span>
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
