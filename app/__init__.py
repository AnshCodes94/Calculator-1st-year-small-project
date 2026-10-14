import os
from flask import Flask
from app.config import Config
from app.routes.main import main_bp, register_error_handlers
from app.routes.api import api_bp

def create_app(config_class=Config):
    """Application factory for Advanced Scientific Calculator."""
    frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
    if os.path.exists(frontend_dist):
        app = Flask(__name__, static_folder=frontend_dist, static_url_path='')
    else:
        app = Flask(__name__)

    app.config.from_object(config_class)

    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)

    # Register custom error pages & handlers
    register_error_handlers(app)

    return app
