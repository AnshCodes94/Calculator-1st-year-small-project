import sympy
from app.services.parser import (
    safe_parse_expression,
    execute_with_timeout,
    format_result
)
from app.errors import (
    CalculatorException,
    NoSolutionException,
    SyntaxExpressionException
)

def solve_equation(equation_str: str, var_str: str = 'x') -> dict:
    """Solve an algebraic equation f(x) = g(x) or f(x) = 0 with steps."""
    def _compute():
        var = sympy.Symbol(var_str.strip())
        eq_clean = equation_str.strip()

        if '=' in eq_clean:
            parts = eq_clean.split('=', 1)
            lhs = safe_parse_expression(parts[0])
            rhs = safe_parse_expression(parts[1])
            eq_expr = lhs - rhs
        else:
            lhs = safe_parse_expression(eq_clean)
            rhs = sympy.Integer(0)
            eq_expr = lhs

        steps = []
        steps.append({
            "title": "Equation Formulation",
            "latex": f"{sympy.latex(lhs)} = {sympy.latex(rhs)} \\implies {sympy.latex(eq_expr)} = 0",
            "explanation": f"Set equation to zero form with respect to {var}."
        })

        # Check if quadratic in var
        poly = None
        try:
            poly = sympy.Poly(eq_expr, var)
        except Exception:
            poly = None

        if poly and poly.degree() == 2:
            coeffs = poly.all_coeffs()
            a, b, c = coeffs[0], coeffs[1], coeffs[2]
            disc = b**2 - 4*a*c
            disc_simplified = sympy.simplify(disc)

            steps.append({
                "title": "Quadratic Analysis",
                "latex": f"a={sympy.latex(a)}, \\; b={sympy.latex(b)}, \\; c={sympy.latex(c)}",
                "explanation": f"Standard quadratic form: ax^2 + bx + c = 0."
            })
            steps.append({
                "title": "Discriminant Calculation",
                "latex": f"\\Delta = b^2 - 4ac = ({sympy.latex(b)})^2 - 4({sympy.latex(a)})({sympy.latex(c)}) = {sympy.latex(disc_simplified)}",
                "explanation": "Evaluated the quadratic discriminant."
            })
            steps.append({
                "title": "Quadratic Formula",
                "latex": f"{var} = \\frac{{-b \\pm \\sqrt{{\\Delta}}}}{{2a}} = \\frac{{-({sympy.latex(b)}) \\pm \\sqrt{{{sympy.latex(disc_simplified)}}}}}{{2({sympy.latex(a)})}}",
                "explanation": "Applied the quadratic formula."
            })

        # Solve symbolically
        solutions = sympy.solve(eq_expr, var)

        if not solutions:
            raise NoSolutionException(
                message=f"No mathematical solution exists for: {eq_clean}.",
                hint="Check equation coefficients or domain constraints."
            )

        formatted_solutions = []
        sol_latex_list = []
        for idx, sol in enumerate(solutions):
            f_sol = format_result(sol)
            formatted_solutions.append(f_sol)
            sol_latex_list.append(f"{var}_{{{idx+1}}} = {f_sol['latex']}")

        steps.append({
            "title": "Solutions",
            "latex": ", \\quad ".join(sol_latex_list),
            "explanation": f"Found {len(solutions)} solution(s)."
        })

        return {
            "success": True,
            "solutions": formatted_solutions,
            "steps": steps,
            "variable": str(var)
        }

    return execute_with_timeout(_compute)

