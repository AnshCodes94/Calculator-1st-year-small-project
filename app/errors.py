from flask import jsonify

class CalculatorException(Exception):
    """Base exception for all calculator operations."""
    def __init__(self, code="CALCULATION_ERROR", message="An error occurred during calculation.", hint="Please verify your input and try again.", status_code=400):
        super().__init__(message)
        self.code = code
        self.message = message
        self.hint = hint
        self.status_code = status_code

    def to_dict(self):
        return {
            "success": False,
            "error": {
                "code": self.code,
                "message": self.message,
                "hint": self.hint
            }
        }

class DivisionByZeroException(CalculatorException):
    def __init__(self, message="Division by zero is mathematically undefined.", hint="Ensure the denominator does not evaluate to zero."):
        super().__init__(code="DIV_BY_ZERO", message=message, hint=hint, status_code=400)

class DomainException(CalculatorException):
    def __init__(self, message="Input value falls outside the function's valid mathematical domain.", hint="Check function bounds (e.g., log(x) requires x > 0, asin/acos requires -1 <= x <= 1)."):
        super().__init__(code="DOMAIN_ERROR", message=message, hint=hint, status_code=400)

class SyntaxExpressionException(CalculatorException):
    def __init__(self, message="Invalid expression syntax or incomplete operator sequence.", hint="Check for missing operands, repeated operators, or use * for multiplication (e.g., 2*x)."):
        super().__init__(code="SYNTAX_ERROR", message=message, hint=hint, status_code=400)

class UnbalancedBracketsException(CalculatorException):
    def __init__(self, message="Unbalanced brackets detected in expression.", hint="Ensure all opened parentheses (, [, { are properly closed with matching ), ], }."):
        super().__init__(code="UNBALANCED_BRACKETS", message=message, hint=hint, status_code=400)

class UnknownFunctionException(CalculatorException):
    def __init__(self, func_name, hint="Supported functions include sin, cos, tan, log, ln, sqrt, exp, etc."):
        super().__init__(code="UNKNOWN_FUNCTION", message=f"Unrecognized or unsupported function or variable: '{func_name}'.", hint=hint, status_code=400)

class OverflowCalcException(CalculatorException):
    def __init__(self, message="Calculation resulted in numerical overflow or integer too large.", hint="Try smaller numbers or work in symbolic/fractional mode."):
        super().__init__(code="OVERFLOW_ERROR", message=message, hint=hint, status_code=400)

class NonIntegrableException(CalculatorException):
    def __init__(self, message="Integral cannot be expressed in elementary terms or does not converge.", hint="For definite integrals, verify that the integrand is continuous over the interval."):
        super().__init__(code="NON_INTEGRABLE", message=message, hint=hint, status_code=400)

class LimitUndefinedException(CalculatorException):
    def __init__(self, message="The limit does not exist or left and right limits differ.", hint="Try computing one-sided limits (x -> a+ or x -> a-) to investigate."):
        super().__init__(code="LIMIT_UNDEFINED", message=message, hint=hint, status_code=400)

class NoSolutionException(CalculatorException):
    def __init__(self, message="No solution exists for this equation or system.", hint="The equations may be inconsistent or contradictory."):
        super().__init__(code="NO_SOLUTION", message=message, hint=hint, status_code=400)

class SingularMatrixException(CalculatorException):
    def __init__(self, message="Matrix is singular (determinant = 0) and cannot be inverted.", hint="Only non-singular square matrices with non-zero determinants have an inverse."):
        super().__init__(code="SINGULAR_MATRIX", message=message, hint=hint, status_code=400)

class DimensionMismatchException(CalculatorException):
    def __init__(self, message="Matrix dimension mismatch for the requested operation.", hint="For multiplication A x B, columns of A must equal rows of B. Determinant requires a square matrix."):
        super().__init__(code="DIMENSION_MISMATCH", message=message, hint=hint, status_code=400)

class TimeoutCalcException(CalculatorException):
    def __init__(self, message="Computation took too long and exceeded the time limit.", hint="This is taking too long; try a simpler expression or reduce the series order/range."):
        super().__init__(code="TIMEOUT_ERROR", message=message, hint=hint, status_code=408)

class InputValidationException(CalculatorException):
    def __init__(self, code, message, hint):
        super().__init__(code=code, message=message, hint=hint, status_code=400)

def make_error_response(code, message, hint, status_code=400):
    """Helper to return a standardized JSON error response."""
    return jsonify({
        "success": False,
        "error": {
            "code": code,
            "message": message,
            "hint": hint
        }
    }), status_code
