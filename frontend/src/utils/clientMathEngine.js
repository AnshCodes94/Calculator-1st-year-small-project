/**
 * CalcVerse Client-Side Mathematical Engine
 * Provides 100% offline standalone capability for Android APK and PWA mobile installs
 * without requiring any Python Flask server to be running.
 *
 * Backed by nerdamer (symbolic CAS in pure JS) — real differentiation, integration,
 * limits, Taylor series, equation solving, matrix algebra and complex analysis.
 */

import nerdamer from 'nerdamer';

// ==================== SMALL HELPERS ====================

const fmt = (exact, numeric = null, latex = null) => ({
  exact: String(exact),
  numeric: numeric !== null && numeric !== undefined ? String(numeric) : (latex ? null : String(exact)),
  latex: latex || String(exact),
  is_approx: String(exact).includes('.')
});

const toNumeric = (exprStr) => {
  try {
    const v = nerdamer(exprStr).evaluate();
    if (typeof v === 'number') return Number.isFinite(v) ? v : null;
    const s = v.toString().trim();
    // Exact fractions like "8/3" don't parse with parseFloat — divide explicitly
    const frac = s.match(/^(-?[\d.]+)\s*\/\s*(-?[\d.]+)$/);
    if (frac) {
      const num = parseFloat(frac[1]) / parseFloat(frac[2]);
      return Number.isFinite(num) ? num : null;
    }
    const num = parseFloat(s);
    return Number.isFinite(num) ? num : null;
  } catch (e) {
    return null;
  }
};

const evalText = (exprStr) => {
  // Evaluate symbolically (keeps exact fractions like 1/2 where possible), fall back to raw text
  try {
    return nerdamer(exprStr).evaluate().toString();
  } catch (e) {
    return nerdamer(exprStr).toString();
  }
};

const latexOf = (exprStr) => {
  try {
    return nerdamer.convertToTeX(exprStr);
  } catch (e) {
    return String(exprStr);
  }
};

