# Backend/Models/receipt.py
from ..App.db import db

class Receipt(db.Model):
    __tablename__ = "receipts"

    id = db.Column(db.Integer, primary_key=True)
    supplier = db.Column(db.String(150))
    status = db.Column(db.String(50), default="draft")
    created_at = db.Column(db.DateTime, server_default=db.func.now())


class ReceiptItem(db.Model):
    __tablename__ = "receipt_items"

    id = db.Column(db.Integer, primary_key=True)
    receipt_id = db.Column(db.Integer, db.ForeignKey("receipts.id"))
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))

    quantity = db.Column(db.Integer, nullable=False)

    product = db.relationship("Product")
    receipt = db.relationship("Receipt")
