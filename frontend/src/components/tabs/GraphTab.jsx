import React, { useState, useEffect, useRef } from 'react';
import { postApi } from '../../utils/api';
import { GraphIcon, WarningIcon } from '../icons';

export const GraphTab = () => {
  const [f1, setF1] = useState('sin(x)');
  const [f2, setF2] = useState('cos(x)');
  const [f3, setF3] = useState('');
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chartContainerRef = useRef(null);

  // Muted line colors for quiet professional graph lines
  const lineColors = ['#4F8EF7', '#30A46C', '#F5A524'];

  const plotFunctions = async () => {
    const funcs = [f1, f2, f3].filter(f => f.trim().length > 0);
    if (funcs.length === 0) {
      setError({ message: 'Please provide at least one function to plot.', hint: 'e.g. sin(x) or x^2 - 4' });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await postApi('/api/plot', {
        functions: funcs,
        x_min: parseFloat(xMin),
        x_max: parseFloat(xMax),
        num_points: 500
      });

      if (data.success && window.Plotly && chartContainerRef.current) {
        const traces = data.traces.map((t, idx) => ({
          x: t.x,
          y: t.y,
          mode: 'lines',
          name: t.name,
          line: { color: lineColors[idx % lineColors.length], width: 2 },
          connectgaps: false
        }));

        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
        const zeroLineColor = isDark ? '#262C36' : '#E4E7EC';
        const textColor = isDark ? '#9AA3AF' : '#475467';

        const layout = {
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          margin: { t: 20, r: 20, l: 40, b: 35 },
          xaxis: {
            range: [data.x_min, data.x_max],
            gridcolor: gridColor,
            zerolinecolor: zeroLineColor,
            zerolinewidth: 1,
            color: textColor,
            tickfont: { family: 'JetBrains Mono', size: 10 }
          },
          yaxis: {
            gridcolor: gridColor,
            zerolinecolor: zeroLineColor,
            zerolinewidth: 1,
            color: textColor,
            tickfont: { family: 'JetBrains Mono', size: 10 }
          },
          legend: {
            font: { color: textColor, family: 'Inter', size: 11 },
            bgcolor: 'transparent'
          },
          autosize: true
        };

        const config = {
          responsive: true,
          displayModeBar: false,
          displaylogo: false
        };

        window.Plotly.react(chartContainerRef.current, traces, layout, config);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    plotFunctions();
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 text-left">
      {/* Functions Setup Card */}
      <div className="card-surface p-4 sm:p-5 flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-theme-secondary">f₁(x)</label>
            <input
              type="text"
              value={f1}
              onChange={(e) => setF1(e.target.value)}
              placeholder="e.g. sin(x)"
              className="w-full px-3 py-2 rounded-md bg-theme-surface border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-theme-accent focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-theme-secondary">f₂(x)</label>
            <input
              type="text"
              value={f2}
              onChange={(e) => setF2(e.target.value)}
              placeholder="e.g. cos(x)"
              className="w-full px-3 py-2 rounded-md bg-theme-surface border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-theme-accent focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-theme-secondary">f₃(x) (Optional)</label>
            <input
              type="text"
              value={f3}
              onChange={(e) => setF3(e.target.value)}
              placeholder="e.g. 0.2*x^2 - 3"
              className="w-full px-3 py-2 rounded-md bg-theme-surface border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-theme-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Range & Action */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-24 sm:w-28 flex flex-col gap-1">
            <label className="text-xs font-mono text-theme-secondary">x min</label>
            <input
              type="number"
              value={xMin}
              onChange={(e) => setXMin(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-theme-surface border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-theme-accent focus:outline-none"
            />
          </div>
          <div className="w-24 sm:w-28 flex flex-col gap-1">
            <label className="text-xs font-mono text-theme-secondary">x max</label>
            <input
              type="number"
              value={xMax}
              onChange={(e) => setXMax(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-theme-surface border border-theme-border text-theme-text font-mono text-xs sm:text-sm focus:border-theme-accent focus:outline-none"
            />
          </div>

          <button
            disabled={loading}
            onClick={plotFunctions}
            className="flex-1 min-w-[140px] py-2 rounded-md bg-theme-accent hover:bg-theme-accent-hover text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
          >
            <GraphIcon size={16} />
            <span>{loading ? 'Plotting...' : 'Plot'}</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-md bg-theme-error-subtle border border-theme-error/30 text-left flex items-start gap-2.5">
          <WarningIcon size={16} className="text-theme-error mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="text-theme-text font-medium">{error.message}</span>
            {error.hint && (
              <p className="text-theme-secondary font-mono text-[11px] mt-1">Hint: {error.hint}</p>
            )}
          </div>
        </div>
      )}

      {/* Plotly Canvas Container */}
      <div className="card-surface p-3 sm:p-4 rounded-md overflow-hidden">
        <div 
          ref={chartContainerRef} 
          className="w-full h-[400px] sm:h-[480px]"
        />
      </div>
    </div>
  );
};
