from flask import Blueprint, request, jsonify
from ..App.db import db
from ..Models.delivery import Delivery, DeliveryItem
from ..Models.stock import StockLevel

bp = Blueprint("deliveries", __name__)


@bp.post("/")
def create_delivery():
    data = request.json

    delivery = Delivery(customer=data["customer"])
    db.session.add(delivery)
    db.session.flush()

    for item in data["items"]:
        db.session.add(DeliveryItem(
            delivery_id=delivery.id,
            product_id=item["product_id"],
            quantity=item["quantity"]
        ))

        stock = StockLevel.query.filter_by(
            product_id=item["product_id"],
            warehouse_id=data["warehouse_id"]
        ).first()

        if not stock or stock.quantity < item["quantity"]:
            return jsonify({"error": "Not enough stock"}), 400

        stock.quantity -= item["quantity"]

    db.session.commit()
    return jsonify({"message": "Delivery completed"}), 201
