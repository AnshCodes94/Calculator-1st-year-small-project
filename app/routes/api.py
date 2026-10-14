from flask import Blueprint, request, jsonify
from app.errors import (
    CalculatorException,
    make_error_response
)
from app.services.basic import (
    evaluate_basic_expression,
    compute_logarithm,
    compute_antilog
)
from app.services.calculus import (
    differentiate,
    integrate_expr,
    compute_limit,
    taylor_series
)
from app.services.algebra import (
    solve_equation,
    solve_linear_system,
    simplify_expr,
    expand_expr,
    factorize_expr
)
from app.services.matrix import (
    matrix_determinant,
    matrix_inverse,
    matrix_transpose,
    matrix_multiply,
    matrix_eigen
)
from app.services.complex_calc import evaluate_complex
from app.services.extras import (
    compute_combinatorics,
    compute_gcd_lcm,
    convert_base,
    convert_unit
)
from app.services.plotter import generate_plot_data

api_bp = Blueprint('api', __name__, url_prefix='/api')

def handle_api_call(service_func, *args, **kwargs):
    """Wrapper to safely execute a service function and handle exceptions."""
    try:
        res = service_func(*args, **kwargs)
        return jsonify(res), 200
    except CalculatorException as e:
        return jsonify(e.to_dict()), e.status_code
    except Exception as e:
        return make_error_response(
            code="SERVER_ERROR",
            message=f"An unexpected error occurred during computation: {str(e)}",
            hint="Please verify the format of your input or try a simpler problem.",
            status_code=500
        )

# ==================== BASIC & SCIENTIFIC ====================

@api_bp.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json(force=True, silent=True) or {}
    expr = data.get('expression', '')
    angle_mode = data.get('angle_mode', 'rad')
    return handle_api_call(evaluate_basic_expression, expr, angle_mode=angle_mode)

@api_bp.route('/logarithm', methods=['POST'])
def logarithm():
    data = request.get_json(force=True, silent=True) or {}
    x_val = data.get('x', '')
    base = data.get('base', 'e')
    return handle_api_call(compute_logarithm, x_val, base_str=base)

@api_bp.route('/antilog', methods=['POST'])
def antilog():
    data = request.get_json(force=True, silent=True) or {}
    x_val = data.get('x', '')
    base = data.get('base', 'e')
    return handle_api_call(compute_antilog, x_val, base_str=base)

# ==================== CALCULUS ====================

@api_bp.route('/calculus/differentiate', methods=['POST'])
def calculus_differentiate():
    data = request.get_json(force=True, silent=True) or {}
    expr = data.get('expression', '')
    var = data.get('variable', 'x')
    order = data.get('order', 1)
    return handle_api_call(differentiate, expr, var_str=var, order=order)

@api_bp.route('/calculus/integrate', methods=['POST'])
def calculus_integrate():
    data = request.get_json(force=True, silent=True) or {}
    expr = data.get('expression', '')
    var = data.get('variable', 'x')
    lower = data.get('lower_limit', None)
    upper = data.get('upper_limit', None)
    return handle_api_call(integrate_expr, expr, var_str=var, lower_limit=lower, upper_limit=upper)

@api_bp.route('/calculus/limit', methods=['POST'])
def calculus_limit():
    data = request.get_json(force=True, silent=True) or {}
    expr = data.get('expression', '')
    var = data.get('variable', 'x')
    point = data.get('point', '0')
    direction = data.get('direction', '+-')
    return handle_api_call(compute_limit, expr, var_str=var, point_str=point, direction=direction)

@api_bp.route('/calculus/series', methods=['POST'])
def calculus_series():
    data = request.get_json(force=True, silent=True) or {}
    expr = data.get('expression', '')
    var = data.get('variable', 'x')
    point = data.get('point', '0')
    order = data.get('order', 4)
    return handle_api_call(taylor_series, expr, var_str=var, point_str=point, order=order)

# ==================== ALGEBRA ====================

@api_bp.route('/algebra/solve', methods=['POST'])
def algebra_solve():
    data = request.get_json(force=True, silent=True) or {}
    eq = data.get('equation', '')
    var = data.get('variable', 'x')
    return handle_api_call(solve_equation, eq, var_str=var)

