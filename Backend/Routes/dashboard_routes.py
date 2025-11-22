# Backend/Routes/dashboard_routes.py
from flask import Blueprint, jsonify
from ..Models.product import Product
from ..Models.stock import StockLevel
from ..Models.warehouse import Warehouse
from ..App import db

bp = Blueprint("dashboard", __name__)

@bp.route("/summary", methods=["GET"])
def summary():
    total_products = Product.query.count()
    warehouses = Warehouse.query.count()
    # low stock: any stock level <= reorder_level
    low = db.session.query(StockLevel).join(Product).filter(StockLevel.quantity <= Product.reorder_level).count()
    total_stock_rows = StockLevel.query.count()
    return jsonify({
        "total_products": total_products,
        "warehouses": warehouses,
        "low_stock_rows": low,
        "stock_rows": total_stock_rows
    })
