import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { postApi } from '../../utils/api';
import { StepByStepAccordion } from '../StepByStepAccordion';
import { MatrixIcon, WarningIcon } from '../icons';

export const MatrixTab = () => {
  const [dimA, setDimA] = useState({ rows: 3, cols: 3 });
  const [dimB, setDimB] = useState({ rows: 3, cols: 3 });

  // Matrix grids data
  const [gridA, setGridA] = useState([
    ['1', '0', '0'],
    ['0', '1', '0'],
    ['0', '0', '1']
  ]);
  const [gridB, setGridB] = useState([
    ['1', '2', '0'],
    ['0', '1', '1'],
    ['1', '0', '1']
  ]);

  // Result & Error
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resizeGrid = (setDim, setGrid, rows, cols) => {
    setDim({ rows, cols });
    const newGrid = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        row.push(r === c ? '1' : '0');
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  };

  const handleCellChange = (grid, setGrid, r, c, val) => {
    const updated = grid.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell))
    );
    setGrid(updated);
  };

  const handleMatrixOperation = async (operation) => {
    setLoading(true);
    setError(null);
    setResultData(null);

    try {
      let endpoint = `/api/matrix/${operation}`;
      let payload = { matrix: gridA };

      if (operation === 'multiply') {
        payload = { matrix_a: gridA, matrix_b: gridB };
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
    <div className="w-full flex flex-col gap-5 text-left">
      {/* Matrices Grid Inputs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Matrix A Card */}
        <div className="glass-panel p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-theme-primary text-base">Matrix A</span>
            <select
              value={`${dimA.rows}x${dimA.cols}`}
              onChange={(e) => {
                const [r, c] = e.target.value.split('x').map(Number);
                resizeGrid(setDimA, setGridA, r, c);
              }}
              className="px-2.5 py-1 rounded-xl bg-theme-surface border border-theme-border text-xs font-mono text-theme-text focus:outline-none"
            >
              <option value="2x2">2 × 2</option>
              <option value="3x3">3 × 3</option>
              <option value="4x4">4 × 4</option>
            </select>
          </div>

          <div 
            className="inline-grid gap-1.5 p-3 rounded-xl bg-theme-surface/70 border-l-4 border-r-4 border-theme-primary w-fit self-center"
            style={{ gridTemplateColumns: `repeat(${dimA.cols}, minmax(48px, 62px))` }}
          >
            {gridA.map((row, r) =>
              row.map((val, c) => (
                <input
                  key={`a-${r}-${c}`}
                  type="text"
                  value={val}
                  onChange={(e) => handleCellChange(gridA, setGridA, r, c, e.target.value)}
                  className="w-12 sm:w-14 h-9 sm:h-10 text-center font-mono text-xs sm:text-sm bg-theme-key rounded border border-theme-border text-theme-text focus:border-theme-primary focus:outline-none"
                />
              ))
            )}
          </div>
        </div>

        {/* Matrix B Card */}
        <div className="glass-panel p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-theme-secondary text-base">Matrix B (For A × B)</span>
            <select
              value={`${dimB.rows}x${dimB.cols}`}
              onChange={(e) => {
                const [r, c] = e.target.value.split('x').map(Number);
                resizeGrid(setDimB, setGridB, r, c);
              }}
              className="px-2.5 py-1 rounded-xl bg-theme-surface border border-theme-border text-xs font-mono text-theme-text focus:outline-none"
            >
              <option value="2x2">2 × 2</option>
              <option value="3x3">3 × 3</option>
              <option value="4x4">4 × 4</option>
            </select>
          </div>

          <div 
            className="inline-grid gap-1.5 p-3 rounded-xl bg-theme-surface/70 border-l-4 border-r-4 border-theme-secondary w-fit self-center"
            style={{ gridTemplateColumns: `repeat(${dimB.cols}, minmax(48px, 62px))` }}
          >
            {gridB.map((row, r) =>
              row.map((val, c) => (
                <input
                  key={`b-${r}-${c}`}
                  type="text"
                  value={val}
                  onChange={(e) => handleCellChange(gridB, setGridB, r, c, e.target.value)}
                  className="w-12 sm:w-14 h-9 sm:h-10 text-center font-mono text-xs sm:text-sm bg-theme-key rounded border border-theme-border text-theme-text focus:border-theme-secondary focus:outline-none"
                />
              ))
            )}
          </div>
        </div>

      </div>

      {/* Operations Toolbar */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {[
          { id: 'determinant', label: 'det(A)' },
          { id: 'inverse', label: 'A⁻¹ (Inverse)' },
          { id: 'transpose', label: 'Aᵀ (Transpose)' },
          { id: 'multiply', label: 'A × B (Product)' },
          { id: 'eigen', label: 'Eigenvalues & Vectors' }
        ].map((op) => (
          <motion.button
            key={op.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            onClick={() => handleMatrixOperation(op.id)}
            className="px-4 py-2.5 rounded-xl bg-theme-glass hover:bg-theme-glass-hover border border-theme-border text-theme-text text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            {op.label}
          </motion.button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/60 text-left flex items-start gap-3">
          <WarningIcon size={20} className="text-red-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="font-mono font-bold text-red-300 mr-2">[{error.code || 'MATRIX_ERROR'}]</span>
            <span className="text-white font-medium">{error.message}</span>
            <p className="text-red-300 font-mono text-[11px] mt-1">💡 {error.hint}</p>
          </div>
        </div>
      )}

      {/* Result Card */}
      {resultData && (
        <div className="glass-panel p-5 sm:p-6 flex flex-col gap-4">
          <div className="text-xs font-mono font-bold text-theme-primary uppercase tracking-wider">
            Matrix Operation Result
          </div>

          {/* Grid result display if grid returned */}
          {resultData.result && resultData.result.grid && (
            <div 
              className="inline-grid gap-1.5 p-4 rounded-xl bg-theme-surface/90 border-l-4 border-r-4 border-theme-primary w-fit self-center"
              style={{ gridTemplateColumns: `repeat(${resultData.result.grid[0].length}, minmax(54px, 72px))` }}
            >
              {resultData.result.grid.map((row, r) =>
                row.map((val, c) => (
                  <div key={`${r}-${c}`} className="h-10 flex items-center justify-center font-mono font-bold text-theme-primary text-sm bg-theme-key/80 rounded border border-theme-border">
                    {val}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Determinant scalar result */}
          {resultData.result && !resultData.result.grid && (
            <div className="p-4 rounded-xl bg-theme-surface/90 border border-theme-border font-display text-2xl text-theme-text text-center">
              {resultData.result.numeric || resultData.result.exact}
            </div>
          )}

          {/* Eigenvalues & Eigenvectors */}
          {resultData.eigenvalues && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono text-theme-muted font-bold">Eigenvalues:</span>
              <div className="flex flex-wrap gap-2">
                {resultData.eigenvalues.map((ev, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-theme-surface border border-theme-border text-xs font-mono text-theme-primary">
                    λ = {ev.numeric || ev.value} (mult: {ev.multiplicity})
                  </span>
                ))}
              </div>
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
