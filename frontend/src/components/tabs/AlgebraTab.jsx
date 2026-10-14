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
      <div className="flex flex-wrap gap-1 p-1 rounded-md bg-theme-surface border border-theme-border">
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
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeSubTab === tab.id
                ? 'bg-theme-elevated text-theme-text font-semibold shadow-elevation'
                : 'text-theme-secondary hover:text-theme-text'
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
              <label className="text-xs font-mono text-theme-secondary">Equation (f(x) = 0 or f(x) = g(x))</label>
              <input
                type="text"
                value={eqStr}
                onChange={(e) => setEqStr(e.target.value)}
                placeholder="e.g. 2*x^2 - 4*x - 6 = 0"
                className="w-full px-3 py-2 rounded-md bg-theme-surface border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-theme-accent focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-secondary">Variable</label>
              <input
                type="text"
                value={eqVar}
                onChange={(e) => setEqVar(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-theme-surface border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-theme-accent focus:outline-none"
              />
            </div>
          </div>

          <button
            disabled={loading}
            onClick={handleSolveSingle}
            className="w-full py-2.5 rounded-md bg-theme-accent hover:bg-theme-accent-hover text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
          >
            <AlgebraIcon size={16} />
            <span>Find Solutions</span>
          </button>
        </div>
      )}

      {/* Linear System Solver */}
      {activeSubTab === 'system' && (
        <div className="card-surface p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-theme-secondary">Equations System</span>
            <button
              onClick={() => setSystemEqs([...systemEqs, ''])}
              className="px-2.5 py-1 rounded-md bg-theme-elevated text-theme-text text-xs font-mono hover:bg-theme-hover border border-theme-border transition-colors"
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
                  className="flex-1 px-3 py-2 rounded-md bg-theme-surface border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-theme-accent focus:outline-none"
                />
                {systemEqs.length > 2 && (
                  <button
                    onClick={() => setSystemEqs(systemEqs.filter((_, i) => i !== idx))}
                    className="p-2 rounded-md text-theme-muted hover:text-theme-error hover:bg-theme-hover text-xs transition-colors"
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
            className="w-full py-2.5 rounded-md bg-theme-accent hover:bg-theme-accent-hover text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
          >
            <AlgebraIcon size={16} />
            <span>Solve Linear System</span>
          </button>
        </div>
      )}

      {/* Expression Manipulation */}
      {activeSubTab === 'manipulate' && (
        <div className="card-surface p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-theme-secondary">Algebraic Expression</label>
            <input
              type="text"
              value={manipExpr}
              onChange={(e) => setManipExpr(e.target.value)}
              placeholder="e.g. (x + 3)^3 or x^2 - 9"
              className="w-full px-3 py-2 rounded-md bg-theme-surface border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-theme-accent focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              disabled={loading}
              onClick={() => handleManipulate('simplify')}
              className="py-2 rounded-md bg-theme-elevated hover:bg-theme-hover border border-theme-border text-theme-text font-medium text-xs sm:text-sm transition-colors"
            >
              Simplify
            </button>
            <button
              disabled={loading}
              onClick={() => handleManipulate('expand')}
              className="py-2 rounded-md bg-theme-elevated hover:bg-theme-hover border border-theme-border text-theme-text font-medium text-xs sm:text-sm transition-colors"
            >
              Expand
            </button>
            <button
              disabled={loading}
              onClick={() => handleManipulate('factorize')}
              className="py-2 rounded-md bg-theme-elevated hover:bg-theme-hover border border-theme-border text-theme-text font-medium text-xs sm:text-sm transition-colors"
            >
              Factorize
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-md bg-theme-error-subtle border border-theme-error/30 text-left flex items-start gap-2.5">
          <WarningIcon size={16} className="text-theme-error mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="font-mono text-theme-error mr-1.5 font-medium">[{error.code || 'ERROR'}]</span>
            <span className="text-theme-text font-medium">{error.message}</span>
            {error.hint && (
              <p className="text-theme-secondary font-mono text-[11px] mt-1">Hint: {error.hint}</p>
            )}
          </div>
        </div>
      )}

      {/* Result Display */}
      {resultData && (
        <div className="card-surface p-4 sm:p-5 flex flex-col gap-2.5">
          <div className="text-xs font-mono text-theme-secondary uppercase">
            Result
          </div>

          {resultData.solutions && Array.isArray(resultData.solutions) && (
            <div className="flex flex-wrap gap-2">
              {resultData.solutions.map((sol, idx) => (
                <div key={idx} className="px-3 py-2 rounded-md bg-theme-elevated border border-theme-border font-mono text-xs sm:text-sm text-theme-text">
                  x_{idx + 1} = <span className="font-semibold text-theme-text">{sol.numeric || sol.exact}</span>
                </div>
              ))}
            </div>
          )}

          {resultData.solutions && !Array.isArray(resultData.solutions) && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(resultData.solutions).map(([k, v]) => (
                <div key={k} className="px-3 py-2 rounded-md bg-theme-elevated border border-theme-border font-mono text-xs sm:text-sm text-theme-text">
                  {k} = <span className="font-semibold text-theme-text">{v.numeric || v.exact}</span>
                </div>
              ))}
            </div>
          )}

          {resultData.result && (
            <div className="p-3 rounded-md bg-theme-elevated border border-theme-border font-mono text-base sm:text-lg text-theme-text overflow-x-auto">
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
