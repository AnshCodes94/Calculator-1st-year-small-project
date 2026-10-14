import sympy
import math
from app.services.parser import (
    safe_parse_expression,
    execute_with_timeout,
    format_result
)
from app.errors import (
    CalculatorException,
    DivisionByZeroException,
    DomainException,
    OverflowCalcException
)

def evaluate_basic_expression(expression: str, angle_mode: str = 'rad') -> dict:
    """Evaluates a standard mathematical/scientific expression."""
    def _compute():
        # Check for factorial over limits
        if '!' in expression or 'factorial' in expression:
            import re
            facts = re.findall(r'(\d+)!', expression) + re.findall(r'factorial\((\d+)\)', expression)
            for f in facts:
                if int(f) > 1000:
                    raise OverflowCalcException(
                        message=f"Factorial of {f} is too large to compute safely (max 1000).",
                        hint="Large factorials cause overflow. Use Stirling approximation or smaller numbers."
                    )

        parsed = safe_parse_expression(expression, angle_mode=angle_mode)

        # Check for domain / undefined
        if parsed.is_infinite or parsed == sympy.zoo or parsed == sympy.nan:
            if parsed == sympy.nan:
                raise DivisionByZeroException("Expression resulted in an indeterminate form (0/0 or inf/inf).", "Indeterminate form.")
            raise DivisionByZeroException()

        # Simplify
        simplified = sympy.simplify(parsed)
        formatted = format_result(simplified, angle_mode=angle_mode)

        steps = []
        # Generate basic steps if expression is compound
        steps.append({
            "title": "Input Expression",
            "latex": sympy.latex(parsed),
            "explanation": "Original mathematical formulation parsed and normalized."
        })
        if simplified != parsed:
            steps.append({
                "title": "Simplification",
                "latex": sympy.latex(simplified),
                "explanation": "Evaluated using algebraic rules and trigonometric identities."
            })
        if formatted.get("numeric") and formatted.get("is_approx"):
            steps.append({
                "title": "Numerical Approximation",
                "latex": f"\\approx {formatted['numeric']}",
                "explanation": "Evaluated to decimal floating-point precision."
            })

        return {
            "success": True,
            "result": formatted,
            "steps": steps,
            "angle_mode": angle_mode
        }

    return execute_with_timeout(_compute)

def compute_logarithm(x_str: str, base_str: str = 'e') -> dict:
    """Compute logarithm with arbitrary base log_b(x)."""
    def _compute():
        x_val = safe_parse_expression(x_str)
        if base_str.lower() in ('e', 'ln'):
            base_val = sympy.E
            log_expr = sympy.log(x_val)
            title = f"Natural Logarithm \\ln({sympy.latex(x_val)})"
        elif base_str in ('10', 'log10'):
            base_val = sympy.Integer(10)
            log_expr = sympy.log(x_val, 10)
            title = f"Common Logarithm \\log_{{10}}({sympy.latex(x_val)})"
        elif base_str in ('2', 'log2'):
            base_val = sympy.Integer(2)
            log_expr = sympy.log(x_val, 2)
            title = f"Binary Logarithm \\log_{{2}}({sympy.latex(x_val)})"
        else:
            base_val = safe_parse_expression(base_str)
            log_expr = sympy.log(x_val, base_val)
            title = f"Logarithm \\log_{{{sympy.latex(base_val)}}}({sympy.latex(x_val)})"

        # Check domain
        if x_val.is_number and (x_val <= 0):
            raise DomainException(
                message=f"Logarithm undefined for non-positive argument: {x_val}.",
                hint="The argument of a real logarithm must be strictly greater than zero (x > 0)."
            )
        if base_val.is_number and (base_val <= 0 or base_val == 1):
            raise DomainException(
                message=f"Invalid logarithm base: {base_val}.",
                hint="Logarithm base must be positive and not equal to 1."
            )

        simplified = sympy.simplify(log_expr)
        formatted = format_result(simplified)

        steps = [
            {
                "title": "Logarithm Definition",
                "latex": f"\\log_b(a) = \\frac{{\\ln(a)}}{{\\ln(b)}}",
                "explanation": "Change of base formula."
            },
            {
                "title": "Substituted Values",
                "latex": f"\\frac{{\\ln({sympy.latex(x_val)})}}{{\\ln({sympy.latex(base_val)})}}",
                "explanation": "Evaluating numerator and denominator."
            },
            {
                "title": "Final Value",
                "latex": formatted["latex"],
                "explanation": f"Numerical: {formatted['numeric']}" if formatted.get('numeric') else "Exact value"
            }
        ]

        return {
            "success": True,
            "result": formatted,
            "steps": steps
        }

    return execute_with_timeout(_compute)

def compute_antilog(x_str: str, base_str: str = 'e') -> dict:
    """Compute antilog b^x."""
    def _compute():
        x_val = safe_parse_expression(x_str)
        if base_str.lower() in ('e', 'exp'):
            expr = sympy.exp(x_val)
        elif base_str == '10':
            expr = 10**x_val
        elif base_str == '2':
            expr = 2**x_val
        else:
            base_val = safe_parse_expression(base_str)
            expr = base_val**x_val

        simplified = sympy.simplify(expr)
        formatted = format_result(simplified)
        return {
            "success": True,
            "result": formatted,
            "steps": [
                {
                    "title": "Antilog Formula",
                    "latex": f"b^x = {sympy.latex(expr)}",
                    "explanation": "Exponential function evaluation."
                },
                {
                    "title": "Result",
                    "latex": formatted["latex"],
                    "explanation": f"Numeric: {formatted.get('numeric', '')}"
                }
            ]
        }
    return execute_with_timeout(_compute)
