import unittest
from app import create_app
from app.config import Config

class TestConfig(Config):
    TESTING = True
    DEBUG = False
    CALC_TIMEOUT_SECONDS = 3

class CalculatorTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestConfig)
        self.client = self.app.test_client()

    # 1. Basic Arithmetic & Functions
    def test_basic_arithmetic(self):
        res = self.client.post('/api/calculate', json={'expression': '2 + 3 * 4'})
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['result']['numeric'], '14')

    def test_factorial_and_percentage(self):
        res = self.client.post('/api/calculate', json={'expression': '5! + 20%'})
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['result']['numeric'], '120.2')

    def test_trigonometry_rad_and_deg(self):
        # In radians: sin(pi/2) = 1
        res_rad = self.client.post('/api/calculate', json={'expression': 'sin(pi/2)', 'angle_mode': 'rad'})
        self.assertEqual(res_rad.get_json()['result']['numeric'], '1')

        # In degrees: sin(90) = 1
        res_deg = self.client.post('/api/calculate', json={'expression': 'sin(90)', 'angle_mode': 'deg'})
        self.assertEqual(res_deg.get_json()['result']['numeric'], '1')

    # 2. Logarithms & Antilog
    def test_logarithms(self):
        res = self.client.post('/api/logarithm', json={'x': '100', 'base': '10'})
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['result']['numeric'], '2')

    # 3. Calculus
    def test_differentiation(self):
        res = self.client.post('/api/calculus/differentiate', json={
            'expression': 'x^3 + 2*x',
            'variable': 'x',
            'order': 1
        })
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertIn('3*x**2 + 2', data['result']['exact'])

    def test_definite_integration(self):
        res = self.client.post('/api/calculus/integrate', json={
            'expression': 'x',
            'variable': 'x',
            'lower_limit': '0',
            'upper_limit': '2'
        })
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['result']['numeric'], '2')

    def test_limit(self):
        res = self.client.post('/api/calculus/limit', json={
            'expression': 'sin(x)/x',
            'variable': 'x',
            'point': '0'
        })
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['result']['numeric'], '1')

    def test_taylor_series(self):
        res = self.client.post('/api/calculus/series', json={
            'expression': 'exp(x)',
            'variable': 'x',
            'point': '0',
            'order': 3
        })
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertIn('x**3/6', data['result']['exact'])

    # 4. Algebra
    def test_equation_solver(self):
        res = self.client.post('/api/algebra/solve', json={
            'equation': 'x^2 - 4 = 0',
            'variable': 'x'
        })
        data = res.get_json()
        self.assertTrue(data['success'])
        solutions = [s['numeric'] for s in data['solutions']]
        self.assertIn('-2', solutions)
        self.assertIn('2', solutions)

    def test_linear_system(self):
        res = self.client.post('/api/algebra/solve-system', json={
            'equations': ['2*x + y = 5', 'x - y = 1']
        })
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['solutions']['x']['numeric'], '2')
        self.assertEqual(data['solutions']['y']['numeric'], '1')

    # 5. Matrices
    def test_matrix_operations(self):
        mat = [['1', '2'], ['3', '4']]
        res_det = self.client.post('/api/matrix/determinant', json={'matrix': mat})
        self.assertTrue(res_det.get_json()['success'])
        self.assertEqual(res_det.get_json()['result']['numeric'], '-2')

        res_inv = self.client.post('/api/matrix/inverse', json={'matrix': mat})
        self.assertTrue(res_inv.get_json()['success'])

    # 6. Complex Numbers
    def test_complex_analysis(self):
        res = self.client.post('/api/complex/evaluate', json={'expression': '3 + 4*i'})
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['result']['modulus']['numeric'], '5')

    # 7. Extras: Radix & Units & Combinatorics
    def test_base_conversion(self):
        res = self.client.post('/api/extras/base-convert', json={
            'value': '255',
            'from_base': 'dec',
            'to_base': 'hex'
        })
        self.assertEqual(res.get_json()['converted'], 'FF')

    def test_combinatorics(self):
        res = self.client.post('/api/extras/combinatorics', json={'n': 5, 'r': 2, 'operation': 'nCr'})
        self.assertEqual(res.get_json()['result']['value'], 10)

    # 8. Error Handling Traps
    def test_division_by_zero(self):
        res = self.client.post('/api/calculate', json={'expression': '1 / 0'})
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertFalse(data['success'])
        self.assertEqual(data['error']['code'], 'DIV_BY_ZERO')

    def test_unbalanced_brackets(self):
        res = self.client.post('/api/calculate', json={'expression': '(2 + 3 * (4 - 1)'})
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertEqual(data['error']['code'], 'UNBALANCED_BRACKETS')

    def test_singular_matrix_error(self):
        singular_mat = [['1', '2'], ['2', '4']]
        res = self.client.post('/api/matrix/inverse', json={'matrix': singular_mat})
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertEqual(data['error']['code'], 'SINGULAR_MATRIX')

    def test_plot_endpoint(self):
        res = self.client.post('/api/plot', json={
            'functions': ['sin(x)', 'cos(x)'],
            'x_min': -5,
            'x_max': 5,
            'num_points': 100
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(len(data['traces']), 2)

    def test_empty_input_error(self):
        res = self.client.post('/api/calculate', json={'expression': '   '})
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertEqual(data['error']['code'], 'EMPTY_INPUT')

    def test_factorial_overflow_protection(self):
        res = self.client.post('/api/calculate', json={'expression': '5000!'})
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertEqual(data['error']['code'], 'OVERFLOW_ERROR')

    def test_custom_404_page_and_api(self):
        # HTML 404
        res_html = self.client.get('/nonexistent-page')
        self.assertEqual(res_html.status_code, 404)
        self.assertIn(b'Mathematical Singularity Encountered', res_html.data)

        # JSON 404 for API
        res_api = self.client.get('/api/nonexistent')
        self.assertEqual(res_api.status_code, 404)
        data = res_api.get_json()
        self.assertEqual(data['error']['code'], 'ENDPOINT_NOT_FOUND')

if __name__ == '__main__':
    unittest.main()
