import React, { useState } from 'react';
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
    <div className="w-full flex flex-col gap-4 text-left">
      {/* Matrices Grid Inputs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Matrix A Card */}
        <div className="card-surface p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-sans font-semibold text-theme-text text-sm">Matrix A</span>
            <select
              value={`${dimA.rows}x${dimA.cols}`}
              onChange={(e) => {
                const [r, c] = e.target.value.split('x').map(Number);
                resizeGrid(setDimA, setGridA, r, c);
              }}
              className="px-2.5 py-1 rounded-md bg-theme-surface border border-theme-border text-xs font-mono text-theme-text focus:border-theme-accent focus:outline-none"
            >
              <option value="2x2">2 × 2</option>
              <option value="3x3">3 × 3</option>
              <option value="4x4">4 × 4</option>
            </select>
          </div>

          <div className="w-full overflow-x-auto pb-1 flex justify-center">
            <div 
              className="inline-grid gap-1.5 p-2 rounded-md bg-theme-elevated border-l-2 border-r-2 border-theme-border w-fit self-center"
              style={{ gridTemplateColumns: `repeat(${dimA.cols}, minmax(44px, 58px))` }}
            >
              {gridA.map((row, r) =>
                row.map((val, c) => (
                  <input
                    key={`a-${r}-${c}`}
                    type="text"
                    value={val}
                    onChange={(e) => handleCellChange(gridA, setGridA, r, c, e.target.value)}
                    className="w-11 sm:w-13 h-9 sm:h-10 text-center font-mono text-xs sm:text-sm bg-theme-surface rounded-md border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Matrix B Card */}
        <div className="card-surface p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-sans font-semibold text-theme-secondary text-sm">Matrix B (For A × B)</span>
            <select
              value={`${dimB.rows}x${dimB.cols}`}
              onChange={(e) => {
                const [r, c] = e.target.value.split('x').map(Number);
                resizeGrid(setDimB, setGridB, r, c);
              }}
              className="px-2.5 py-1 rounded-md bg-theme-surface border border-theme-border text-xs font-mono text-theme-text focus:border-theme-accent focus:outline-none"
            >
              <option value="2x2">2 × 2</option>
              <option value="3x3">3 × 3</option>
              <option value="4x4">4 × 4</option>
            </select>
          </div>

          <div className="w-full overflow-x-auto pb-1 flex justify-center">
            <div 
              className="inline-grid gap-1.5 p-2 rounded-md bg-theme-elevated border-l-2 border-r-2 border-theme-border w-fit self-center"
              style={{ gridTemplateColumns: `repeat(${dimB.cols}, minmax(44px, 58px))` }}
            >
              {gridB.map((row, r) =>
                row.map((val, c) => (
                  <input
                    key={`b-${r}-${c}`}
                    type="text"
                    value={val}
                    onChange={(e) => handleCellChange(gridB, setGridB, r, c, e.target.value)}
                    className="w-11 sm:w-13 h-9 sm:h-10 text-center font-mono text-xs sm:text-sm bg-theme-surface rounded-md border border-theme-border text-theme-text focus:border-theme-accent focus:outline-none"
                  />
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Operations Toolbar */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'determinant', label: 'det(A)' },
          { id: 'inverse', label: 'A⁻¹ (Inverse)' },
          { id: 'transpose', label: 'Aᵀ (Transpose)' },
          { id: 'multiply', label: 'A × B (Product)' },
          { id: 'eigen', label: 'Eigenvalues & Vectors' }
        ].map((op) => (
          <button
            key={op.id}
            disabled={loading}
            onClick={() => handleMatrixOperation(op.id)}
            className="px-3 py-2 rounded-md bg-theme-elevated hover:bg-theme-hover border border-theme-border text-theme-text text-xs sm:text-sm font-medium transition-colors"
          >
            {op.label}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-md bg-theme-error-subtle border border-theme-error/30 text-left flex items-start gap-2.5">
          <WarningIcon size={16} className="text-theme-error mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="font-mono text-theme-error mr-1.5 font-medium">[{error.code || 'MATRIX_ERROR'}]</span>
            <span className="text-theme-text font-medium">{error.message}</span>
            {error.hint && (
              <p className="text-theme-secondary font-mono text-[11px] mt-1">Hint: {error.hint}</p>
            )}
          </div>
        </div>
      )}

      {/* Result Card */}
      {resultData && (
        <div className="card-surface p-4 sm:p-5 flex flex-col gap-3">
          <div className="text-xs font-mono text-theme-secondary uppercase">
            Result
          </div>

          {/* Grid result */}
          {resultData.result && resultData.result.grid && (
            <div className="w-full overflow-x-auto flex justify-center py-2">
              <div 
                className="inline-grid gap-1.5 p-3 rounded-md bg-theme-elevated border-l-2 border-r-2 border-theme-border w-fit"
                style={{ gridTemplateColumns: `repeat(${resultData.result.grid[0].length}, minmax(48px, 64px))` }}
              >
                {resultData.result.grid.map((row, r) =>
                  row.map((val, c) => (
                    <div key={`${r}-${c}`} className="h-9 flex items-center justify-center font-mono font-medium text-theme-text text-xs sm:text-sm bg-theme-surface rounded-md border border-theme-border">
                      {val}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Determinant scalar result */}
          {resultData.result && !resultData.result.grid && (
            <div className="p-3 rounded-md bg-theme-elevated border border-theme-border font-mono text-lg text-theme-text text-center">
              {resultData.result.numeric || resultData.result.exact}
            </div>
          )}

          {/* Eigenvalues & Eigenvectors */}
          {resultData.eigenvalues && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-mono text-theme-secondary">Eigenvalues:</span>
              <div className="flex flex-wrap gap-2">
                {resultData.eigenvalues.map((ev, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-theme-elevated border border-theme-border text-xs font-mono text-theme-text">
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
