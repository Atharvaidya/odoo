# backend/App/__init__.py

from flask import Flask
from flask_cors import CORS
from .config import SQLALCHEMY_DATABASE_URI, SECRET_KEY
from .db import db


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Load config
    app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = SECRET_KEY

    # Init DB
    db.init_app(app)

    # Register routes
    from ..Routes.product_routes import bp as product_bp

    app.register_blueprint(product_bp, url_prefix="/api/products")

    return app
