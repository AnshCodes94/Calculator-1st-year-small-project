import math
import sympy
from app.errors import (
    CalculatorException,
    DomainException,
    InputValidationException
)
from app.config import Config

def compute_combinatorics(n_val: int, r_val: int, operation: str = 'nCr') -> dict:
    """Compute combinations (nCr) or permutations (nPr) with steps."""
    try:
        n = int(n_val)
        r = int(r_val)
    except (ValueError, TypeError):
        raise InputValidationException(
            code="INVALID_INTEGER",
            message="Values for n and r must be valid integers.",
            hint="Enter whole non-negative numbers for n and r."
        )

    if n < 0 or r < 0:
        raise DomainException(
            message="n and r must be non-negative integers.",
            hint="Ensure n >= 0 and r >= 0."
        )

    if r > n:
        raise DomainException(
            message=f"r ({r}) cannot be greater than n ({n}).",
            hint="For combinations/permutations, r must be <= n."
        )

    if n > 1000:
        raise DomainException(
            message=f"n ({n}) is too large (max 1000).",
            hint="Use smaller values to avoid computational overflow."
        )

    op_upper = operation.upper()
    steps = []

    if 'P' in op_upper:
        # Permutation nPr = n! / (n - r)!
        ans = math.perm(n, r)
        steps.append({
            "title": "Permutation Formula",
            "latex": f"^{{{n}}}P_{{{r}}} = \\frac{{{n}!}}{{({n} - {r})!}} = \\frac{{{n}!}}{{{n-r}!}}",
            "explanation": f"Number of ways to arrange {r} items out of {n} distinct items (order matters)."
        })
        steps.append({
            "title": "Calculation",
            "latex": f"^{{{n}}}P_{{{r}}} = {ans}",
            "explanation": "Calculated exact permutation value."
        })
        latex_repr = f"^{{{n}}}P_{{{r}}} = {ans}"
    else:
        # Combination nCr = n! / (r! * (n - r)!)
        ans = math.comb(n, r)
        steps.append({
            "title": "Combination Formula",
            "latex": f"\\binom{{{n}}}{{{r}}} = \\frac{{{n}!}}{{{r}! ({n} - {r})!}} = \\frac{{{n}!}}{{{r}! \\cdot {n-r}!}}",
            "explanation": f"Number of ways to choose {r} items out of {n} distinct items (order does not matter)."
        })
        steps.append({
            "title": "Calculation",
            "latex": f"\\binom{{{n}}}{{{r}}} = {ans}",
            "explanation": "Calculated exact combination value."
        })
        latex_repr = f"\\binom{{{n}}}{{{r}}} = {ans}"

    return {
        "success": True,
        "result": {
            "value": ans,
            "latex": latex_repr
        },
        "steps": steps
    }

def compute_gcd_lcm(numbers: list) -> dict:
    """Compute greatest common divisor and least common multiple."""
    if not numbers or len(numbers) < 2:
        raise InputValidationException(
            code="INSUFFICIENT_NUMBERS",
            message="At least two numbers are required for GCD/LCM.",
            hint="Provide a list of at least two integers, e.g. [24, 36]."
        )

    try:
        clean_nums = [abs(int(x)) for x in numbers]
    except Exception:
        raise InputValidationException(
            code="INVALID_INTEGER",
            message="All entries must be valid integers.",
            hint="Use integers like 12, 18, 48."
        )

    # Compute GCD
    res_gcd = clean_nums[0]
    for num in clean_nums[1:]:
        res_gcd = math.gcd(res_gcd, num)

    # Compute LCM
    def _lcm(a, b):
        return abs(a * b) // math.gcd(a, b) if a and b else 0

    res_lcm = clean_nums[0]
    for num in clean_nums[1:]:
        res_lcm = _lcm(res_lcm, num)

    steps = [
        {
            "title": "Inputs",
            "latex": f"\\text{{Values: }} \\{{{', '.join(map(str, clean_nums))}\\}}",
            "explanation": "Given list of integers."
        },
        {
            "title": "Greatest Common Divisor (GCD / HCF)",
            "latex": f"\\gcd({', '.join(map(str, clean_nums))}) = {res_gcd}",
            "explanation": "Largest positive integer that divides each of the numbers."
        },
        {
            "title": "Least Common Multiple (LCM)",
            "latex": f"\\operatorname{{lcm}}({', '.join(map(str, clean_nums))}) = {res_lcm}",
            "explanation": "Smallest positive integer that is divisible by all of the numbers."
        }
    ]

    return {
        "success": True,
        "gcd": res_gcd,
        "lcm": res_lcm,
        "steps": steps
    }

