import sympy
from app.services.parser import (
    safe_parse_expression,
    execute_with_timeout,
    format_result
)
from app.errors import (
    CalculatorException,
    NonIntegrableException,
    LimitUndefinedException,
    DivisionByZeroException,
    DomainException
)
from app.config import Config

def differentiate(expr_str: str, var_str: str = 'x', order: int = 1) -> dict:
    """Compute symbolic nth-order and partial derivatives with detailed steps."""
    def _compute():
        expr = safe_parse_expression(expr_str)
        var = sympy.Symbol(var_str.strip())
        n = int(order)

        if n < 1 or n > 10:
            raise CalculatorException(
                code="INVALID_ORDER",
                message="Derivative order must be an integer between 1 and 10.",
                hint="Set order between 1 (first derivative) and 10."
            )

        steps = []
        steps.append({
            "title": "Function to Differentiate",
            "latex": f"f({var}) = {sympy.latex(expr)}",
            "explanation": f"Differentiating with respect to {var} (order {n})."
        })

        current_expr = expr
        intermediate_derivs = []

        for k in range(1, n + 1):
            next_expr = sympy.diff(current_expr, var)
            simplified_deriv = sympy.simplify(next_expr)
            intermediate_derivs.append(simplified_deriv)

            order_symbol = f"f^{{({k})}}({var})" if k > 3 else ("f'(" + str(var) + ")" if k == 1 else ("f''(" + str(var) + ")" if k == 2 else "f'''(" + str(var) + ")"))
            
            # Step explanation
            explanation = f"Step {k}: Differentiate with respect to {var}."
            if k == 1:
                if expr.is_Add:
                    explanation += " Applied Sum Rule: (u + v)' = u' + v'."
                elif expr.is_Mul:
                    explanation += " Applied Product Rule: (u * v)' = u'v + uv'."
                elif expr.is_Pow:
                    explanation += " Applied Power / Exponential Rule."

            steps.append({
                "title": f"Derivative (Order {k})",
                "latex": f"\\frac{{d^{{{k}}}}}{{d {var}^{{{k}}}}} \\left[ {sympy.latex(expr)} \\right] = {sympy.latex(simplified_deriv)}",
                "explanation": explanation
            })
            current_expr = simplified_deriv

        final_res = format_result(current_expr)

        return {
            "success": True,
            "result": final_res,
            "steps": steps,
            "order": n,
            "variable": str(var)
        }

    return execute_with_timeout(_compute)

