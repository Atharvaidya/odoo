# backend/app/main.py
from flask import Flask
from .config import SQLALCHEMY_DATABASE_URI, SECRET_KEY
from .db import db

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = SECRET_KEY

    db.init_app(app)

    # import and register blueprints
    from .routes.product_routes import bp as product_bp
    from .routes.auth_routes import bp as auth_bp
    # register others similarly...
    app.register_blueprint(product_bp, url_prefix='/api/products')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    @app.route('/health')
    def health():
        return {"status":"ok"}

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