@api_bp.route('/algebra/solve-system', methods=['POST'])
def algebra_solve_system():
    data = request.get_json(force=True, silent=True) or {}
    eqs = data.get('equations', [])
    vars_list = data.get('variables', None)
    return handle_api_call(solve_linear_system, eqs, variables=vars_list)

@api_bp.route('/algebra/simplify', methods=['POST'])
def algebra_simplify():
    data = request.get_json(force=True, silent=True) or {}
    expr = data.get('expression', '')
    return handle_api_call(simplify_expr, expr)

@api_bp.route('/algebra/expand', methods=['POST'])
def algebra_expand():
    data = request.get_json(force=True, silent=True) or {}
    expr = data.get('expression', '')
    return handle_api_call(expand_expr, expr)

@api_bp.route('/algebra/factorize', methods=['POST'])
def algebra_factorize():
    data = request.get_json(force=True, silent=True) or {}
    expr = data.get('expression', '')
    return handle_api_call(factorize_expr, expr)

# ==================== MATRICES ====================

@api_bp.route('/matrix/determinant', methods=['POST'])
def matrix_det():
    data = request.get_json(force=True, silent=True) or {}
    mat = data.get('matrix', [])
    return handle_api_call(matrix_determinant, mat)

@api_bp.route('/matrix/inverse', methods=['POST'])
def matrix_inv():
    data = request.get_json(force=True, silent=True) or {}
    mat = data.get('matrix', [])
    return handle_api_call(matrix_inverse, mat)

@api_bp.route('/matrix/transpose', methods=['POST'])
def matrix_trans():
    data = request.get_json(force=True, silent=True) or {}
    mat = data.get('matrix', [])
    return handle_api_call(matrix_transpose, mat)

@api_bp.route('/matrix/multiply', methods=['POST'])
def matrix_mult():
    data = request.get_json(force=True, silent=True) or {}
    mat_a = data.get('matrix_a', [])
    mat_b = data.get('matrix_b', [])
    return handle_api_call(matrix_multiply, mat_a, mat_b)

@api_bp.route('/matrix/eigen', methods=['POST'])
def matrix_eigenvalues():
    data = request.get_json(force=True, silent=True) or {}
    mat = data.get('matrix', [])
    return handle_api_call(matrix_eigen, mat)

# ==================== COMPLEX NUMBERS ====================

@api_bp.route('/complex/evaluate', methods=['POST'])
def complex_calc():
    data = request.get_json(force=True, silent=True) or {}
    expr = data.get('expression', '')
    return handle_api_call(evaluate_complex, expr)

# ==================== EXTRAS ====================

@api_bp.route('/extras/combinatorics', methods=['POST'])
def extras_combinatorics():
    data = request.get_json(force=True, silent=True) or {}
    n = data.get('n', 0)
    r = data.get('r', 0)
    op = data.get('operation', 'nCr')
    return handle_api_call(compute_combinatorics, n, r, operation=op)

@api_bp.route('/extras/gcd-lcm', methods=['POST'])
def extras_gcd_lcm():
    data = request.get_json(force=True, silent=True) or {}
    numbers = data.get('numbers', [])
    return handle_api_call(compute_gcd_lcm, numbers)

@api_bp.route('/extras/base-convert', methods=['POST'])
def extras_base_convert():
    data = request.get_json(force=True, silent=True) or {}
    val = data.get('value', '')
    fb = data.get('from_base', 'dec')
    tb = data.get('to_base', 'bin')
    return handle_api_call(convert_base, val, fb, tb)

@api_bp.route('/extras/unit-convert', methods=['POST'])
def extras_unit_convert():
    data = request.get_json(force=True, silent=True) or {}
    val = data.get('value', 0)
    cat = data.get('category', 'length')
    fu = data.get('from_unit', 'm')
    tu = data.get('to_unit', 'km')
    return handle_api_call(convert_unit, val, cat, fu, tu)

# ==================== GRAPH PLOTTER ====================

@api_bp.route('/plot', methods=['POST'])
def plot_functions():
    data = request.get_json(force=True, silent=True) or {}
    funcs = data.get('functions', [])
    x_min = data.get('x_min', -10.0)
    x_max = data.get('x_max', 10.0)
    num_pts = data.get('num_points', 500)
    return handle_api_call(generate_plot_data, funcs, x_min=x_min, x_max=x_max, num_points=num_pts)