const matrixToLatex = (grid) => {
  const rows = grid.map(r => r.join(' & ')).join(' \\\\ ');
  return `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
};

const parseSolutionsSet = (str) => {
  // nerdamer solve() returns "{2, -2}" or "{_n*pi}" etc.
  const inner = String(str).trim().replace(/^\{/, '').replace(/\}$/, '');
  if (!inner.trim()) return [];
  return inner.split(',').map(s => s.trim()).filter(Boolean);
};

const throwCalcError = (code, message, hint) => {
  throw { code, message, hint };
};

// ==================== BASIC & SCIENTIFIC ====================

// Helper: Factorial
const factorial = (n) => {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Factorial requires non-negative integer');
  if (n > 170) throw new Error('Arithmetic overflow for factorial');
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
};

// Helper: Combinations & Permutations
const nCr = (n, r) => {
  if (r < 0 || r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
};

const nPr = (n, r) => {
  if (r < 0 || r > n) return 0;
  return factorial(n) / factorial(n - r);
};

// Helper: GCD & LCM
const gcdTwo = (a, b) => (!b ? a : gcdTwo(b, a % b));
const lcmTwo = (a, b) => Math.abs(a * b) / gcdTwo(a, b);

// Evaluate standard expressions client-side
export const evaluateExpressionClient = (expr, angleMode = 'rad') => {
  if (!expr || !expr.trim()) {
    throw { code: 'EMPTY_INPUT', message: 'Expression is empty.', hint: 'Type a formula like 2 + 2 or sin(pi/4)' };
  }

  let clean = expr.trim();

  // Check brackets balance
  let balance = 0;
  for (const ch of clean) {
    if (ch === '(') balance++;
    if (ch === ')') balance--;
    if (balance < 0) {
      throw { code: 'UNBALANCED_BRACKETS', message: 'Unexpected closing bracket ")".', hint: 'Ensure matching opening brackets.' };
    }
  }
  if (balance !== 0) {
    throw { code: 'UNBALANCED_BRACKETS', message: 'Unclosed bracket detected.', hint: 'Add matching closing bracket ")".' };
  }

  // Handle factorial: replace 'x!' with factorial(x)
  clean = clean.replace(/(\d+(\.\d+)?)!/g, 'factorial($1)');

  // Handle nCr and nPr functions
  clean = clean.replace(/nCr\(\s*(\d+)\s*,\s*(\d+)\s*\)/g, 'nCr($1, $2)');
  clean = clean.replace(/nPr\(\s*(\d+)\s*,\s*(\d+)\s*\)/g, 'nPr($1, $2)');

  // Handle constants
  clean = clean.replace(/\bpi\b/gi, 'Math.PI');
  clean = clean.replace(/\be\b/g, 'Math.E');

  // Handle powers: replace '^' with '**'
  clean = clean.replace(/\^/g, '**');

  // Handle roots: sqrt and cbrt
  clean = clean.replace(/\bsqrt\(/gi, 'Math.sqrt(');
  clean = clean.replace(/\bcbrt\(/gi, 'Math.cbrt(');

  // Handle logarithms
  clean = clean.replace(/\bln\(/gi, 'Math.log(');
  clean = clean.replace(/\blog\(/gi, 'Math.log10(');
  clean = clean.replace(/\bexp\(/gi, 'Math.exp(');

  // Handle trig with angle mode
  const isDeg = angleMode === 'deg';
  const toRad = isDeg ? ' * (Math.PI / 180)' : '';
  const fromRad = isDeg ? ' * (180 / Math.PI)' : '';

  clean = clean.replace(/\basin\(([^)]+)\)/gi, `(Math.asin($1)${fromRad})`);
  clean = clean.replace(/\bacos\(([^)]+)\)/gi, `(Math.acos($1)${fromRad})`);
  clean = clean.replace(/\batan\(([^)]+)\)/gi, `(Math.atan($1)${fromRad})`);

  clean = clean.replace(/\bsin\(([^)]+)\)/gi, `Math.sin(($1)${toRad})`);
  clean = clean.replace(/\bcos\(([^)]+)\)/gi, `Math.cos(($1)${toRad})`);
  clean = clean.replace(/\btan\(([^)]+)\)/gi, `Math.tan(($1)${toRad})`);

  clean = clean.replace(/\bsinh\(/gi, 'Math.sinh(');
  clean = clean.replace(/\bcosh\(/gi, 'Math.cosh(');
  clean = clean.replace(/\btanh\(/gi, 'Math.tanh(');

  // Handle percentage (e.g., 50% -> (50/100))
  clean = clean.replace(/(\d+(\.\d+)?)%/g, '($1 / 100)');

  try {
    const fn = new Function('factorial', 'nCr', 'nPr', `return (${clean});`);
    const num = fn(factorial, nCr, nPr);

    if (num === Infinity || num === -Infinity) {
      throw { code: 'DIV_BY_ZERO', message: 'Division by zero or singularity.', hint: 'Check denominators in your expression.' };
    }
    if (Number.isNaN(num)) {
      throw { code: 'DOMAIN_ERROR', message: 'Mathematical domain error (NaN).', hint: 'e.g. sqrt of negative number or acos out of range.' };
    }

    // Format clean representation
    let formatted = String(num);
    if (Math.abs(num) < 1e-12 && Math.abs(num) > 0) formatted = '0';
    else if (Number.isInteger(num)) formatted = String(num);
    else formatted = parseFloat(num.toFixed(8)).toString();

    const steps = [
      {
        title: 'Input Analysis',
        latex: `\\text{Evaluate: } ${expr}`,
        explanation: `Angle mode configured as ${angleMode.toUpperCase()}.`
      },
      {
        title: 'Direct Computation',
        latex: `${expr} = ${formatted}`,
        explanation: 'Evaluated using high-precision IEEE-754 arithmetic.'
      }
    ];

    return {
      success: true,
      result: {
        exact: formatted,
        numeric: formatted,
        latex: formatted,
        is_approx: formatted.includes('.')
      },
      steps
    };
  } catch (err) {
    if (err.code) throw err;
    throw {
      code: 'SYNTAX_ERROR',
      message: 'Invalid mathematical expression syntax.',
      hint: 'Check operator placement and parentheses.'
    };
  }
};

// ==================== CALCULUS (nerdamer-backed) ====================

const taylorSeriesClient = (expression, variable, point, order) => {
  // f(x) ≈ Σ f^(k)(a)/k! * (x-a)^k  — derivatives via nerdamer diff + substitution
  const terms = [];
  let current = expression;
  let fact = 1;
  for (let k = 0; k <= order; k++) {
    if (k > 0) {
      current = `diff(${current}, ${variable})`;
      fact *= k;
    }
    const coefExact = evalText(`subst(${current}, ${variable}, ${point})`);
    const coefNum = toNumeric(coefExact);
    if (coefNum === null || Math.abs(coefNum) > 1e15) {
      throwCalcError('SERIES_ERROR', 'Taylor coefficients could not be computed at the given point.',
        'Check that the function is differentiable at the expansion point.');
    }
    let term;
    if (k === 0) term = coefExact;
    else if (k === 1) term = `(${coefExact})*(${variable}-${point})`;
    else term = `(${coefExact})*(${variable}-${point})^${k}`;
    if (coefExact !== '0') terms.push(term);
  }
  if (terms.length === 0) terms.push('0');
  const seriesStr = terms.join(' + ');
  return {
    series: seriesStr,
    latex: seriesStr
  };
};

export const evaluateCalculusClient = (endpoint, payload) => {
  try {
    if (endpoint.includes('differentiate')) {
      const { expression, variable = 'x', order = 1 } = payload;
      const parsedOrder = parseInt(order, 10);
      const n = Number.isNaN(parsedOrder) ? 1 : parsedOrder;
      if (n < 1 || n > 10) {
        throwCalcError('INVALID_ORDER', 'Derivative order must be an integer between 1 and 10.', 'Set order between 1 (first derivative) and 10.');
      }
      const derivative = evalText(`diff(${expression}, ${variable}, ${n})`);
      const numericAt1 = toNumeric(derivative);
      return {
        success: true,
        result: fmt(derivative, null, latexOf(derivative)),
        steps: [
          { title: 'Function to Differentiate', latex: `f(${variable}) = ${latexOf(expression)}`, explanation: `Differentiating with respect to ${variable} (order ${n}).` },
          { title: `Derivative (Order ${n})`, latex: `\\frac{d^{${n}}}{d${variable}^{${n}}} \\left[ ${latexOf(expression)} \\right] = ${latexOf(derivative)}`, explanation: 'Symbolic differentiation (power, product, chain rules).' }
        ],
        order: n,
        variable
      };
    }

    if (endpoint.includes('integrate')) {
      const { expression, variable = 'x', lower_limit, upper_limit } = payload;
      const isDefinite = lower_limit !== null && lower_limit !== undefined && String(lower_limit).trim() !== '' &&
                         upper_limit !== null && upper_limit !== undefined && String(upper_limit).trim() !== '';
      if (isDefinite) {
        const antideriv = evalText(`integrate(${expression}, ${variable})`);
        const atUpper = evalText(`subst(${antideriv}, ${variable}, ${upper_limit})`);
        const atLower = evalText(`subst(${antideriv}, ${variable}, ${lower_limit})`);
        const exactVal = evalText(`(${atUpper})-(${atLower})`);
        const numericVal = toNumeric(exactVal);
        return {
          success: true,
          result: fmt(exactVal, numericVal !== null ? parseFloat(numericVal.toFixed(8)) : null, latexOf(exactVal)),
          steps: [
            { title: 'Antiderivative', latex: `F(${variable}) = ${latexOf(antideriv)}`, explanation: 'Fundamental Theorem of Calculus: ∫ₐᵇ f = F(b) − F(a).' },
            { title: 'Evaluate Limits', latex: `F(${upper_limit}) - F(${lower_limit}) = ${latexOf(exactVal)}`, explanation: `Substituting upper limit ${upper_limit} and lower limit ${lower_limit}.` }
          ]
        };
      }
      const antideriv = evalText(`integrate(${expression}, ${variable})`);
      if (/^integrate\(/.test(String(antideriv))) {
        throwCalcError('NON_INTEGRABLE', 'No closed-form elementary antiderivative could be found.',
          'The integral may not be solvable with standard elementary functions.');
      }
      return {
        success: true,
        result: fmt(`${antideriv} + C`, null, `${latexOf(antideriv)} + C`),
        steps: [
          { title: 'Indefinite Integral', latex: `\\int ${latexOf(expression)} \\, d${variable} = ${latexOf(antideriv)} + C`, explanation: 'Antiderivative computed symbolically.' }
        ]
      };
    }

    if (endpoint.includes('limit')) {
      const { expression, variable = 'x', point = '0', direction = '+-' } = payload;
      let dirArg = '';
      if (direction === '+') dirArg = ', plus';
      else if (direction === '-') dirArg = ', minus';
      let limitVal = null;
      try {
        const res = evalText(`limit(${expression}, ${variable}, ${point}${dirArg})`);
        if (!/^limit\(/.test(String(res))) limitVal = res;
      } catch (e) { /* fall through to numeric */ }
      if (limitVal === null) {
        // Numeric fallback: approach point from the requested side(s)
        const eps = 1e-7;
        const f = nerdamer.buildFunction(expression, [variable]);
        const sideVal = (sign) => {
          const v = f(parseFloat(point) + sign * eps);
          return Number.isFinite(v) ? parseFloat(v.toFixed(6)) : null;
        };
        const plus = sideVal(+1);
        const minus = direction === '+' ? null : sideVal(-1);
        if (direction === '+') limitVal = plus;
        else if (direction === '-') limitVal = minus;
        else if (plus !== null && minus !== null && Math.abs(plus - minus) < 1e-4) limitVal = plus;
        else limitVal = `left: ${minus ?? '∞'}, right: ${plus ?? '∞'}`;
      }
      return {
        success: true,
        result: fmt(limitVal, null, latexOf(String(limitVal))),
        steps: [
          { title: 'Limit Evaluation', latex: `\\lim_{${variable} \\to ${point}} ${latexOf(expression)} = ${latexOf(String(limitVal))}`, explanation: `Direction: ${direction === '+-' ? 'both sides' : direction === '+' ? 'right (positive)' : 'left (negative)'}.` }
        ]
      };
    }

    if (endpoint.includes('series')) {
      const { expression, variable = 'x', point = '0', order = 4 } = payload;
      const parsedOrd = parseInt(order, 10);
      const ord = Number.isNaN(parsedOrd) ? 4 : parsedOrd;
      if (ord < 1 || ord > 15) {
        throwCalcError('INVALID_ORDER', 'Series order must be between 1 and 15.', 'Set order between 1 and 15.');
      }
      const { series, latex } = taylorSeriesClient(expression, variable, point, ord);
      return {
        success: true,
        result: fmt(series, null, latex),
        steps: [
          { title: 'Taylor Expansion', latex: `f(${variable}) = \\sum_{n=0}^{${ord}} \\frac{f^{(n)}(${point})}{n!} (${variable}-${point})^n`, explanation: `Polynomial expansion around ${variable} = ${point} up to order ${ord}.` },
          { title: 'Series Polynomial', latex: `f(${variable}) \\approx ${latex}`, explanation: 'Coefficients computed from successive derivatives evaluated at the center.' }
        ]
      };
    }
  } catch (err) {
    if (err && err.code) throw err;
    throwCalcError('CALC_ERROR', 'Computation failed: ' + (err && err.message ? err.message.slice(0, 100) : String(err).slice(0, 100)),
      'Verify the expression syntax and try again.');
  }
};

// ==================== ALGEBRA (nerdamer-backed) ====================

export const evaluateAlgebraClient = (endpoint, payload) => {
  try {
    if (endpoint.includes('solve-system')) {
      const eqs = payload.equations || [];
      if (!Array.isArray(eqs) || eqs.length === 0) {
        throwCalcError('EMPTY_SYSTEM', 'No equations provided.', 'Enter equations like x + y = 5.');
      }
      const listStr = '[' + eqs.join(', ') + ']';
      const res = evalText(`solveeqs(${listStr})`);
      // res looks like: [{x => 2, y => 1}] possibly with multiple solutions
      const solutions = [];
      const entryRe = /([A-Za-z_]\w*)\s*=>\s*([^,}\]]+)/g;
      const dictRe = /\{([^}]*)\}/g;
      let m;
      while ((m = dictRe.exec(res)) !== null) {
        const sol = {};
        let e2;
        while ((e2 = entryRe.exec(m[1])) !== null) {
          sol[e2[1]] = e2[2].trim();
        }
        if (Object.keys(sol).length > 0) solutions.push(sol);
      }
      if (solutions.length === 0) {
        throwCalcError('NO_SOLUTION', 'No solution found for the given system.', 'Check equations are consistent and linear/nonlinear properly formed.');
      }
      return {
        success: true,
        solutions: solutions.length === 1 ? solutions[0] : solutions,
        steps: [{ title: 'Linear System Solution', latex: '\\text{Solved via exact algebraic elimination}', explanation: `${eqs.length} equation(s) solved simultaneously.` }]
      };
    }

    if (endpoint.includes('solve')) {
      const { equation, variable = 'x' } = payload;
      const raw = evalText(`solve(${equation}, ${variable})`);
      const sols = parseSolutionsSet(raw);
      if (sols.length === 0) {
        throwCalcError('NO_SOLUTION', 'No closed-form solution found.', 'Try a different variable or check the equation.');
      }
      return {
        success: true,
        solutions: sols.map(s => {
          const num = toNumeric(s);
          return fmt(s, num !== null ? parseFloat(num.toFixed(8)) : null, latexOf(s));
        }),
        steps: [{ title: 'Root Extraction', latex: `${latexOf(equation)} \\implies ${variable} = ${sols.map(s => latexOf(s)).join(', \\; ')}`, explanation: `Exact solutions for variable ${variable}.` }]
      };
    }

    if (endpoint.includes('simplify')) {
      const out = evalText(`simplify(${payload.expression})`);
      return {
        success: true,
        result: fmt(out, null, latexOf(out)),
        steps: [{ title: 'Simplified Form', latex: `${latexOf(payload.expression)} = ${latexOf(out)}`, explanation: 'Algebraic simplification applied.' }]
      };
    }

    if (endpoint.includes('expand')) {
      const out = evalText(`expand(${payload.expression})`);
      return {
        success: true,
        result: fmt(out, null, latexOf(out)),
        steps: [{ title: 'Expanded Form', latex: `${latexOf(payload.expression)} = ${latexOf(out)}`, explanation: 'Distributive expansion applied.' }]
      };
    }

    if (endpoint.includes('factorize')) {
      const out = evalText(`factor(${payload.expression})`);
      return {
        success: true,
        result: fmt(out, null, latexOf(out)),
        steps: [{ title: 'Factored Form', latex: `${latexOf(payload.expression)} = ${latexOf(out)}`, explanation: 'Polynomial factorization applied.' }]
      };
    }
  } catch (err) {
    if (err && err.code) throw err;
    throwCalcError('ALGEBRA_ERROR', 'Algebra computation failed: ' + (err && err.message ? err.message.slice(0, 100) : String(err).slice(0, 100)),
      'Check equation format (e.g. x^2 - 4 = 0) and try again.');
  }
};

// ==================== MATRICES (nerdamer-backed) ====================

const toNerdamerMatrix = (grid) => {
  if (!Array.isArray(grid) || grid.length === 0 || !Array.isArray(grid[0])) {
    throwCalcError('INVALID_MATRIX', 'Matrix must be a non-empty 2D array.', 'Provide rows like [[1,2],[3,4]].');
  }
  const rows = grid.length;
  const cols = grid[0].length;
  for (const row of grid) {
    if (!Array.isArray(row) || row.length !== cols) {
      throwCalcError('RAGGED_MATRIX', 'All matrix rows must have equal length.', 'Ensure the matrix is rectangular.');
    }
  }
  return { rows, cols, expr: `matrix(${grid.map(r => `[${r.join(',')}]`).join(',')})` };
};

// Faddeev–LeVerrier: coefficients of det(λI − M) = λⁿ + c₁λⁿ⁻¹ + … + cₙ
const charPolyCoeffs = (M) => {
  const n = M.length;
  // A = I; each step: A = M·A,  c_k = -trace(A)/k,  then A = A + c_k·I
  let A = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  const coeffs = [1]; // c_0 = 1 (monic)
  for (let k = 1; k <= n; k++) {
    const MA = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let s = 0;
        for (let t = 0; t < n; t++) s += M[i][t] * A[t][j];
        MA[i][j] = s;
      }
    }
    let trace = 0;
    for (let i = 0; i < n; i++) trace += MA[i][i];
    const c_k = -trace / k;
    coeffs.push(c_k);
    for (let i = 0; i < n; i++) MA[i][i] += c_k;
    A = MA;
  }
  return coeffs; // monic, highest power first
};

// Durand–Kerner root finder for complex polynomial roots
const polyRoots = (coeffs) => {
  const n = coeffs.length - 1;
  if (n === 0) return [];
  const c = coeffs.map(v => [v, 0]);
  const evalPoly = (z) => {
    let r = [0, 0];
    for (const ck of c) {
      // r = r*z + ck
      r = [r[0] * z[0] - r[1] * z[1] + ck[0], r[0] * z[1] + r[1] * z[0] + ck[1]];
    }
    return r;
  };
  let roots = Array.from({ length: n }, (_, i) => {
    const ang = (2 * Math.PI * (i + 1)) / n;
    return [Math.cos(ang) * 0.4 + 0.4, Math.sin(ang) * 0.4 + 0.1];
  });
  for (let iter = 0; iter < 500; iter++) {
    let maxDelta = 0;
    for (let i = 0; i < n; i++) {
      let denom = [1, 0];
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const dz = [roots[i][0] - roots[j][0], roots[i][1] - roots[j][1]];
        denom = [denom[0] * dz[0] - denom[1] * dz[1], denom[0] * dz[1] + denom[1] * dz[0]];
      }
      const f = evalPoly(roots[i]);
      // delta = f / denom  (complex division: f * conj(denom) / |denom|^2)
      const dNorm = denom[0] * denom[0] + denom[1] * denom[1];
      const delta = [(f[0] * denom[0] + f[1] * denom[1]) / dNorm, (f[1] * denom[0] - f[0] * denom[1]) / dNorm];
      roots[i] = [roots[i][0] - delta[0], roots[i][1] - delta[1]];
      maxDelta = Math.max(maxDelta, Math.abs(delta[0]), Math.abs(delta[1]));
    }
    if (maxDelta < 1e-14) break;
  }
  return roots;
};

const eigenvaluesOf = (grid) => {
  const n = grid.length;
  const coeffs = charPolyCoeffs(grid);
  const roots = polyRoots(coeffs);
  // Clean tiny values, cluster multiplicities
  const cleaned = roots.map(([re, im]) => [
    Math.abs(re) < 1e-9 ? 0 : re,
    Math.abs(im) < 1e-9 ? 0 : im
  ]);
  const clustered = [];
  for (const root of cleaned) {
    const existing = clustered.find(e => Math.abs(e.re - root[0]) < 1e-7 && Math.abs(e.im - root[1]) < 1e-7);
    if (existing) existing.mult += 1;
    else clustered.push({ re: root[0], im: root[1], mult: 1 });
  }
  return clustered.map(({ re, im, mult }) => {
    const reR = parseFloat(re.toFixed(6));
    const imR = parseFloat(im.toFixed(6));
    const value = Math.abs(imR) < 1e-6 ? String(reR) : `${reR} + ${imR}i`;
    return { value, latex: value.replace(/i$/, 'i'), numeric: value, multiplicity: mult };
  });
};

export const evaluateMatrixClient = (endpoint, payload) => {
  try {
    if (endpoint.includes('eigen')) {
      const { matrix } = payload;
      const { rows, cols } = toNerdamerMatrix(matrix);
      if (rows !== cols) {
        throwCalcError('DIM_MISMATCH', `Eigenvalue analysis requires a square matrix. Given matrix is ${rows}x${cols}.`, 'Ensure row count equals column count.');
      }
      const eigenvalues = eigenvaluesOf(matrix.map(r => r.map(v => parseFloat(v))));
      return {
        success: true,
        eigenvalues,
        steps: [
          { title: 'Characteristic Polynomial', latex: `p(\\lambda) = \\det(A - \\lambda I) = 0`, explanation: 'Eigenvalues are roots of the characteristic equation.' },
          { title: 'Eigenvalues', latex: eigenvalues.map(v => `\\lambda = ${v.value} \\; (\\text{mult: } ${v.multiplicity})`).join(', \\quad '), explanation: `Found ${eigenvalues.length} distinct eigenvalue(s).` }
        ]
      };
    }

    if (endpoint.includes('determinant')) {
      const { expr } = toNerdamerMatrix(payload.matrix);
      const det = evalText(`determinant(${expr})`);
      const detNum = toNumeric(det);
      return {
        success: true,
        result: fmt(det, detNum !== null ? parseFloat(detNum.toFixed(8)) : null, latexOf(det)),
        steps: [{ title: 'Determinant', latex: `\\det(A) = ${latexOf(det)}`, explanation: 'Computed via exact cofactor/LU expansion.' }]
      };
    }

    if (endpoint.includes('inverse')) {
      const { expr, rows } = toNerdamerMatrix(payload.matrix);
      let inv;
      try {
        inv = evalText(`invert(${expr})`);
      } catch (e) {
        throwCalcError('SINGULAR_MATRIX', 'Matrix is singular and cannot be inverted.', 'Determinant is 0 — the inverse does not exist.');
      }
      if (/^invert\(/.test(String(inv))) {
        throwCalcError('SINGULAR_MATRIX', 'Matrix is singular and cannot be inverted.', 'Determinant is 0 — the inverse does not exist.');
      }
      // Parse "matrix([a, b], [c, d])" back into grid
      const grid = [];
      const rowRe = /\[([^\]]*)\]/g;
      let m;
      while ((m = rowRe.exec(inv)) !== null) {
        grid.push(m[1].split(',').map(s => s.trim()));
      }
      return {
        success: true,
        result: { latex: matrixToLatex(grid), grid },
        steps: [{ title: 'Matrix Inverse', latex: `A^{-1} = ${matrixToLatex(grid)}`, explanation: 'Computed via exact Gaussian inversion.' }]
      };
    }

    if (endpoint.includes('transpose')) {
      const { rows, cols } = toNerdamerMatrix(payload.matrix);
      const grid = [];
      for (let c = 0; c < cols; c++) {
        const row = [];
        for (let r = 0; r < rows; r++) row.push(payload.matrix[r][c]);
        grid.push(row);
      }
      return {
        success: true,
        result: { latex: matrixToLatex(grid), grid },
        steps: [{ title: 'Transposed Matrix', latex: `A^T = ${matrixToLatex(grid)}`, explanation: `Swapped rows and columns (dimensions: ${rows}x${cols} -> ${cols}x${rows}).` }]
      };
    }

    if (endpoint.includes('multiply')) {
      const A = toNerdamerMatrix(payload.matrix_a);
      const B = toNerdamerMatrix(payload.matrix_b);
      if (A.cols !== B.rows) {
        throwCalcError('DIM_MISMATCH', `Dimension mismatch: Matrix A is ${A.rows}x${A.cols} but Matrix B is ${B.rows}x${B.cols}.`,
          `To multiply A x B, columns of A (${A.cols}) must equal rows of B (${B.rows}).`);
      }
      const prod = evalText(`${A.expr}*${B.expr}`);
      const grid = [];
      const rowRe = /\[([^\]]*)\]/g;
      let m;
      while ((m = rowRe.exec(prod)) !== null) {
        grid.push(m[1].split(',').map(s => s.trim()));
      }
      return {
        success: true,
        result: { latex: matrixToLatex(grid), grid },
        steps: [{ title: 'Product Matrix', latex: `A \\times B = ${matrixToLatex(grid)}`, explanation: `Row by column dot product. Dimensions: ${A.rows} x ${B.cols}.` }]
      };
    }
  } catch (err) {
    if (err && err.code) throw err;
    throwCalcError('MATRIX_ERROR', 'Matrix computation failed: ' + (err && err.message ? err.message.slice(0, 100) : String(err).slice(0, 100)),
      'Check the matrix entries are numeric and dimensions valid.');
  }
};

// ==================== COMPLEX NUMBERS (nerdamer-backed) ====================

export const evaluateComplexClient = (payload) => {
  try {
    const { expression = '' } = payload;
    if (!expression.trim()) {
      throwCalcError('EMPTY_INPUT', 'Expression is empty.', 'Enter a complex expression like (2+3i)*(1-i).');
    }
    const re = evalText(`realpart(${expression})`);
    const im = evalText(`imagpart(${expression})`);
    const mod = evalText(`abs(${expression})`);
    const argRad = evalText(`arg(${expression})`);
    const conj = evalText(`conjugate(${expression})`);
    const reNum = toNumeric(re);
    const imNum = toNumeric(im);
    const modNum = toNumeric(mod);
    const argNum = toNumeric(argRad);
    const argDegNum = argNum !== null ? parseFloat((argNum * 180 / Math.PI).toFixed(6)) : null;
    const polarLatex = `${latexOf(mod)} \\, e^{i (${latexOf(String(argRad))})}`;

    return {
      success: true,
      result: {
        latex: latexOf(expression),
        real: fmt(re, reNum !== null ? parseFloat(reNum.toFixed(8)) : null),
        imag: fmt(im, imNum !== null ? parseFloat(imNum.toFixed(8)) : null),
        modulus: fmt(mod, modNum !== null ? parseFloat(modNum.toFixed(8)) : null),
        argument_rad: fmt(argRad, argNum !== null ? parseFloat(argNum.toFixed(8)) : null),
        argument_deg: argDegNum !== null ? fmt(argDegNum.toFixed(6), argDegNum) : fmt('\\text{undefined}'),
        conjugate: fmt(conj, null, latexOf(conj)),
        polar_latex: polarLatex
      },
      steps: [
        { title: 'Standard Form z = a + bi', latex: `z = ${latexOf(re)} + (${latexOf(im)}) i`, explanation: `Real part Re(z) = ${latexOf(re)}, Imaginary part Im(z) = ${latexOf(im)}.` },
        { title: 'Modulus |z|', latex: `|z| = ${latexOf(mod)}`, explanation: 'Magnitude/distance from origin.' },
        { title: 'Argument Arg(z)', latex: `\\theta = ${latexOf(String(argRad))} \\; \\text{rad} \\; (${argDegNum !== null ? argDegNum : '—'}^\\circ)`, explanation: 'Principal phase angle in the complex plane.' },
        { title: 'Complex Conjugate z*', latex: `\\overline{z} = ${latexOf(conj)}`, explanation: 'Reflection across the real axis.' }
      ]
    };
  } catch (err) {
    if (err && err.code) throw err;
    throwCalcError('COMPLEX_ERROR', 'Complex evaluation failed: ' + (err && err.message ? err.message.slice(0, 100) : String(err).slice(0, 100)),
      'Use i for the imaginary unit, e.g. (2+3i)*(1-i).');
  }
};

// ==================== GRAPH PLOTTER ====================

export const evaluatePlotClient = (payload) => {
  const { functions = [], x_min = -10, x_max = 10, num_points = 500 } = payload;
  const step = (x_max - x_min) / num_points;
  const traces = [];

  for (const fnStr of functions) {
    if (!fnStr || !fnStr.trim()) continue;
    const xVals = [];
    const yVals = [];

    let evalFn;
    try {
      // nerdamer compiles the full symbolic expression (sin, cos, ln, sqrt, pi, e, etc.)
      evalFn = nerdamer.buildFunction(fnStr, ['x']);
    } catch (e) {
      continue;
    }

    for (let i = 0; i <= num_points; i++) {
      const x = x_min + i * step;
      let y;
      try {
        y = evalFn(x);
      } catch (e) {
        y = null;
      }
      if (typeof y !== 'number' || isNaN(y) || Math.abs(y) > 1e6) {
        y = null;
      }
      xVals.push(x);
      yVals.push(y);
    }

    traces.push({
      name: fnStr,
      x: xVals,
      y: yVals
    });
  }

  return {
    success: true,
    x_min,
    x_max,
    traces
  };
};

// ==================== EXTRAS ====================

const UNIT_FACTORS = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  mass: { kg: 1, g: 0.001, mg: 1e-6, lb: 0.45359237, oz: 0.028349523125, tonne: 1000 },
  speed: { mps: 1, kph: 1 / 3.6, mph: 0.44704, knot: 0.514444, fps: 0.3048 },
  angle: { deg: Math.PI / 180, rad: 1, grad: Math.PI / 200, arcmin: Math.PI / 10800, arcsec: Math.PI / 648000 },
  energy: { J: 1, kJ: 1000, cal: 4.184, kcal: 4184, kWh: 3.6e6, eV: 1.602176634e-19 },
  pressure: { Pa: 1, kPa: 1000, bar: 1e5, psi: 6894.75729, atm: 101325, mmHg: 133.3223684 }
};

export const evaluateExtrasClient = (endpoint, payload) => {
  if (endpoint.includes('base-convert')) {
    const { value, from_base, to_base } = payload;
    const baseMap = { bin: 2, oct: 8, dec: 10, hex: 16 };
    const num = parseInt(String(value).trim(), baseMap[from_base] || 10);
    if (isNaN(num)) throw { code: 'INVALID_BASE', message: 'Cannot parse number in base ' + from_base, hint: 'Check characters.' };
    return { success: true, converted: num.toString(baseMap[to_base] || 16).toUpperCase() };
  }

  if (endpoint.includes('unit-convert')) {
    const { value, category, from_unit, to_unit } = payload;
    let converted = value;
    if (category === 'temperature') {
      if (from_unit === 'C' && to_unit === 'F') converted = (value * 9 / 5) + 32;
      else if (from_unit === 'F' && to_unit === 'C') converted = (value - 32) * 5 / 9;
      else if (from_unit === 'C' && to_unit === 'K') converted = value + 273.15;
      else if (from_unit === 'K' && to_unit === 'C') converted = value - 273.15;
      else if (from_unit === 'F' && to_unit === 'K') converted = (value - 32) * 5 / 9 + 273.15;
      else if (from_unit === 'K' && to_unit === 'F') converted = (value - 273.15) * 9 / 5 + 32;
    } else {
      const table = UNIT_FACTORS[category];
      if (!table || table[from_unit] === undefined || table[to_unit] === undefined) {
        throw { code: 'BAD_UNIT', message: `Unit not supported for category ${category}.`, hint: 'Pick units from the dropdown list.' };
      }
      const base = value * table[from_unit];
      converted = base / table[to_unit];
    }
    return { success: true, formatted: `${parseFloat(converted.toFixed(6))} ${to_unit}` };
  }

  if (endpoint.includes('combinatorics')) {
    const { n, r, operation } = payload;
    const val = operation === 'nPr' ? nPr(n, r) : nCr(n, r);
    return { success: true, result: { value: String(val) } };
  }

  if (endpoint.includes('gcd-lcm')) {
    const numbers = (payload.numbers || []).map(Number).filter(n => !isNaN(n));
    if (numbers.length === 0) throw { code: 'EMPTY_NUMS', message: 'Provide numbers for GCD/LCM', hint: 'e.g. 24, 36, 60' };
    const gcd = numbers.reduce((acc, val) => gcdTwo(acc, val));
    const lcm = numbers.reduce((acc, val) => lcmTwo(acc, val));
    return { success: true, gcd, lcm };
  }
};