def convert_base(value_str: str, from_base: str, to_base: str) -> dict:
    """Convert numbers between binary (2), octal (8), decimal (10), and hexadecimal (16)."""
    base_map = {
        'bin': 2, '2': 2,
        'oct': 8, '8': 8,
        'dec': 10, '10': 10,
        'hex': 16, '16': 16
    }

    fb = base_map.get(str(from_base).lower())
    tb = base_map.get(str(to_base).lower())

    if not fb or not tb:
        raise InputValidationException(
            code="INVALID_BASE",
            message=f"Unsupported base: from '{from_base}' to '{to_base}'.",
            hint="Supported bases are bin (2), oct (8), dec (10), and hex (16)."
        )

    val_clean = str(value_str).strip()
    if not val_clean:
        raise InputValidationException(
            code="EMPTY_INPUT",
            message="No input string for base conversion.",
            hint="Provide a number string in the source base."
        )

    try:
        decimal_val = int(val_clean, fb)
    except ValueError:
        raise InputValidationException(
            code="INVALID_DIGIT_FOR_BASE",
            message=f"'{val_clean}' contains invalid characters for base {fb}.",
            hint=f"Base {fb} only allows digits matching its radix."
        )

    # Convert to target base
    if tb == 2:
        converted = bin(decimal_val)[2:]
    elif tb == 8:
        converted = oct(decimal_val)[2:]
    elif tb == 10:
        converted = str(decimal_val)
    elif tb == 16:
        converted = hex(decimal_val)[2:].upper()

    # Pre-calculate all bases for convenience
    all_bases = {
        "bin": bin(decimal_val)[2:],
        "oct": oct(decimal_val)[2:],
        "dec": str(decimal_val),
        "hex": hex(decimal_val)[2:].upper()
    }

    steps = [
        {
            "title": "Conversion to Decimal Base-10",
            "latex": f"({val_clean})_{{{fb}}} = ({decimal_val})_{{10}}",
            "explanation": "Converted input radix representation to standard decimal value."
        },
        {
            "title": f"Conversion to Base-{tb}",
            "latex": f"({decimal_val})_{{10}} = ({converted})_{{{tb}}}",
            "explanation": f"Formatted decimal into radix-{tb} representation."
        }
    ]

    return {
        "success": True,
        "converted": converted,
        "from_base": fb,
        "to_base": tb,
        "all_bases": all_bases,
        "steps": steps
    }

def convert_unit(value_float: float, category: str, from_unit: str, to_unit: str) -> dict:
    """Convert measurement units across multiple categories."""
    try:
        val = float(value_float)
    except (ValueError, TypeError):
        raise InputValidationException(
            code="INVALID_NUMBER",
            message="Unit conversion requires a valid numeric value.",
            hint="Input a valid floating-point or integer value."
        )

    cat = category.lower().strip()
    fu = from_unit.strip()
    tu = to_unit.strip()

    if cat == 'temperature':
        # Temperature requires specific offset conversions
        # Convert from_unit to Celsius first
        if fu == 'C':
            celsius = val
        elif fu == 'F':
            celsius = (val - 32.0) * 5.0 / 9.0
        elif fu == 'K':
            celsius = val - 273.15
        else:
            raise InputValidationException("UNKNOWN_UNIT", f"Unknown temperature unit: {fu}", "Use C, F, or K.")

        # Convert Celsius to to_unit
        if tu == 'C':
            res = celsius
        elif tu == 'F':
            res = (celsius * 9.0 / 5.0) + 32.0
        elif tu == 'K':
            res = celsius + 273.15
        else:
            raise InputValidationException("UNKNOWN_UNIT", f"Unknown temperature unit: {tu}", "Use C, F, or K.")

        return {
            "success": True,
            "result": res,
            "category": cat,
            "from_unit": fu,
            "to_unit": tu,
            "formatted": f"{res:.6g} {tu}",
            "steps": [
                {
                    "title": "Temperature Conversion",
                    "latex": f"{val} \\, ^\\circ\\text{{{fu}}} \\implies {res:.6g} \\, ^\\circ\\text{{{tu}}}",
                    "explanation": "Converted using linear temperature scale mapping."
                }
            ]
        }

    categories = Config.UNIT_CATEGORIES
    if cat not in categories:
        raise InputValidationException(
            code="UNKNOWN_CATEGORY",
            message=f"Unit category '{cat}' is not recognized.",
            hint=f"Supported categories: {', '.join(categories.keys())}, temperature."
        )

    cat_units = categories[cat]
    if fu not in cat_units or tu not in cat_units:
        raise InputValidationException(
            code="UNKNOWN_UNIT",
            message=f"Unit '{fu}' or '{tu}' is invalid for category '{cat}'.",
            hint=f"Available units for {cat}: {', '.join(cat_units.keys())}."
        )

    # Standard linear conversion via base SI unit
    base_val = val * cat_units[fu]
    target_val = base_val / cat_units[tu]

    steps = [
        {
            "title": "Conversion via SI Base Unit",
            "latex": f"{val} \\, \\text{{{fu}}} = {base_val:.6g} \\, \\text{{(base)}} = {target_val:.6g} \\, \\text{{{tu}}}",
            "explanation": f"Converted from {fu} through SI standard to {tu}."
        }
    ]

    return {
        "success": True,
        "result": target_val,
        "category": cat,
        "from_unit": fu,
        "to_unit": tu,
        "formatted": f"{target_val:.6g} {tu}",
        "steps": steps
    }
