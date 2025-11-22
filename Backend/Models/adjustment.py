# Backend/Models/adjustment.py
from ..App.db import db

class Adjustment(db.Model):
    __tablename__ = "adjustments"

    id = db.Column(db.Integer, primary_key=True)

    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    product = db.relationship("Product")

    warehouse_id = db.Column(db.Integer, db.ForeignKey("warehouses.id"))
    warehouse = db.relationship("Warehouse")

    difference = db.Column(db.Integer)   # +5, -3 etc.
    reason = db.Column(db.String(150))

    created_at = db.Column(db.DateTime, server_default=db.func.now())
