from flask import Blueprint, request, jsonify
from ..App.db import db
from ..Models.internal_transfer import InternalTransfer
from ..Models.stock import StockLevel

bp = Blueprint("transfers", __name__)


@bp.post("/")
def create_transfer():
    data = request.json

    transfer = InternalTransfer(
        product_id=data["product_id"],
        qty=data["qty"],
        source_location=data["source"],
        dest_location=data["destination"]
    )
    db.session.add(transfer)

    # Remove from source
    source = StockLevel.query.filter_by(
        product_id=data["product_id"],
        warehouse_id=data["source"]
    ).first()

    if source.quantity < data["qty"]:
        return jsonify({"error": "Not enough stock"}), 400

    source.quantity -= data["qty"]

    # Add to destination
    dest = StockLevel.query.filter_by(
        product_id=data["product_id"],
        warehouse_id=data["destination"]
    ).first()

    if not dest:
        dest = StockLevel(
            product_id=data["product_id"],
            warehouse_id=data["destination"],
            quantity=0
        )
        db.session.add(dest)

    dest.quantity += data["qty"]

    db.session.commit()
    return jsonify({"message": "Transfer completed"}), 201
