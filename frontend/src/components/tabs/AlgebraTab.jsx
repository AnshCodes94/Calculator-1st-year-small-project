import React, { useState } from 'react';
import { postApi } from '../../utils/api';
import { StepByStepAccordion } from '../StepByStepAccordion';
import { AlgebraIcon, WarningIcon } from '../icons';

export const AlgebraTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('single'); // 'single', 'system', 'manipulate'

  // Single Equation
  const [eqStr, setEqStr] = useState('2*x^2 - 4*x - 6 = 0');
  const [eqVar, setEqVar] = useState('x');

  // Linear System
  const [systemEqs, setSystemEqs] = useState(['2*x + 3*y = 7', 'x - y = 1']);

  // Simplify / Expand / Factorize
  const [manipExpr, setManipExpr] = useState('(x + 3)^3');

  // Result & Error
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSolveSingle = async () => {
    setLoading(true);
    setError(null);
    setResultData(null);
    try {
      const res = await postApi('/api/algebra/solve', { equation: eqStr, variable: eqVar });
      setResultData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSolveSystem = async () => {
    setLoading(true);
    setError(null);
    setResultData(null);
    try {
      const res = await postApi('/api/algebra/solve-system', { equations: systemEqs });
      setResultData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleManipulate = async (action) => {
    setLoading(true);
    setError(null);
    setResultData(null);
    try {
      const res = await postApi(`/api/algebra/${action}`, { expression: manipExpr });
      setResultData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 text-left">
      {/* Sub-Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-theme-surface border border-theme-border">
        {[
          { id: 'single', label: 'Single Equation' },
          { id: 'system', label: 'Linear Equations System' },
          { id: 'manipulate', label: 'Simplify, Expand & Factor' },
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
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                : 'text-theme-secondary hover:text-theme-text border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Single Equation Solver */}
      {activeSubTab === 'single' && (
        <div className="card-surface p-4 sm:p-5 flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-mono font-semibold text-cyan-400">Equation (f(x) = 0 or f(x) = g(x))</label>
              <input
                type="text"
                value={eqStr}
                onChange={(e) => setEqStr(e.target.value)}
                placeholder="e.g. 2*x^2 - 4*x - 6 = 0"
                className="w-full px-3 py-2 rounded-lg bg-theme-elevated/70 border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-secondary">Solve For</label>
              <input
                type="text"
                value={eqVar}
                onChange={(e) => setEqVar(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-theme-elevated/70 border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            disabled={loading}
            onClick={handleSolveSingle}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            <AlgebraIcon size={16} />
            <span>Find Roots & Exact Solutions</span>
          </button>
        </div>
      )}

      {/* Linear System Solver */}
      {activeSubTab === 'system' && (
        <div className="card-surface p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-cyan-400">Linear System Equations</span>
            <button
              onClick={() => setSystemEqs([...systemEqs, ''])}
              className="px-2.5 py-1 rounded-md bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold transition-colors"
            >
              + Add Equation
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {systemEqs.map((eq, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={eq}
                  onChange={(e) => {
                    const newEqs = [...systemEqs];
                    newEqs[idx] = e.target.value;
                    setSystemEqs(newEqs);
                  }}
                  placeholder={`Equation ${idx + 1}: e.g. 2*x + 3*y = 7`}
                  className="flex-1 px-3 py-2 rounded-lg bg-theme-elevated/70 border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-cyan-400 focus:outline-none"
                />
                {systemEqs.length > 2 && (
                  <button
                    onClick={() => setSystemEqs(systemEqs.filter((_, i) => i !== idx))}
                    className="p-2 rounded-md text-rose-400 hover:bg-rose-500/10 text-xs transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            disabled={loading}
            onClick={handleSolveSystem}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            <AlgebraIcon size={16} />
            <span>Solve Linear System [A | b]</span>
          </button>
        </div>
      )}

      {/* Expression Manipulation */}
      {activeSubTab === 'manipulate' && (
        <div className="card-surface p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono font-semibold text-cyan-400">Algebraic Expression</label>
            <input
              type="text"
              value={manipExpr}
              onChange={(e) => setManipExpr(e.target.value)}
              placeholder="e.g. (x + 3)^3 or x^2 - 9"
              className="w-full px-3 py-2 rounded-lg bg-theme-elevated/70 border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              disabled={loading}
              onClick={() => handleManipulate('simplify')}
              className="py-2.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-semibold text-xs sm:text-sm transition-colors"
            >
              Simplify
            </button>
            <button
              disabled={loading}
              onClick={() => handleManipulate('expand')}
              className="py-2.5 rounded-lg bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-violet-300 font-semibold text-xs sm:text-sm transition-colors"
            >
              Expand
            </button>
            <button
              disabled={loading}
              onClick={() => handleManipulate('factorize')}
              className="py-2.5 rounded-lg bg-fuchsia-500/15 hover:bg-fuchsia-500/25 border border-fuchsia-500/30 text-fuchsia-300 font-semibold text-xs sm:text-sm transition-colors"
            >
              Factorize
            </button>
          </div>
        </div>
      )}

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

      {/* Result Display */}
      {resultData && (
        <div className="card-surface p-4 sm:p-5 flex flex-col gap-3">
          <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            Algebraic Result
          </div>

          {resultData.solutions && Array.isArray(resultData.solutions) && (
            <div className="flex flex-wrap gap-2">
              {resultData.solutions.map((sol, idx) => (
                <div key={idx} className="px-3.5 py-2 rounded-lg bg-theme-elevated border border-theme-border font-mono text-xs sm:text-sm text-theme-text">
                  x_{idx + 1} = <span className="font-bold text-cyan-400">{sol.numeric || sol.exact}</span>
                </div>
              ))}
            </div>
          )}

          {resultData.solutions && !Array.isArray(resultData.solutions) && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(resultData.solutions).map(([k, v]) => (
                <div key={k} className="px-3.5 py-2 rounded-lg bg-theme-elevated border border-theme-border font-mono text-xs sm:text-sm text-theme-text">
                  {k} = <span className="font-bold text-cyan-400">{v.numeric || v.exact}</span>
                </div>
              ))}
            </div>
          )}

          {resultData.result && (
            <div className="p-3.5 rounded-lg bg-theme-elevated border border-theme-border font-mono text-base sm:text-lg text-theme-text overflow-x-auto">
              {resultData.result.exact}
            </div>
          )}

          {resultData.steps && resultData.steps.length > 0 && (
            <StepByStepAccordion steps={resultData.steps} />
          )}
        </div>
      )}
    </div>
  );
};
