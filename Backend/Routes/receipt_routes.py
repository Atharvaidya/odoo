from flask import Blueprint, request, jsonify
from ..App.db import db
from ..Models.receipt import Receipt, ReceiptItem
from ..Models.stock import StockLevel

bp = Blueprint("receipts", __name__)


@bp.post("/")
def create_receipt():
    data = request.json

    receipt = Receipt(supplier=data["supplier"])
    db.session.add(receipt)
    db.session.flush()

    # Add items
    for item in data["items"]:
        db.session.add(ReceiptItem(
            receipt_id=receipt.id,
            product_id=item["product_id"],
            quantity=item["quantity"]
        ))

        # Update stock
        stock = StockLevel.query.filter_by(
            product_id=item["product_id"],
            warehouse_id=data["warehouse_id"]
        ).first()

        if not stock:
            stock = StockLevel(
                product_id=item["product_id"],
                warehouse_id=data["warehouse_id"],
                quantity=0
            )
            db.session.add(stock)

        stock.quantity += item["quantity"]

    db.session.commit()
    return jsonify({"message": "Receipt created"}), 201
