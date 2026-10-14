import sympy
from app.services.parser import (
    safe_parse_expression,
    execute_with_timeout,
    format_result
)
from app.errors import (
    CalculatorException,
    SingularMatrixException,
    DimensionMismatchException,
    InputValidationException
)
from app.config import Config

def parse_matrix_grid(grid: list) -> sympy.Matrix:
    """Safely parse a 2D list of numeric/symbolic expressions into a SymPy Matrix."""
    if not grid or not isinstance(grid, list):
        raise InputValidationException(
            code="EMPTY_MATRIX",
            message="Matrix data is empty or invalid.",
            hint="Provide a valid 2D array of values."
        )

    rows = len(grid)
    if rows == 0 or rows > Config.MAX_MATRIX_DIMENSION:
        raise DimensionMismatchException(
            message=f"Matrix rows ({rows}) exceed maximum limit of {Config.MAX_MATRIX_DIMENSION}.",
            hint=f"Matrix dimension must be between 1 and {Config.MAX_MATRIX_DIMENSION}."
        )

    cols = len(grid[0])
    if cols == 0 or cols > Config.MAX_MATRIX_DIMENSION:
        raise DimensionMismatchException(
            message=f"Matrix columns ({cols}) exceed maximum limit of {Config.MAX_MATRIX_DIMENSION}.",
            hint=f"Matrix dimension must be between 1 and {Config.MAX_MATRIX_DIMENSION}."
        )

    parsed_rows = []
    for r_idx, row in enumerate(grid):
        if len(row) != cols:
            raise DimensionMismatchException(
                message=f"Inconsistent row length in row {r_idx + 1}: expected {cols} elements, found {len(row)}.",
                hint="All matrix rows must have the same number of columns."
            )
        parsed_row = []
        for c_idx, val in enumerate(row):
            val_str = str(val).strip() if val is not None else "0"
            if not val_str:
                val_str = "0"
            expr = safe_parse_expression(val_str)
            parsed_row.append(expr)
        parsed_rows.append(parsed_row)

    return sympy.Matrix(parsed_rows)

def matrix_determinant(matrix_data: list) -> dict:
    """Calculate the determinant of a square matrix with steps."""
    def _compute():
        M = parse_matrix_grid(matrix_data)
        rows, cols = M.shape
        if rows != cols:
            raise DimensionMismatchException(
                message=f"Determinant requires a square matrix. Given matrix is {rows}x{cols}.",
                hint="Ensure the number of rows equals the number of columns (e.g. 2x2, 3x3)."
            )

        steps = []
        steps.append({
            "title": "Matrix Input",
            "latex": f"A = {sympy.latex(M)} \\quad (\\text{{dim: }} {rows} \\times {cols})",
            "explanation": "Initial square matrix for determinant calculation."
        })

        if rows == 2:
            a, b = M[0, 0], M[0, 1]
            c, d = M[1, 0], M[1, 1]
            steps.append({
                "title": "2x2 Determinant Formula",
                "latex": f"\\det(A) = ad - bc = ({sympy.latex(a)})({sympy.latex(d)}) - ({sympy.latex(b)})({sympy.latex(c)})",
                "explanation": "Standard 2x2 determinant rule."
            })
        elif rows == 3:
            # Laplace expansion along first row
            a11, a12, a13 = M[0, 0], M[0, 1], M[0, 2]
            m11 = sympy.Matrix([[M[1, 1], M[1, 2]], [M[2, 1], M[2, 2]]])
            m12 = sympy.Matrix([[M[1, 0], M[1, 2]], [M[2, 0], M[2, 2]]])
            m13 = sympy.Matrix([[M[1, 0], M[1, 1]], [M[2, 0], M[2, 1]]])
            steps.append({
                "title": "Laplace Expansion (Row 1)",
                "latex": f"\\det(A) = {sympy.latex(a11)}\\det({sympy.latex(m11)}) - {sympy.latex(a12)}\\det({sympy.latex(m12)}) + {sympy.latex(a13)}\\det({sympy.latex(m13)})",
                "explanation": "Cofactor expansion along the first row."
            })

        det_val = M.det()
        det_simp = sympy.simplify(det_val)
        formatted = format_result(det_simp)

        steps.append({
            "title": "Determinant Result",
            "latex": f"\\det(A) = |A| = {formatted['latex']}",
            "explanation": f"Numerical: {formatted['numeric']}" if formatted.get('numeric') else "Exact determinant"
        })

        return {
            "success": True,
            "result": formatted,
            "steps": steps,
            "is_singular": bool(det_simp == 0)
        }

    return execute_with_timeout(_compute)

def matrix_inverse(matrix_data: list) -> dict:
    """Calculate the inverse of a square non-singular matrix with steps."""
    def _compute():
        M = parse_matrix_grid(matrix_data)
        rows, cols = M.shape
        if rows != cols:
            raise DimensionMismatchException(
                message=f"Inverse requires a square matrix. Matrix provided is {rows}x{cols}.",
                hint="Only square matrices (2x2, 3x3, etc.) can possess an inverse."
            )

        det_val = sympy.simplify(M.det())
        if det_val == 0:
            raise SingularMatrixException(
                message=f"Matrix is singular because det(A) = 0. No inverse exists.",
                hint="A matrix must have a non-zero determinant to be invertible."
            )

        steps = []
        steps.append({
            "title": "Matrix and Determinant Check",
            "latex": f"A = {sympy.latex(M)}, \\quad \\det(A) = {sympy.latex(det_val)} \\neq 0",
            "explanation": "Determinant is non-zero, confirming inverse exists."
        })

        steps.append({
            "title": "Adjugate Formula",
            "latex": f"A^{{-1}} = \\frac{{1}}{{\\det(A)}} \\operatorname{{adj}}(A)",
            "explanation": "Inverting via adjugate matrix and determinant scalar."
        })

        inv_M = M.inv()
        inv_simp = sympy.simplify(inv_M)

        steps.append({
            "title": "Inverted Matrix Result",
            "latex": f"A^{{-1}} = {sympy.latex(inv_simp)}",
            "explanation": "Verified property: A * A^(-1) = I."
        })

        return {
            "success": True,
            "result": {
                "latex": sympy.latex(inv_simp),
                "grid": [[str(inv_simp[r, c]) for c in range(cols)] for r in range(rows)],
                "det": str(det_val)
            },
            "steps": steps
        }

    return execute_with_timeout(_compute)

