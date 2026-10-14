import re
import math
import concurrent.futures
import sympy
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
    function_exponentiation,
    convert_xor
)
from app.errors import (
    CalculatorException,
    DivisionByZeroException,
    DomainException,
    SyntaxExpressionException,
    UnbalancedBracketsException,
    UnknownFunctionException,
    OverflowCalcException,
    TimeoutCalcException,
    InputValidationException
)
from app.config import Config

# Standard SymPy transformations for mathematical intuition
TRANSFORMATIONS = (
    standard_transformations +
    (
        implicit_multiplication_application,
        function_exponentiation,
        convert_xor
    )
)

# Common mathematical variables
x, y, z, t, u, v, w, a, b, c, d, k, m, n, r, s = sympy.symbols('x y z t u v w a b c d k m n r s')
theta, phi, lamda = sympy.symbols('theta phi lamda')

# Safe dictionary for SymPy parser
SAFE_LOCAL_DICT = {
    # Variables
    'x': x, 'y': y, 'z': z, 't': t, 'u': u, 'v': v, 'w': w,
    'a': a, 'b': b, 'c': c, 'd': d, 'k': k, 'm': m, 'n': n, 'r': r, 's': s,
    'theta': theta, 'phi': phi, 'lamda': lamda,
    # Constants
    'pi': sympy.pi,
    'PI': sympy.pi,
    'e': sympy.E,
    'E': sympy.E,
    'i': sympy.I,
    'I': sympy.I,
    'oo': sympy.oo,
    'inf': sympy.oo,
    # Trigonometry
    'sin': sympy.sin,
    'cos': sympy.cos,
    'tan': sympy.tan,
    'sec': sympy.sec,
    'csc': sympy.csc,
    'cosec': sympy.csc,
    'cot': sympy.cot,
    # Inverse Trigonometry
    'asin': sympy.asin,
    'acos': sympy.acos,
    'atan': sympy.atan,
    'atan2': sympy.atan2,
    'asec': sympy.asec,
    'acsc': sympy.acsc,
    'acot': sympy.acot,
    'arcsin': sympy.asin,
    'arccos': sympy.acos,
    'arctan': sympy.atan,
    # Hyperbolic
    'sinh': sympy.sinh,
    'cosh': sympy.cosh,
    'tanh': sympy.tanh,
    'sech': sympy.sech,
    'csch': sympy.csch,
    'coth': sympy.coth,
    'asinh': sympy.asinh,
    'acosh': sympy.acosh,
    'atanh': sympy.atanh,
    # Logarithms & Exponential
    'log': sympy.log,
    'ln': sympy.ln,
    'exp': sympy.exp,
    # Roots & Powers
    'sqrt': sympy.sqrt,
    'cbrt': sympy.cbrt,
    'root': sympy.root,
    # Common mathematical functions
    'Abs': sympy.Abs,
    'abs': sympy.Abs,
    'factorial': sympy.factorial,
    'gamma': sympy.gamma,
    'floor': sympy.floor,
    'ceiling': sympy.ceiling,
    'round': round,
    'erf': sympy.erf,
    'sinc': sympy.sinc,
    're': sympy.re,
    'im': sympy.im,
    'arg': sympy.arg,
    'conjugate': sympy.conjugate,
    'conj': sympy.conjugate,
    'Max': sympy.Max,
    'Min': sympy.Min
}

# Blacklist of dangerous words and patterns
DANGEROUS_PATTERNS = [
    r'__', r'\bimport\b', r'\bexec\b', r'\beval\b', r'\bsystem\b',
    r'\bsubprocess\b', r'\bos\b', r'\bsys\b', r'\bshutil\b', r'\bopen\b',
    r'\bglobals\b', r'\blocals\b', r'\bcompile\b', r'\bgetattr\b',
    r'\bsetattr\b', r'\bdelattr\b', r'\bbreakpoint\b', r'\binput\b',
    r'\bwhile\b', r'\bdef\b', r'\bclass\b', r'\bassert\b', r'\blambda\b'
]

