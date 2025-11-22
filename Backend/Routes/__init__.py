# Backend/App/__init__.py
from flask import Flask
from flask_cors import CORS
from .Config import SQLALCHEMY_DATABASE_URI, SECRET_KEY
from .db import db  # SQLAlchemy() instance (create in db.py)

def create_app():
    app = Flask(__name__, static_folder=None)  # if you want to serve frontend later, update static_folder
    CORS(app)

    # Load config
    app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = SECRET_KEY

    # Init DB
    db.init_app(app)

    # Register blueprints
    # Make sure these modules exist in Backend/Routes
    from ..Routes.product_routes import bp as product_bp
    from ..Routes.auth_routes import bp as auth_bp
    from ..Routes.receipt_routes import bp as receipt_bp
    from ..Routes.delivery_routes import bp as delivery_bp
    from ..Routes.transfer_routes import bp as transfer_bp
    from ..Routes.adjustment_routes import bp as adjustment_bp
    from ..Routes.dashboard_routes import bp as dashboard_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(product_bp, url_prefix="/api/products")
    app.register_blueprint(receipt_bp, url_prefix="/api/receipts")
    app.register_blueprint(delivery_bp, url_prefix="/api/deliveries")
    app.register_blueprint(transfer_bp, url_prefix="/api/transfers")
    app.register_blueprint(adjustment_bp, url_prefix="/api/adjustments")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    return app