def solve_linear_system(equations: list, variables: list = None) -> dict:
    """Solve a system of linear equations with matrix steps."""
    def _compute():
        if not equations or len(equations) == 0:
            raise CalculatorException(
                code="EMPTY_INPUT",
                message="No equations provided in system.",
                hint="Provide at least two linear equations (e.g., '2x + 3y = 7', 'x - y = 1')."
            )

        parsed_eqs = []
        found_vars = set()

        for eq_str in equations:
            eq_clean = eq_str.strip()
            if not eq_clean:
                continue
            if '=' in eq_clean:
                parts = eq_clean.split('=', 1)
                lhs = safe_parse_expression(parts[0])
                rhs = safe_parse_expression(parts[1])
                expr = lhs - rhs
            else:
                expr = safe_parse_expression(eq_clean)
            parsed_eqs.append(expr)
            found_vars.update(expr.free_symbols)

        if variables:
            vars_list = [sympy.Symbol(v.strip()) for v in variables if v.strip()]
        else:
            vars_list = sorted(list(found_vars), key=lambda s: s.name)

        if not vars_list:
            raise CalculatorException(
                code="NO_VARIABLES",
                message="No variables identified in system.",
                hint="Equations must contain variables like x, y, z."
            )

        steps = []
        steps.append({
            "title": "System Formulation",
            "latex": " \\begin{cases} " + " \\\\ ".join([f"{sympy.latex(e)} = 0" for e in parsed_eqs]) + " \\end{cases} ",
            "explanation": f"Solving for variables: {', '.join([str(v) for v in vars_list])}."
        })

        # Matrix form A * x = b
        try:
            A, b = sympy.linear_eq_to_matrix(parsed_eqs, vars_list)
            steps.append({
                "title": "Matrix Representation [A | b]",
                "latex": f"A = {sympy.latex(A)}, \\quad b = {sympy.latex(b)}",
                "explanation": "Converted system into matrix form A x = b."
            })
        except Exception:
            pass

        sol_dict = sympy.solve(parsed_eqs, vars_list, dict=True)

        if not sol_dict:
            raise NoSolutionException(
                message="The linear system has no solution (inconsistent system).",
                hint="The equations represent parallel hyperplanes or contradictory constraints."
            )

        first_sol = sol_dict[0]
        sol_formatted = {}
        latex_lines = []

        for var in vars_list:
            if var in first_sol:
                val = first_sol[var]
                res_f = format_result(val)
                sol_formatted[str(var)] = res_f
                latex_lines.append(f"{var} = {res_f['latex']}")
            else:
                sol_formatted[str(var)] = {"exact": str(var), "latex": str(var), "numeric": None}
                latex_lines.append(f"{var} \\in \\mathbb{{R}} \\; \\text{{(free variable)}}")

        steps.append({
            "title": "System Solution",
            "latex": ", \\quad ".join(latex_lines),
            "explanation": "Final unique or parametric solution of the linear system."
        })

        return {
            "success": True,
            "solutions": sol_formatted,
            "steps": steps
        }

    return execute_with_timeout(_compute)

def simplify_expr(expr_str: str) -> dict:
    """Simplify an algebraic expression with step."""
    def _compute():
        expr = safe_parse_expression(expr_str)
        simplified = sympy.simplify(expr)
        formatted = format_result(simplified)
        return {
            "success": True,
            "result": formatted,
            "steps": [
                {
                    "title": "Original Expression",
                    "latex": sympy.latex(expr),
                    "explanation": "Expression before simplification."
                },
                {
                    "title": "Algebraic Simplification",
                    "latex": formatted["latex"],
                    "explanation": "Applied algebraic reduction and identity cancellations."
                }
            ]
        }
    return execute_with_timeout(_compute)

def expand_expr(expr_str: str) -> dict:
    """Expand algebraic powers and products."""
    def _compute():
        expr = safe_parse_expression(expr_str)
        expanded = sympy.expand(expr)
        formatted = format_result(expanded)
        return {
            "success": True,
            "result": formatted,
            "steps": [
                {
                    "title": "Original Expression",
                    "latex": sympy.latex(expr),
                    "explanation": "Expression before expansion."
                },
                {
                    "title": "Expanded Form",
                    "latex": formatted["latex"],
                    "explanation": "Distributed terms and expanded powers using binomial/multinomial theorem."
                }
            ]
        }
    return execute_with_timeout(_compute)

def factorize_expr(expr_str: str) -> dict:
    """Factorize a polynomial or algebraic expression into irreducible components."""
    def _compute():
        expr = safe_parse_expression(expr_str)
        factorized = sympy.factor(expr)
        formatted = format_result(factorized)
        return {
            "success": True,
            "result": formatted,
            "steps": [
                {
                    "title": "Original Expression",
                    "latex": sympy.latex(expr),
                    "explanation": "Expression before factorization."
                },
                {
                    "title": "Factorized Form",
                    "latex": formatted["latex"],
                    "explanation": "Factored into irreducible polynomial factors over rationals."
                }
            ]
        }
    return execute_with_timeout(_compute)
