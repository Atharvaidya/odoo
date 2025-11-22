from flask import Blueprint, request, jsonify
from ..App.db import db
from ..Models.adjustment import StockAdjustment
from ..Models.stock import StockLevel

bp = Blueprint("adjustments", __name__)


@bp.post("/")
def adjust_stock():
    data = request.json

    adjustment = StockAdjustment(
        product_id=data["product_id"],
        warehouse_id=data["warehouse_id"],
        counted_qty=data["counted_qty"]
    )

    db.session.add(adjustment)

    stock = StockLevel.query.filter_by(
        product_id=data["product_id"],
        warehouse_id=data["warehouse_id"]
    ).first()

    if not stock:
        stock = StockLevel(
            product_id=data["product_id"],
            warehouse_id=data["warehouse_id"],
            quantity=0
        )
        db.session.add(stock)

    stock.quantity = data["counted_qty"]

    db.session.commit()
    return jsonify({"message": "Stock updated"}), 200
