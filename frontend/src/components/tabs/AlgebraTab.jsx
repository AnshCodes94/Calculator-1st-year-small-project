import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    <div className="w-full flex flex-col gap-5">
      {/* Sub-Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-theme-surface/80 border border-theme-border/60">
        {[
          { id: 'single', label: 'Single Equation Solver' },
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

      {/* Single Equation Solver */}
      {activeSubTab === 'single' && (
        <div className="glass-panel p-5 sm:p-6 flex flex-col gap-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-mono text-theme-muted">Equation (f(x) = 0 or f(x) = g(x))</label>
              <input
                type="text"
                value={eqStr}
                onChange={(e) => setEqStr(e.target.value)}
                placeholder="e.g. 2*x^2 - 4*x - 6 = 0"
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-theme-muted">Solve For Variable</label>
              <input
                type="text"
                value={eqVar}
                onChange={(e) => setEqVar(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            onClick={handleSolveSingle}
            className="w-full py-3 rounded-xl bg-theme-equals text-white font-bold text-sm shadow-glow-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <AlgebraIcon size={18} />
            <span>Find Roots & Solutions</span>
          </motion.button>
        </div>
      )}

      {/* Linear System Solver */}
      {activeSubTab === 'system' && (
        <div className="glass-panel p-5 sm:p-6 flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-theme-muted font-bold">System Equations</span>
            <button
              onClick={() => setSystemEqs([...systemEqs, ''])}
              className="px-2.5 py-1 rounded-lg bg-theme-primary/15 text-theme-primary text-xs font-mono font-bold hover:bg-theme-primary/25 transition-colors"
            >
              + Add Equation
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
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
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
                />
                {systemEqs.length > 2 && (
                  <button
                    onClick={() => setSystemEqs(systemEqs.filter((_, i) => i !== idx))}
                    className="p-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            onClick={handleSolveLinearSystem}
            className="w-full py-3 rounded-xl bg-theme-equals text-white font-bold text-sm shadow-glow-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <AlgebraIcon size={18} />
            <span>Solve Linear System [A | b]</span>
          </motion.button>
        </div>
      )}

      {/* Expression Manipulation */}
      {activeSubTab === 'manipulate' && (
        <div className="glass-panel p-5 sm:p-6 flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-theme-muted">Algebraic Expression</label>
            <input
              type="text"
              value={manipExpr}
              onChange={(e) => setManipExpr(e.target.value)}
              placeholder="e.g. (x + 3)^3 or x^2 - 9"
              className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              onClick={() => handleManipulate('simplify')}
              className="py-3 rounded-xl bg-theme-primary/15 border border-theme-primary/30 text-theme-primary font-bold text-xs sm:text-sm hover:bg-theme-primary/25 transition-all"
            >
              Simplify
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              onClick={() => handleManipulate('expand')}
              className="py-3 rounded-xl bg-theme-secondary/15 border border-theme-secondary/30 text-theme-secondary font-bold text-xs sm:text-sm hover:bg-theme-secondary/25 transition-all"
            >
              Expand
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              onClick={() => handleManipulate('factorize')}
              className="py-3 rounded-xl bg-theme-tertiary/15 border border-theme-tertiary/30 text-theme-tertiary font-bold text-xs sm:text-sm hover:bg-theme-tertiary/25 transition-all"
            >
              Factorize
            </motion.button>
          </div>
        </div>
      )}

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

      {/* Result Display */}
      {resultData && (
        <div className="glass-panel p-5 sm:p-6 text-left flex flex-col gap-3">
          <div className="text-xs font-mono font-bold text-theme-primary uppercase tracking-wider">
            Algebraic Result
          </div>

          {resultData.solutions && Array.isArray(resultData.solutions) && (
            <div className="flex flex-wrap gap-2">
              {resultData.solutions.map((sol, idx) => (
                <div key={idx} className="px-4 py-2.5 rounded-xl bg-theme-surface/90 border border-theme-border font-mono text-base text-theme-text">
                  x_{idx + 1} = <span className="text-theme-primary font-bold">{sol.numeric || sol.exact}</span>
                </div>
              ))}
            </div>
          )}

          {resultData.solutions && !Array.isArray(resultData.solutions) && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(resultData.solutions).map(([k, v]) => (
                <div key={k} className="px-4 py-2.5 rounded-xl bg-theme-surface/90 border border-theme-border font-mono text-base text-theme-text">
                  {k} = <span className="text-theme-primary font-bold">{v.numeric || v.exact}</span>
                </div>
              ))}
            </div>
          )}

          {resultData.result && (
            <div className="p-4 rounded-xl bg-theme-surface/90 border border-theme-border font-display text-xl sm:text-2xl text-theme-text overflow-x-auto">
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