def check_bracket_balance(expr_str: str):
    """Ensure all parentheses, brackets, and braces are correctly paired."""
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for char in expr_str:
        if char in pairs.values():
            stack.append(char)
        elif char in pairs.keys():
            if not stack or stack[-1] != pairs[char]:
                raise UnbalancedBracketsException(
                    message=f"Mismatched or unexpected bracket '{char}'.",
                    hint="Ensure every opening bracket has an appropriate matching closing bracket."
                )
            stack.pop()
    if stack:
        unclosed = stack[-1]
        matching = ')' if unclosed == '(' else (']' if unclosed == '[' else '}')
        raise UnbalancedBracketsException(
            message=f"Unclosed bracket '{unclosed}' in expression.",
            hint=f"Add a closing '{matching}' where the sub-expression ends."
        )

def sanitize_and_normalize(expr_str: str, max_length: int = 500) -> str:
    """Pre-process, validate, and convert mathematical notation into SymPy compatible syntax."""
    if not expr_str or not expr_str.strip():
        raise InputValidationException(
            code="EMPTY_INPUT",
            message="No mathematical expression provided.",
            hint="Enter an expression like '2 + 3*x' or 'sin(pi/6)'."
        )

    expr = expr_str.strip()

    if len(expr) > max_length:
        raise InputValidationException(
            code="INPUT_TOO_LONG",
            message=f"Expression length ({len(expr)}) exceeds maximum allowed ({max_length} characters).",
            hint="Please shorten or split your expression."
        )

    # Check for forbidden keywords
    for pattern in DANGEROUS_PATTERNS:
        if re.search(pattern, expr, re.IGNORECASE):
            raise InputValidationException(
                code="INVALID_CHARACTER",
                message="Forbidden keyword or unsafe instruction detected.",
                hint="Only mathematical operations, standard variables, and scientific functions are permitted."
            )

    # Verify bracket matching
    check_bracket_balance(expr)

    # Normalization of unicode mathematical symbols
    replacements = {
        '×': '*',
        '✕': '*',
        '÷': '/',
        '−': '-',
        '–': '-',
        'π': 'pi',
        'Π': 'pi',
        '∞': 'oo',
        '√': 'sqrt',
        '²': '**2',
        '³': '**3',
        '⁴': '**4',
        'log10(': 'log(',
    }
    for old, new in replacements.items():
        expr = expr.replace(old, new)

    # Convert percentage (e.g., 50% -> (50/100) or 50 * 0.01)
    expr = re.sub(r'(\d+(\.\d+)?)%', r'(\1/100)', expr)

    # Convert factorials (e.g. 5! -> factorial(5), x! -> factorial(x))
    # Match expressions like 5!, (x+1)!, n!
    def repl_fact(match):
        token = match.group(1)
        return f"factorial({token})"
    # Replace (expr)! with factorial(expr)
    expr = re.sub(r'\(([^\(\)]+)\)!', r'factorial(\1)', expr)
    # Replace single number or variable followed by ! (e.g. 5!, x!)
    expr = re.sub(r'([a-zA-Z0-9_]+)!', r'factorial(\1)', expr)

    # Convert log with custom base: log_b(x) or log(x, b)
    # E.g. log2(8) -> (log(8)/log(2))
    expr = re.sub(r'\blog(\d+)\(([^)]+)\)', r'(log(\2)/log(\1))', expr)

    return expr

def transform_trig_degrees(expr_str: str) -> str:
    """Wrap arguments of trigonometric functions in degree-to-radian conversion."""
    trig_funcs = ['sin', 'cos', 'tan', 'sec', 'csc', 'cosec', 'cot']
    # Match func(arg)
    for fn in trig_funcs:
        # Regex to find fn(...) safely
        pattern = rf'\b{fn}\s*\(([^()]+)\)'
        while re.search(pattern, expr_str):
            expr_str = re.sub(pattern, rf'{fn}((\1) * pi / 180)', expr_str)
    return expr_str

