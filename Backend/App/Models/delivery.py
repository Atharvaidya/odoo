# Backend/Models/delivery.py
from ..App.db import db

class Delivery(db.Model):
    __tablename__ = "deliveries"

    id = db.Column(db.Integer, primary_key=True)
    customer = db.Column(db.String(150))
    status = db.Column(db.String(50), default="draft")
    created_at = db.Column(db.DateTime, server_default=db.func.now())


class DeliveryItem(db.Model):
    __tablename__ = "delivery_items"

    id = db.Column(db.Integer, primary_key=True)
    delivery_id = db.Column(db.Integer, db.ForeignKey("deliveries.id"))
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))

    quantity = db.Column(db.Integer, nullable=False)

    product = db.relationship("Product")
    delivery = db.relationship("Delivery")