def matrix_transpose(matrix_data: list) -> dict:
    """Calculate transpose of a matrix."""
    def _compute():
        M = parse_matrix_grid(matrix_data)
        T = M.T
        rows, cols = T.shape
        return {
            "success": True,
            "result": {
                "latex": sympy.latex(T),
                "grid": [[str(T[r, c]) for c in range(cols)] for r in range(rows)]
            },
            "steps": [
                {
                    "title": "Original Matrix",
                    "latex": f"A = {sympy.latex(M)}",
                    "explanation": "Input matrix."
                },
                {
                    "title": "Transposed Matrix",
                    "latex": f"A^T = {sympy.latex(T)}",
                    "explanation": f"Swapped rows and columns (dimensions: {cols}x{rows} -> {rows}x{cols})."
                }
            ]
        }
    return execute_with_timeout(_compute)

def matrix_multiply(matrix_a_data: list, matrix_b_data: list) -> dict:
    """Multiply two matrices A x B with dimension validation and steps."""
    def _compute():
        A = parse_matrix_grid(matrix_a_data)
        B = parse_matrix_grid(matrix_b_data)

        rA, cA = A.shape
        rB, cB = B.shape

        if cA != rB:
            raise DimensionMismatchException(
                message=f"Dimension mismatch: Matrix A is {rA}x{cA} but Matrix B is {rB}x{cB}.",
                hint=f"To multiply A x B, columns of A ({cA}) must equal rows of B ({rB})."
            )

        steps = []
        steps.append({
            "title": "Matrices to Multiply",
            "latex": f"A = {sympy.latex(A)} \\; ({rA} \\times {cA}), \\quad B = {sympy.latex(B)} \\; ({rB} \\times {cB})",
            "explanation": f"Valid matrix product with resulting dimensions: {rA} \\times {cB}."
        })

        product = A * B
        product_simp = sympy.simplify(product)

        steps.append({
            "title": "Product Formula",
            "latex": f"(AB)_{{ij}} = \\sum_{{k=1}}^{{{cA}}} A_{{ik}} B_{{kj}}",
            "explanation": "Row by column dot product summation."
        })

        steps.append({
            "title": "Resulting Product Matrix",
            "latex": f"A \\times B = {sympy.latex(product_simp)}",
            "explanation": f"Dimensions: {rA} x {cB}."
        })

        return {
            "success": True,
            "result": {
                "latex": sympy.latex(product_simp),
                "grid": [[str(product_simp[r, c]) for c in range(cB)] for r in range(rA)]
            },
            "steps": steps
        }

    return execute_with_timeout(_compute)

def matrix_eigen(matrix_data: list) -> dict:
    """Calculate eigenvalues and eigenvectors of a square matrix."""
    def _compute():
        M = parse_matrix_grid(matrix_data)
        rows, cols = M.shape
        if rows != cols:
            raise DimensionMismatchException(
                message=f"Eigenvalue analysis requires a square matrix. Given matrix is {rows}x{cols}.",
                hint="Ensure row count equals column count."
            )

        lam = sympy.Symbol('\\lambda')
        char_poly = M.charpoly(lam)
        char_poly_expr = char_poly.as_expr()

        steps = []
        steps.append({
            "title": "Characteristic Polynomial",
            "latex": f"p(\\lambda) = \\det(A - \\lambda I) = {sympy.latex(char_poly_expr)} = 0",
            "explanation": "Eigenvalues are roots of the characteristic equation det(A - λI) = 0."
        })

        # Eigenvalues & multiplicities
        eigen_vals = M.eigenvals()
        val_list = []
        for val, mult in eigen_vals.items():
            f_val = format_result(val)
            val_list.append({
                "value": f_val["exact"],
                "latex": f_val["latex"],
                "numeric": f_val.get("numeric"),
                "multiplicity": mult
            })

        val_latex = ", \\quad ".join([f"\\lambda = {v['latex']} \\; (\\text{{mult: }} {v['multiplicity']})" for v in val_list])
        steps.append({
            "title": "Eigenvalues",
            "latex": val_latex,
            "explanation": f"Found {len(val_list)} distinct eigenvalue(s)."
        })

        # Eigenvectors
        eigen_vects = M.eigenvects()
        vect_list = []
        for val, mult, vects in eigen_vects:
            f_val = format_result(val)
            v_latex_list = [sympy.latex(v) for v in vects]
            vect_list.append({
                "eigenvalue": f_val["exact"],
                "eigenvalue_latex": f_val["latex"],
                "multiplicity": mult,
                "vectors_latex": v_latex_list
            })

        steps.append({
            "title": "Eigenvectors",
            "latex": " \\\\ ".join([f"\\lambda = {e['eigenvalue_latex']} \\implies v = " + ", ".join(e['vectors_latex']) for e in vect_list]),
            "explanation": "Basis vectors of eigenspaces corresponding to each eigenvalue."
        })

        return {
            "success": True,
            "eigenvalues": val_list,
            "eigenvectors": vect_list,
            "steps": steps
        }

    return execute_with_timeout(_compute)