def safe_parse_expression(expr_str: str, angle_mode: str = 'rad') -> sympy.Expr:
    """Parse string expression safely into a SymPy expression."""
    clean_expr = sanitize_and_normalize(expr_str, Config.MAX_EXPRESSION_LENGTH)

    if angle_mode.lower() == 'deg':
        clean_expr = transform_trig_degrees(clean_expr)

    try:
        parsed = parse_expr(
            clean_expr,
            local_dict=SAFE_LOCAL_DICT,
            transformations=TRANSFORMATIONS,
            evaluate=True
        )
        return parsed
    except (TypeError, ValueError) as e:
        err_msg = str(e)
        if "division by zero" in err_msg.lower():
            raise DivisionByZeroException()
        raise SyntaxExpressionException(
            message=f"Syntax evaluation error: {err_msg}",
            hint="Check that functions have proper parentheses (e.g., 'sin(x)', not 'sinx') and numbers are well-formed."
        )
    except sympy.SympifyError as e:
        raise SyntaxExpressionException(
            message="Could not parse mathematical expression.",
            hint="Verify mathematical syntax. For powers use ^ or **, e.g. x^2, and use * for multiplication."
        )
    except Exception as e:
        raise SyntaxExpressionException(
            message=f"Mathematical parsing failed: {str(e)}",
            hint="Check that your expression is standard algebra."
        )

def execute_with_timeout(func, *args, timeout_seconds=None, **kwargs):
    """Execute a function inside a thread pool with a strict timeout."""
    timeout = timeout_seconds or Config.CALC_TIMEOUT_SECONDS
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(func, *args, **kwargs)
        try:
            return future.result(timeout=timeout)
        except concurrent.futures.TimeoutError:
            raise TimeoutCalcException()
        except ZeroDivisionError:
            raise DivisionByZeroException()
        except OverflowError:
            raise OverflowCalcException()
        except CalculatorException:
            raise
        except Exception as e:
            msg = str(e)
            if "division by zero" in msg.lower() or "zoo" in msg.lower():
                raise DivisionByZeroException()
            if "out of domain" in msg.lower() or "domain" in msg.lower():
                raise DomainException()
            raise CalculatorException(
                code="CALCULATION_ERROR",
                message=f"Computation error: {msg}",
                hint="Please check inputs and boundary conditions."
            )

def format_result(expr: sympy.Expr, angle_mode: str = 'rad') -> dict:
    """Format a SymPy expression into exact LaTeX, string, and numerical decimal forms."""
    try:
        # Check for division by zero / infinities / indeterminate
        if expr == sympy.zoo or expr == sympy.nan:
            if expr == sympy.nan:
                raise DivisionByZeroException("Result evaluates to an indeterminate form (NaN or 0/0).", "Indeterminate form encountered.")
            raise DivisionByZeroException()

        # LaTeX representation
        latex_str = sympy.latex(expr)

        # Decimal numerical approximation
        decimal_val = None
        is_approx = False
        try:
            eval_n = sympy.N(expr, 15)
            if eval_n.is_number:
                # Check if complex or real
                if eval_n.is_real:
                    float_val = float(eval_n)
                    # Clean up representation
                    if math.isnan(float_val) or math.isinf(float_val):
                        raise DivisionByZeroException()
                    # If integer, display clean integer
                    if float_val.is_integer():
                        decimal_val = str(int(float_val))
                    else:
                        # Round to 8 decimal places for display
                        decimal_val = f"{float_val:.10g}"
                    is_approx = not expr.is_Integer
                else:
                    # Complex number
                    re_val = float(sympy.re(eval_n))
                    im_val = float(sympy.im(eval_n))
                    sign = "+" if im_val >= 0 else "-"
                    decimal_val = f"{re_val:.8g} {sign} {abs(im_val):.8g}i"
                    is_approx = True
        except Exception:
            decimal_val = None

        return {
            "exact": str(expr),
            "latex": latex_str,
            "numeric": decimal_val,
            "is_approx": is_approx
        }
    except CalculatorException:
        raise
    except Exception as e:
        raise CalculatorException(
            code="FORMAT_ERROR",
            message=f"Failed to format calculation result: {str(e)}",
            hint="The expression evaluated but could not be converted for display."
        )
