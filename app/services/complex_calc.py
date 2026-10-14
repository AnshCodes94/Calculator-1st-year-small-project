import sympy
import math
from app.services.parser import (
    safe_parse_expression,
    execute_with_timeout,
    format_result
)
from app.errors import (
    CalculatorException,
    DivisionByZeroException
)

def evaluate_complex(expr_str: str) -> dict:
    """Analyze a complex number or expression: real, imag, mod, arg, conjugate, and polar form."""
    def _compute():
        expr = safe_parse_expression(expr_str)
        evaluated = sympy.simplify(expr)

        # Separate real and imaginary components
        re_part = sympy.re(evaluated)
        im_part = sympy.im(evaluated)

        re_simp = sympy.simplify(re_part)
        im_simp = sympy.simplify(im_part)

        # Modulus |z| = sqrt(re^2 + im^2)
        mod_val = sympy.simplify(sympy.Abs(evaluated))
        # Argument in radians
        arg_rad = sympy.simplify(sympy.arg(evaluated))
        # Argument in degrees
        arg_deg = sympy.simplify(arg_rad * 180 / sympy.pi)

        # Complex conjugate
        conj_val = sympy.simplify(sympy.conjugate(evaluated))

        # Format components
        re_fmt = format_result(re_simp)
        im_fmt = format_result(im_simp)
        mod_fmt = format_result(mod_val)
        arg_fmt = format_result(arg_rad)
        arg_deg_fmt = format_result(arg_deg)
        conj_fmt = format_result(conj_val)

        # Polar form: r * exp(i * theta)
        polar_latex = f"{mod_fmt['latex']} \\, e^{{i ({arg_fmt['latex']})}}"

        steps = [
            {
                "title": "Standard Form z = a + bi",
                "latex": f"z = {re_fmt['latex']} + ({im_fmt['latex']}) i",
                "explanation": f"Real part Re(z) = {re_fmt['latex']}, Imaginary part Im(z) = {im_fmt['latex']}."
            },
            {
                "title": "Modulus |z|",
                "latex": f"|z| = \\sqrt{{a^2 + b^2}} = \\sqrt{{({re_fmt['latex']})^2 + ({im_fmt['latex']})^2}} = {mod_fmt['latex']}",
                "explanation": f"Magnitude/distance from origin: {mod_fmt.get('numeric', '')}"
            },
            {
                "title": "Argument Arg(z)",
                "latex": f"\\theta = \\operatorname{{atan2}}(b, a) = {arg_fmt['latex']} \\; \\text{{rad}} \\; ({arg_deg_fmt['latex']}^\\circ)",
                "explanation": "Principal phase angle in the complex plane."
            },
            {
                "title": "Complex Conjugate z*",
                "latex": f"\\overline{{z}} = a - bi = {conj_fmt['latex']}",
                "explanation": "Reflection across the real axis."
            },
            {
                "title": "Euler Polar Form",
                "latex": f"z = r e^{{i\\theta}} = {polar_latex}",
                "explanation": "Exponential trigonometric representation."
            }
        ]

        return {
            "success": True,
            "result": {
                "latex": sympy.latex(evaluated),
                "real": re_fmt,
                "imag": im_fmt,
                "modulus": mod_fmt,
                "argument_rad": arg_fmt,
                "argument_deg": arg_deg_fmt,
                "conjugate": conj_fmt,
                "polar_latex": polar_latex
            },
            "steps": steps
        }

    return execute_with_timeout(_compute)
