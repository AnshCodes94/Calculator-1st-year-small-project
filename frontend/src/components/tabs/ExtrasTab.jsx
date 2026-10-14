import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { postApi } from '../../utils/api';
import { StepByStepAccordion } from '../StepByStepAccordion';
import { ConverterIcon, WarningIcon } from '../icons';

export const ExtrasTab = () => {
  // Base Conversion
  const [baseVal, setBaseVal] = useState('255');
  const [baseFrom, setBaseFrom] = useState('dec');
  const [baseTo, setBaseTo] = useState('hex');
  const [baseResult, setBaseResult] = useState(null);

  // Unit Conversion
  const [unitVal, setUnitVal] = useState(100);
  const [unitCat, setUnitCat] = useState('length');
  const [unitFrom, setUnitFrom] = useState('m');
  const [unitTo, setUnitTo] = useState('km');
  const [unitResult, setUnitResult] = useState(null);

  // Combinatorics
  const [combN, setCombN] = useState(10);
  const [combR, setCombR] = useState(3);
  const [combOp, setCombOp] = useState('nCr');
  const [combResult, setCombResult] = useState(null);

  // GCD / LCM
  const [gcdNums, setGcdNums] = useState('24, 36, 60');
  const [gcdResult, setGcdResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const unitMap = {
    length: ['m', 'km', 'cm', 'mm', 'mi', 'yd', 'ft', 'in'],
    mass: ['kg', 'g', 'mg', 'lb', 'oz', 'tonne'],
    temperature: ['C', 'F', 'K'],
    speed: ['mps', 'kph', 'mph', 'knot', 'fps'],
    angle: ['deg', 'rad', 'grad', 'arcmin', 'arcsec'],
    energy: ['J', 'kJ', 'cal', 'kcal', 'kWh', 'eV'],
    pressure: ['Pa', 'kPa', 'bar', 'psi', 'atm', 'mmHg']
  };

  const handleBaseConvert = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await postApi('/api/extras/base-convert', {
        value: baseVal,
        from_base: baseFrom,
        to_base: baseTo
      });
      setBaseResult(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnitConvert = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await postApi('/api/extras/unit-convert', {
        value: parseFloat(unitVal),
        category: unitCat,
        from_unit: unitFrom,
        to_unit: unitTo
      });
      setUnitResult(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCombCalc = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await postApi('/api/extras/combinatorics', {
        n: parseInt(combN),
        r: parseInt(combR),
        operation: combOp
      });
      setCombResult(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGcdCalc = async () => {
    setLoading(true);
    setError(null);
    try {
      const nums = gcdNums.split(',').map(s => s.trim()).filter(Boolean);
      const res = await postApi('/api/extras/gcd-lcm', { numbers: nums });
      setGcdResult(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 text-left">
      {/* 2x2 Grid for Extras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* 1. Radix Base Converter */}
        <div className="glass-panel p-5 sm:p-6 flex flex-col gap-4">
          <span className="font-display font-bold text-theme-primary text-base">
            Radix Base Conversion
          </span>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-theme-muted">Number string</label>
            <input
              type="text"
              value={baseVal}
              onChange={(e) => setBaseVal(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border font-mono text-sm text-theme-text focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-muted">From Base</label>
              <select
                value={baseFrom}
                onChange={(e) => setBaseFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs font-mono text-theme-text focus:outline-none"
              >
                <option value="dec">Decimal (10)</option>
                <option value="bin">Binary (2)</option>
                <option value="oct">Octal (8)</option>
                <option value="hex">Hexadecimal (16)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-muted">To Base</label>
              <select
                value={baseTo}
                onChange={(e) => setBaseTo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs font-mono text-theme-text focus:outline-none"
              >
                <option value="hex">Hexadecimal (16)</option>
                <option value="bin">Binary (2)</option>
                <option value="oct">Octal (8)</option>
                <option value="dec">Decimal (10)</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleBaseConvert}
            className="w-full py-2.5 rounded-xl bg-theme-primary/15 border border-theme-primary/40 text-theme-primary font-bold text-xs"
          >
            Convert Radix
          </button>

          {baseResult && (
            <div className="p-3.5 rounded-xl bg-theme-surface/90 border border-theme-border flex items-center justify-between">
              <span className="text-xs font-mono text-theme-muted">Result ({baseTo.toUpperCase()}):</span>
              <span className="font-mono font-bold text-lg text-theme-primary">{baseResult.converted}</span>
            </div>
          )}
        </div>

        {/* 2. Unit Converter */}
        <div className="glass-panel p-5 sm:p-6 flex flex-col gap-4">
          <span className="font-display font-bold text-theme-secondary text-base">
            Physical Unit Converter
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-muted">Category</label>
              <select
                value={unitCat}
                onChange={(e) => {
                  const cat = e.target.value;
                  setUnitCat(cat);
                  setUnitFrom(unitMap[cat][0]);
                  setUnitTo(unitMap[cat][1] || unitMap[cat][0]);
                }}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs font-mono text-theme-text focus:outline-none"
              >
                {Object.keys(unitMap).map(k => (
                  <option key={k} value={k}>{k.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-muted">Value</label>
              <input
                type="number"
                value={unitVal}
                onChange={(e) => setUnitVal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border font-mono text-sm text-theme-text focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-muted">From</label>
              <select
                value={unitFrom}
                onChange={(e) => setUnitFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs font-mono text-theme-text focus:outline-none"
              >
                {(unitMap[unitCat] || []).map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-muted">To</label>
              <select
                value={unitTo}
                onChange={(e) => setUnitTo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs font-mono text-theme-text focus:outline-none"
              >
                {(unitMap[unitCat] || []).map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleUnitConvert}
            className="w-full py-2.5 rounded-xl bg-theme-secondary/15 border border-theme-secondary/40 text-theme-secondary font-bold text-xs"
          >
            Convert Unit
          </button>

          {unitResult && (
            <div className="p-3.5 rounded-xl bg-theme-surface/90 border border-theme-border flex items-center justify-between">
              <span className="text-xs font-mono text-theme-muted">Result:</span>
              <span className="font-mono font-bold text-base text-theme-secondary">{unitResult.formatted}</span>
            </div>
          )}
        </div>

        {/* 3. Combinatorics (nCr / nPr) */}
        <div className="glass-panel p-5 sm:p-6 flex flex-col gap-4">
          <span className="font-display font-bold text-theme-tertiary text-base">
            Combinatorics (nCr / nPr)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-muted">n (Total)</label>
              <input
                type="number"
                min="0"
                value={combN}
                onChange={(e) => setCombN(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border font-mono text-sm text-theme-text focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-muted">r (Sample)</label>
              <input
                type="number"
                min="0"
                value={combR}
                onChange={(e) => setCombR(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border font-mono text-sm text-theme-text focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-muted">Type</label>
              <select
                value={combOp}
                onChange={(e) => setCombOp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs font-mono text-theme-text focus:outline-none"
              >
                <option value="nCr">nCr (Comb)</option>
                <option value="nPr">nPr (Perm)</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleCombCalc}
            className="w-full py-2.5 rounded-xl bg-theme-tertiary/15 border border-theme-tertiary/40 text-theme-tertiary font-bold text-xs"
          >
            Compute Combinations
          </button>

          {combResult && (
            <div className="p-3.5 rounded-xl bg-theme-surface/90 border border-theme-border flex items-center justify-between">
              <span className="text-xs font-mono text-theme-muted">Output:</span>
              <span className="font-mono font-bold text-lg text-theme-tertiary">{combResult.result?.value}</span>
            </div>
          )}
        </div>

        {/* 4. GCD & LCM */}
        <div className="glass-panel p-5 sm:p-6 flex flex-col gap-4">
          <span className="font-display font-bold text-amber-400 text-base">
            Number Theory (GCD & LCM)
          </span>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-theme-muted">Comma-separated Integers</label>
            <input
              type="text"
              value={gcdNums}
              onChange={(e) => setGcdNums(e.target.value)}
              placeholder="e.g. 24, 36, 60"
              className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border font-mono text-sm text-theme-text focus:outline-none"
            />
          </div>
          <button
            onClick={handleGcdCalc}
            className="w-full py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 font-bold text-xs"
          >
            Find GCD & LCM
          </button>

          {gcdResult && (
            <div className="p-3.5 rounded-xl bg-theme-surface/90 border border-theme-border flex items-center justify-between text-xs font-mono">
              <div>GCD: <span className="font-bold text-amber-400 text-base">{gcdResult.gcd}</span></div>
              <div>LCM: <span className="font-bold text-theme-primary text-base">{gcdResult.lcm}</span></div>
            </div>
          )}
        </div>

      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/60 text-left flex items-start gap-3">
          <WarningIcon size={20} className="text-red-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="text-white font-medium">{error.message}</span>
            <p className="text-red-300 font-mono text-[11px] mt-1">💡 {error.hint}</p>
          </div>
        </div>
      )}
    </div>
  );
};
