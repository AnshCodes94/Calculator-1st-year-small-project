import os
from flask import Blueprint, request, jsonify, send_from_directory, current_app, Response

main_bp = Blueprint('main', __name__)

SINGULARITY_404_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>404 - Mathematical Singularity Encountered | CalcVerse</title>
  <style>
    body { background: #070a12; color: #f8fafc; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .card { background: rgba(14,21,38,0.85); padding: 2.5rem; border-radius: 1.5rem; border: 1px solid rgba(0,242,254,0.3); max-width: 480px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    h1 { color: #00f2fe; margin-bottom: 0.5rem; font-size: 1.5rem; }
    p { color: #94a3b8; font-size: 0.9rem; line-height: 1.5; }
    a { display: inline-block; margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #00f2fe, #8b5cf6); color: #fff; text-decoration: none; border-radius: 0.75rem; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size: 3.5rem; font-weight: 900; color: #f43f5e;">404</div>
    <h1>Mathematical Singularity Encountered</h1>
    <p>The requested coordinate lies beyond the defined domain. The function may have diverged to infinity.</p>
    <a href="/">Return to CalcVerse</a>
  </div>
</body>
</html>"""

@main_bp.route('/')
def index():
    frontend_dist = os.path.abspath(os.path.join(current_app.root_path, '..', 'frontend', 'dist'))
    index_file = os.path.join(frontend_dist, 'index.html')
    if os.path.exists(index_file):
        return send_from_directory(frontend_dist, 'index.html')
    return Response(SINGULARITY_404_HTML, mimetype='text/html')

@main_bp.route('/404')
def not_found_page():
    return Response(SINGULARITY_404_HTML, status=404, mimetype='text/html')

def register_error_handlers(app):
    @app.errorhandler(404)
    def handle_404(e):
        if request.path.startswith('/api/'):
            return jsonify({
                "success": False,
                "error": {
                    "code": "ENDPOINT_NOT_FOUND",
                    "message": f"The requested API route '{request.path}' does not exist.",
                    "hint": "Check the API endpoint URL."
                }
            }), 404

        frontend_dist = os.path.abspath(os.path.join(app.root_path, '..', 'frontend', 'dist'))
        rel_path = request.path.lstrip('/')
        if rel_path and os.path.exists(os.path.join(frontend_dist, rel_path)):
            return send_from_directory(frontend_dist, rel_path)

        return Response(SINGULARITY_404_HTML, status=404, mimetype='text/html')

    @app.errorhandler(405)
    def handle_405(e):
        if request.path.startswith('/api/'):
            return jsonify({
                "success": False,
                "error": {
                    "code": "METHOD_NOT_ALLOWED",
                    "message": f"Method {request.method} is not permitted on {request.path}.",
                    "hint": "Most calculator API endpoints expect POST requests with JSON body."
                }
            }), 405
        return Response(SINGULARITY_404_HTML, status=405, mimetype='text/html')

    @app.errorhandler(500)
    def handle_500(e):
        if request.path.startswith('/api/'):
            return jsonify({
                "success": False,
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "An internal server error occurred.",
                    "hint": "Please try again later or verify your input."
                }
            }), 500
        return Response(SINGULARITY_404_HTML, status=500, mimetype='text/html')
