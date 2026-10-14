import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
        const traces = data.traces.map(t => ({
          x: t.x,
          y: t.y,
          mode: 'lines',
          name: t.name,
          line: { color: t.color, width: 2.5 },
          connectgaps: false // avoids connecting through vertical asymptotes
        }));

        const layout = {
          paper_bgcolor: 'rgba(7, 10, 18, 0.4)',
          plot_bgcolor: 'rgba(14, 21, 38, 0.6)',
          margin: { t: 30, r: 20, l: 45, b: 40 },
          xaxis: {
            range: [data.x_min, data.x_max],
            gridcolor: 'rgba(255, 255, 255, 0.08)',
            zerolinecolor: 'rgba(0, 242, 254, 0.4)',
            zerolinewidth: 2,
            color: '#94a3b8'
          },
          yaxis: {
            gridcolor: 'rgba(255, 255, 255, 0.08)',
            zerolinecolor: 'rgba(0, 242, 254, 0.4)',
            zerolinewidth: 2,
            color: '#94a3b8'
          },
          legend: {
            font: { color: '#f8fafc' },
            bgcolor: 'rgba(11, 15, 25, 0.8)'
          },
          autosize: true
        };

        const config = {
          responsive: true,
          displayModeBar: true,
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
    // Initial plot on mount
    plotFunctions();
  }, []);

  return (
    <div className="w-full flex flex-col gap-5 text-left">
      {/* Functions Setup Card */}
      <div className="glass-panel p-5 sm:p-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-[#00f2fe] font-bold">Function f₁(x)</label>
            <input
              type="text"
              value={f1}
              onChange={(e) => setF1(e.target.value)}
              placeholder="e.g. sin(x)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-[#8b5cf6] font-bold">Function f₂(x)</label>
            <input
              type="text"
              value={f2}
              onChange={(e) => setF2(e.target.value)}
              placeholder="e.g. cos(x)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-secondary focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-[#f43f5e] font-bold">Function f₃(x) (Optional)</label>
            <input
              type="text"
              value={f3}
              onChange={(e) => setF3(e.target.value)}
              placeholder="e.g. 0.2*x^2 - 3"
              className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-tertiary focus:outline-none"
            />
          </div>
        </div>

        {/* Range & Action */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-28 flex flex-col gap-1.5">
            <label className="text-xs font-mono text-theme-muted">x min</label>
            <input
              type="number"
              value={xMin}
              onChange={(e) => setXMin(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
            />
          </div>
          <div className="w-28 flex flex-col gap-1.5">
            <label className="text-xs font-mono text-theme-muted">x max</label>
            <input
              type="number"
              value={xMax}
              onChange={(e) => setXMax(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-theme-text font-mono text-sm focus:border-theme-primary focus:outline-none"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            onClick={plotFunctions}
            className="flex-1 min-w-[160px] py-2.5 rounded-xl bg-theme-equals text-white font-bold text-sm shadow-glow-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <GraphIcon size={18} />
            <span>{loading ? 'Plotting Coordinates...' : 'Render Interactive Curves'}</span>
          </motion.button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/60 text-left flex items-start gap-3">
          <WarningIcon size={20} className="text-red-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="text-white font-medium">{error.message}</span>
            <p className="text-red-300 font-mono text-[11px] mt-1">💡 {error.hint}</p>
          </div>
        </div>
      )}

      {/* Plotly Canvas Container */}
      <div className="glass-panel p-3 sm:p-4 overflow-hidden rounded-2xl">
        <div 
          ref={chartContainerRef} 
          className="w-full h-[450px] sm:h-[520px] rounded-xl overflow-hidden"
        />
      </div>
    </div>
  );
};
