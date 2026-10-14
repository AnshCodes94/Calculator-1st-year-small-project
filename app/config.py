import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

class Config:
    """Base application configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default-dev-secret-key-3918237')
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() in ('true', '1', 't')
    HOST = os.environ.get('HOST', '127.0.0.1')
    PORT = int(os.environ.get('PORT', 5000))

    # Security & Execution limits
    CALC_TIMEOUT_SECONDS = int(os.environ.get('CALC_TIMEOUT_SECONDS', 5))
    MAX_EXPRESSION_LENGTH = int(os.environ.get('MAX_EXPRESSION_LENGTH', 500))
    MAX_MATRIX_DIMENSION = int(os.environ.get('MAX_MATRIX_DIMENSION', 6))
    MAX_SERIES_ORDER = int(os.environ.get('MAX_SERIES_ORDER', 15))

    # Supported Unit Categories
    UNIT_CATEGORIES = {
        'length': {'m': 1.0, 'km': 1000.0, 'cm': 0.01, 'mm': 0.001, 'mi': 1609.344, 'yd': 0.9144, 'ft': 0.3048, 'in': 0.0254, 'nm': 1852.0},
        'mass': {'kg': 1.0, 'g': 0.001, 'mg': 1e-6, 'lb': 0.45359237, 'oz': 0.028349523125, 'tonne': 1000.0, 'ton': 907.18474},
        'speed': {'mps': 1.0, 'kph': 1/3.6, 'mph': 0.44704, 'knot': 0.514444, 'fps': 0.3048},
        'angle': {'rad': 1.0, 'deg': 0.017453292519943295, 'grad': 0.015707963267948967, 'arcmin': 0.0002908882086657216, 'arcsec': 4.84813681109536e-6},
        'energy': {'J': 1.0, 'kJ': 1000.0, 'cal': 4.184, 'kcal': 4184.0, 'Wh': 3600.0, 'kWh': 3.6e6, 'eV': 1.602176634e-19, 'BTU': 1055.06},
        'pressure': {'Pa': 1.0, 'kPa': 1000.0, 'bar': 1e5, 'psi': 6894.75729, 'atm': 101325.0, 'torr': 133.3223684, 'mmHg': 133.3223684}
    }
