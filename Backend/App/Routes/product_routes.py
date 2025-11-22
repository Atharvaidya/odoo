from flask import Blueprint, request, jsonify
from App.db import db
from ..Models.product import Product
from ..Models.stock import StockLevel
bp = Blueprint('products', __name__)

@bp.route('/', methods=['GET'])
def list_products():
    q = Product.query
    category = request.args.get('category')
    if category:
        q = q.join(Product.category).filter_by(name=category)
    products = q.limit(200).all()
    data = []
    for p in products:
        data.append({
            "id": p.id,
            "name": p.name,
            "sku": p.sku,
            "uom": p.uom,
            "reorder_level": p.reorder_level
        })
    return jsonify(data)

@bp.route('/', methods=['POST'])
def create_product():
    body = request.json
    p = Product(name=body['name'], sku=body.get('sku'), uom=body.get('uom'), reorder_level=body.get('reorder_level',0))
    db.session.add(p)
    db.session.commit()
    return jsonify({"id": p.id, "message":"created"}), 201

@bp.route('/<int:pid>/stock', methods=['GET'])
def product_stock(pid):
    rows = StockLevel.query.filter_by(product_id=pid).all()
    return jsonify([{"warehouse_id": r.warehouse_id, "quantity": float(r.quantity)} for r in rows])
