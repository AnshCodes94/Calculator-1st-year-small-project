import React, { useState } from 'react';
import { postApi } from '../../utils/api';
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
    <div className="w-full flex flex-col gap-4 text-left">
      {/* 2x2 Grid for Extras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* 1. Radix Base Converter */}
        <div className="card-surface p-4 sm:p-5 flex flex-col gap-3">
          <span className="font-sans font-semibold text-theme-text text-sm">
            Radix Base Conversion
          </span>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-theme-secondary">Value</label>
            <input
              type="text"
              value={baseVal}
              onChange={(e) => setBaseVal(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-theme-surface border border-theme-border font-mono text-xs sm:text-sm text-theme-text focus:border-theme-accent focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-secondary">From</label>
              <select
                value={baseFrom}
                onChange={(e) => setBaseFrom(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md bg-theme-surface border border-theme-border text-xs font-mono text-theme-text focus:border-theme-accent focus:outline-none"
              >
                <option value="dec">Decimal (10)</option>
                <option value="bin">Binary (2)</option>
                <option value="oct">Octal (8)</option>
                <option value="hex">Hexadecimal (16)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-secondary">To</label>
              <select
                value={baseTo}
                onChange={(e) => setBaseTo(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md bg-theme-surface border border-theme-border text-xs font-mono text-theme-text focus:border-theme-accent focus:outline-none"
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
            className="w-full py-2 rounded-md bg-theme-elevated hover:bg-theme-hover border border-theme-border text-theme-text font-medium text-xs transition-colors"
          >
            Convert
          </button>

          {baseResult && (
            <div className="p-2.5 rounded-md bg-theme-elevated border border-theme-border flex items-center justify-between">
              <span className="text-xs font-mono text-theme-secondary">Result ({baseTo.toUpperCase()}):</span>
              <span className="font-mono font-medium text-sm text-theme-text">{baseResult.converted}</span>
            </div>
          )}
        </div>

        {/* 2. Unit Converter */}
        <div className="card-surface p-4 sm:p-5 flex flex-col gap-3">
          <span className="font-sans font-semibold text-theme-text text-sm">
            Unit Converter
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-secondary">Category</label>
              <select
                value={unitCat}
                onChange={(e) => {
                  const cat = e.target.value;
                  setUnitCat(cat);
                  setUnitFrom(unitMap[cat][0]);
                  setUnitTo(unitMap[cat][1] || unitMap[cat][0]);
                }}
                className="w-full px-2.5 py-1.5 rounded-md bg-theme-surface border border-theme-border text-xs font-mono text-theme-text focus:border-theme-accent focus:outline-none"
              >
                {Object.keys(unitMap).map(k => (
                  <option key={k} value={k}>{k.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-secondary">Value</label>
              <input
                type="number"
                value={unitVal}
                onChange={(e) => setUnitVal(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md bg-theme-surface border border-theme-border font-mono text-xs sm:text-sm text-theme-text focus:border-theme-accent focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-secondary">From</label>
              <select
                value={unitFrom}
                onChange={(e) => setUnitFrom(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md bg-theme-surface border border-theme-border text-xs font-mono text-theme-text focus:border-theme-accent focus:outline-none"
              >
                {(unitMap[unitCat] || []).map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-secondary">To</label>
              <select
                value={unitTo}
                onChange={(e) => setUnitTo(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md bg-theme-surface border border-theme-border text-xs font-mono text-theme-text focus:border-theme-accent focus:outline-none"
              >
                {(unitMap[unitCat] || []).map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleUnitConvert}
            className="w-full py-2 rounded-md bg-theme-elevated hover:bg-theme-hover border border-theme-border text-theme-text font-medium text-xs transition-colors"
          >
            Convert
          </button>

          {unitResult && (
            <div className="p-2.5 rounded-md bg-theme-elevated border border-theme-border flex items-center justify-between">
              <span className="text-xs font-mono text-theme-secondary">Result:</span>
              <span className="font-mono font-medium text-sm text-theme-text">{unitResult.formatted}</span>
            </div>
          )}
        </div>

        {/* 3. Combinatorics (nCr / nPr) */}
        <div className="card-surface p-4 sm:p-5 flex flex-col gap-3">
          <span className="font-sans font-semibold text-theme-text text-sm">
            Combinatorics (nCr / nPr)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-secondary">n (Total)</label>
              <input
                type="number"
                min="0"
                value={combN}
                onChange={(e) => setCombN(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md bg-theme-surface border border-theme-border font-mono text-xs sm:text-sm text-theme-text focus:border-theme-accent focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-secondary">r (Sample)</label>
              <input
                type="number"
                min="0"
                value={combR}
                onChange={(e) => setCombR(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md bg-theme-surface border border-theme-border font-mono text-xs sm:text-sm text-theme-text focus:border-theme-accent focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-theme-secondary">Type</label>
              <select
                value={combOp}
                onChange={(e) => setCombOp(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md bg-theme-surface border border-theme-border text-xs font-mono text-theme-text focus:border-theme-accent focus:outline-none"
              >
                <option value="nCr">nCr</option>
                <option value="nPr">nPr</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleCombCalc}
            className="w-full py-2 rounded-md bg-theme-elevated hover:bg-theme-hover border border-theme-border text-theme-text font-medium text-xs transition-colors"
          >
            Compute
          </button>

          {combResult && (
            <div className="p-2.5 rounded-md bg-theme-elevated border border-theme-border flex items-center justify-between">
              <span className="text-xs font-mono text-theme-secondary">Output:</span>
              <span className="font-mono font-medium text-sm text-theme-text">{combResult.result?.value}</span>
            </div>
          )}
        </div>

        {/* 4. GCD & LCM */}
        <div className="card-surface p-4 sm:p-5 flex flex-col gap-3">
          <span className="font-sans font-semibold text-theme-text text-sm">
            Number Theory (GCD & LCM)
          </span>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-theme-secondary">Integers (comma-separated)</label>
            <input
              type="text"
              value={gcdNums}
              onChange={(e) => setGcdNums(e.target.value)}
              placeholder="e.g. 24, 36, 60"
              className="w-full px-3 py-2 rounded-md bg-theme-surface border border-theme-border font-mono text-xs sm:text-sm text-theme-text focus:border-theme-accent focus:outline-none"
            />
          </div>
          <button
            onClick={handleGcdCalc}
            className="w-full py-2 rounded-md bg-theme-elevated hover:bg-theme-hover border border-theme-border text-theme-text font-medium text-xs transition-colors"
          >
            Calculate
          </button>

          {gcdResult && (
            <div className="p-2.5 rounded-md bg-theme-elevated border border-theme-border flex items-center justify-between text-xs font-mono">
              <div>GCD: <span className="font-medium text-theme-text">{gcdResult.gcd}</span></div>
              <div>LCM: <span className="font-medium text-theme-text">{gcdResult.lcm}</span></div>
            </div>
          )}
        </div>

      </div>

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
    </div>
  );
};