def integrate_expr(expr_str: str, var_str: str = 'x', lower_limit: str = None, upper_limit: str = None) -> dict:
    """Compute symbolic indefinite or definite integral with steps."""
    def _compute():
        expr = safe_parse_expression(expr_str)
        var = sympy.Symbol(var_str.strip())
        is_definite = (lower_limit is not None and str(lower_limit).strip() != "") and \
                      (upper_limit is not None and str(upper_limit).strip() != "")

        steps = []

        if not is_definite:
            # Indefinite Integral
            steps.append({
                "title": "Indefinite Integral Setup",
                "latex": f"\\int {sympy.latex(expr)} \\, d{var}",
                "explanation": f"Integrating {sympy.latex(expr)} with respect to {var}."
            })

            anti_deriv = sympy.integrate(expr, var)

            # Check if SymPy could not integrate symbolically
            if isinstance(anti_deriv, sympy.Integral):
                raise NonIntegrableException(
                    message="No closed-form elementary antiderivative could be found.",
                    hint="The integral may not be solvable with standard elementary functions."
                )

            simplified_anti = sympy.simplify(anti_deriv)
            res_latex = f"{sympy.latex(simplified_anti)} + C"

            steps.append({
                "title": "Antiderivative",
                "latex": f"F({var}) = {sympy.latex(simplified_anti)}",
                "explanation": "Calculated the symbolic antiderivative using integration techniques."
            })
            steps.append({
                "title": "Constant of Integration",
                "latex": res_latex,
                "explanation": "Added arbitrary constant C for indefinite integral."
            })

            return {
                "success": True,
                "result": {
                    "exact": f"{str(simplified_anti)} + C",
                    "latex": res_latex,
                    "numeric": None,
                    "is_approx": False
                },
                "steps": steps,
                "is_definite": False
            }

        else:
            # Definite Integral
            a_sym = safe_parse_expression(str(lower_limit))
            b_sym = safe_parse_expression(str(upper_limit))

            steps.append({
                "title": "Definite Integral Setup",
                "latex": f"\\int_{{{sympy.latex(a_sym)}}}^{{{sympy.latex(b_sym)}}} {sympy.latex(expr)} \\, d{var}",
                "explanation": f"Evaluating bounded integral from {var} = {sympy.latex(a_sym)} to {var} = {sympy.latex(b_sym)}."
            })

            # Calculate antiderivative first
            anti_deriv = sympy.integrate(expr, var)
            if not isinstance(anti_deriv, sympy.Integral):
                steps.append({
                    "title": "Fundamental Theorem of Calculus (Antiderivative)",
                    "latex": f"F({var}) = \\int {sympy.latex(expr)} \\, d{var} = {sympy.latex(anti_deriv)}",
                    "explanation": f"By the Fundamental Theorem: \\int_a^b f(x)dx = F(b) - F(a)."
                })

            # Definite evaluation
            try:
                def_result = sympy.integrate(expr, (var, a_sym, b_sym))
            except Exception as e:
                raise NonIntegrableException(
                    message=f"Could not compute definite integral: {str(e)}",
                    hint="Verify that the integrand is continuous and bounded over the interval."
                )

            if isinstance(def_result, sympy.Integral) or def_result == sympy.nan or def_result == sympy.zoo:
                raise NonIntegrableException(
                    message="Integral diverges or does not converge to a finite value.",
                    hint="Check for vertical asymptotes or non-integrable singularities within the bounds."
                )

            simplified_val = sympy.simplify(def_result)
            formatted = format_result(simplified_val)

            steps.append({
                "title": "Boundary Substitution",
                "latex": f"\\left[ {sympy.latex(anti_deriv)} \\right]_{{{sympy.latex(a_sym)}}}^{{{sympy.latex(b_sym)}}} = {formatted['latex']}",
                "explanation": "Substituted upper and lower limits and simplified."
            })

            return {
                "success": True,
                "result": formatted,
                "steps": steps,
                "is_definite": True
            }

    return execute_with_timeout(_compute)

def compute_limit(expr_str: str, var_str: str = 'x', point_str: str = '0', direction: str = '+-') -> dict:
    """Compute symbolic limit with one-sided support and steps."""
    def _compute():
        expr = safe_parse_expression(expr_str)
        var = sympy.Symbol(var_str.strip())
        point = safe_parse_expression(point_str)

        dir_clean = direction.strip()
        dir_arg = '+-'
        dir_symbol = ""
        if dir_clean in ('+', 'right', '1'):
            dir_arg = '+'
            dir_symbol = "^+"
        elif dir_clean in ('-', 'left', '-1'):
            dir_arg = '-'
            dir_symbol = "^-"

        steps = []
        limit_latex_header = f"\\lim_{{{var} \\to {sympy.latex(point)}{dir_symbol}}} \\left( {sympy.latex(expr)} \\right)"
        steps.append({
            "title": "Limit Formulation",
            "latex": limit_latex_header,
            "explanation": f"Evaluating limit as {var} approaches {point_str}{' from the right' if dir_arg == '+' else (' from the left' if dir_arg == '-' else '')}."
        })

        # Try direct substitution to see if indeterminate
        try:
            direct_sub = expr.subs(var, point)
            if direct_sub.is_finite and not (direct_sub == sympy.nan or direct_sub == sympy.zoo):
                steps.append({
                    "title": "Direct Substitution",
                    "latex": f"f({sympy.latex(point)}) = {sympy.latex(direct_sub)}",
                    "explanation": "Direct substitution yields a determinate finite value."
                })
            else:
                steps.append({
                    "title": "Indeterminate Form Detected",
                    "latex": f"\\text{{Direct substitution yields }} {sympy.latex(direct_sub)}",
                    "explanation": "Requires limit techniques such as L'Hôpital's Rule or Taylor series expansion."
                })
        except Exception:
            pass

        try:
            lim_val = sympy.limit(expr, var, point, dir=dir_arg)
        except Exception as e:
            raise LimitUndefinedException(
                message=f"Limit calculation failed: {str(e)}",
                hint="Check if the limit oscillates (e.g. sin(1/x) at 0) or is undefined."
            )

        if lim_val == sympy.nan or isinstance(lim_val, sympy.Limit):
            raise LimitUndefinedException(
                message="The limit does not exist (left-hand and right-hand limits differ or oscillate).",
                hint="Try computing one-sided limits from the left (-) or right (+)."
            )

        formatted = format_result(lim_val)

        steps.append({
            "title": "Calculated Limit Value",
            "latex": f"{limit_latex_header} = {formatted['latex']}",
            "explanation": f"Result: {formatted['exact']}" + (f" (≈ {formatted['numeric']})" if formatted.get('numeric') else "")
        })

        return {
            "success": True,
            "result": formatted,
            "steps": steps,
            "direction": dir_arg
        }

    return execute_with_timeout(_compute)

