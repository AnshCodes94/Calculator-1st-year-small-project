import numpy as np
import sympy
from app.services.parser import (
    safe_parse_expression,
    execute_with_timeout
)
from app.errors import (
    CalculatorException,
    DomainException,
    InputValidationException
)

def generate_plot_data(functions: list, x_min: float = -10.0, x_max: float = 10.0, num_points: int = 500) -> dict:
    """Generate x and y coordinates for multiple mathematical functions with asymptote filtering."""
    def _compute():
        if not functions or len(functions) == 0:
            raise InputValidationException(
                code="EMPTY_INPUT",
                message="No function expression provided for plotting.",
                hint="Provide at least one function of x, such as 'sin(x)' or 'x^2 - 4'."
            )

        if len(functions) > 6:
            raise InputValidationException(
                code="TOO_MANY_FUNCTIONS",
                message="Maximum 6 functions can be plotted simultaneously.",
                hint="Remove some functions to stay within the limit."
            )

        try:
            x_start = float(x_min)
            x_end = float(x_max)
        except (ValueError, TypeError):
            raise InputValidationException(
                code="INVALID_RANGE",
                message="Plot domain limits x_min and x_max must be numbers.",
                hint="Use numeric bounds such as x_min = -10, x_max = 10."
            )

        if x_start >= x_end:
            raise InputValidationException(
                code="INVALID_RANGE",
                message="x_min must be strictly less than x_max.",
                hint="Ensure x_min < x_max."
            )

        # Generate equidistant x points
        pts = max(100, min(int(num_points), 1000))
        x_vals = np.linspace(x_start, x_end, pts)

        x_sym = sympy.Symbol('x')
        traces = []

        colors = ['#38bdf8', '#f43f5e', '#10b981', '#a855f7', '#fbbf24', '#ec4899']

        for idx, func_str in enumerate(functions):
            f_clean = func_str.strip()
            if not f_clean:
                continue

            expr = safe_parse_expression(f_clean)
            func_latex = sympy.latex(expr)

            # Use SymPy lambdify for fast numpy vector evaluation
            try:
                # Use numpy modules safely
                f_numpy = sympy.lambdify(x_sym, expr, modules=['numpy', {'cot': lambda v: 1/np.tan(v), 'sec': lambda v: 1/np.cos(v), 'csc': lambda v: 1/np.sin(v)}])
                raw_y = f_numpy(x_vals)

                # If returns a scalar constant (e.g. f(x) = 5)
                if np.isscalar(raw_y):
                    raw_y = np.full_like(x_vals, float(raw_y))
                else:
                    raw_y = np.asarray(raw_y, dtype=float)

            except Exception:
                # Fallback to point-by-point safe evaluation
                raw_y = []
                for xv in x_vals:
                    try:
                        val = complex(expr.subs(x_sym, xv).evalf())
                        if abs(val.imag) > 1e-6:
                            raw_y.append(np.nan)
                        else:
                            raw_y.append(val.real)
                    except Exception:
                        raw_y.append(np.nan)
                raw_y = np.array(raw_y, dtype=float)

            # Discontinuity and asymptote detection (e.g. tan(x), 1/x)
            # Insert NaNs where derivative jumps excessively or value is infinite
            clean_y = []
            for i in range(len(raw_y)):
                y_val = raw_y[i]
                if np.isnan(y_val) or np.isinf(y_val) or abs(y_val) > 1e6:
                    clean_y.append(None)
                else:
                    # Check for huge slope jump across neighboring point
                    if i > 0 and clean_y[-1] is not None:
                        prev_y = clean_y[-1]
                        if abs(y_val - prev_y) > 50.0 and (y_val * prev_y < 0):
                            clean_y.append(None)
                    clean_y.append(float(y_val))

            traces.append({
                "name": f"f_{{{idx+1}}}(x) = {func_str}",
                "latex": f"f_{{{idx+1}}}(x) = {func_latex}",
                "x": x_vals.tolist(),
                "y": clean_y,
                "color": colors[idx % len(colors)]
            })

        return {
            "success": True,
            "traces": traces,
            "x_min": x_start,
            "x_max": x_end
        }

    return execute_with_timeout(_compute)
