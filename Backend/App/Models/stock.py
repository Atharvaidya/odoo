# Backend/Models/stock.py

from App.db import db

class StockLevel(db.Model):
    __tablename__ = "stock_levels"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    warehouse_id = db.Column(db.Integer, db.ForeignKey("warehouses.id"))
    quantity = db.Column(db.Integer, default=0)

    product = db.relationship("Product", back_populates="stock_levels")
    warehouse = db.relationship("Warehouse", back_populates="stock_levels")
