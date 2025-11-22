from ..App.db import db
from datetime import datetime

class StockLevel(db.Model):
    __tablename__ = 'stock_levels'
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouses.id'), nullable=False)
    quantity = db.Column(db.Numeric(14,4), default=0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    product = db.relationship('Product', backref=db.backref('stock_levels', lazy=True))
    warehouse = db.relationship('Warehouse', backref=db.backref('stock_levels', lazy=True))
