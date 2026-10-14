import os
from app import create_app
from app.config import Config

app = create_app(Config)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', Config.PORT))
    host = os.environ.get('HOST', Config.HOST)
    debug = Config.DEBUG
    print("=" * 60)
    print("  🚀 ADVANCED SCIENTIFIC CALCULATOR - Production Ready")
    print(f"  📡 Running on: http://{host}:{port}")
    print(f"  🛠️  Debug Mode: {debug}")
    print("=" * 60)
    app.run(host=host, port=port, debug=debug)