def taylor_series(expr_str: str, var_str: str = 'x', point_str: str = '0', order: int = 4) -> dict:
    """Compute Taylor / Maclaurin series expansion with step-by-step derivative table."""
    def _compute():
        expr = safe_parse_expression(expr_str)
        var = sympy.Symbol(var_str.strip())
        x0 = safe_parse_expression(point_str)
        n = int(order)

        if n < 1 or n > Config.MAX_SERIES_ORDER:
            raise CalculatorException(
                code="INVALID_ORDER",
                message=f"Series order must be between 1 and {Config.MAX_SERIES_ORDER}.",
                hint=f"Choose an expansion degree between 1 and {Config.MAX_SERIES_ORDER}."
            )

        is_maclaurin = (x0 == 0)
        series_name = "Maclaurin Series (around x=0)" if is_maclaurin else f"Taylor Series (around {var} = {x0})"

        steps = []
        steps.append({
            "title": "Expansion Formula",
            "latex": f"\\sum_{{k=0}}^{{{n}}} \\frac{{f^{{(k)}}({sympy.latex(x0)})}}{{k!}} ({var} - {sympy.latex(x0)})^k + \\mathcal{{O}}(({var} - {sympy.latex(x0)})^{{{n+1}}})",
            "explanation": f"Standard formula for {series_name} of order {n}."
        })

        # Generate each derivative at x0
        curr_deriv = expr
        terms = []
        deriv_table_latex = []

        for k in range(0, n + 1):
            if k == 0:
                val_at_x0 = curr_deriv.subs(var, x0)
            else:
                curr_deriv = sympy.diff(curr_deriv, var)
                val_at_x0 = curr_deriv.subs(var, x0)

            fact_k = sympy.factorial(k)
            term_coeff = sympy.simplify(val_at_x0 / fact_k)
            power_term = (var - x0)**k
            term_expr = term_coeff * power_term

            if val_at_x0 != 0:
                terms.append(term_expr)

            deriv_table_latex.append(
                f"k={k}: f^{{({k})}}({sympy.latex(x0)}) = {sympy.latex(val_at_x0)} \\implies \\text{{Term}} = {sympy.latex(term_expr)}"
            )

        steps.append({
            "title": "Derivative Evaluations",
            "latex": " \\\\ ".join(deriv_table_latex[:5]),
            "explanation": f"Evaluated derivatives at {var} = {sympy.latex(x0)}."
        })

        # Polynomial sum
        poly_sum = sum(terms) if terms else sympy.Integer(0)
        simplified_poly = sympy.simplify(poly_sum)

        series_with_O = sympy.series(expr, var, x0, n + 1)
        formatted = format_result(simplified_poly)

        steps.append({
            "title": "Assembled Polynomial",
            "latex": f"P_{{{n}}}({var}) = {formatted['latex']}",
            "explanation": f"Truncated Taylor polynomial of degree {n}."
        })

        return {
            "success": True,
            "result": {
                "exact": str(simplified_poly),
                "latex": formatted["latex"],
                "series_with_order": sympy.latex(series_with_O),
                "numeric": formatted.get("numeric")
            },
            "steps": steps,
            "order": n,
            "center": str(x0)
        }

    return execute_with_timeout(_compute)
