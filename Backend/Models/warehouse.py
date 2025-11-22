# Backend/Models/warehouse.py

from ..App.db import db

class Warehouse(db.Model):
    __tablename__ = "warehouses"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    location = db.Column(db.String(255))

    # Relationship with stock levels
    stock_levels = db.relationship("StockLevel", back_populates="warehouse")

    # Relationship with receipts/deliveries/transfers
    receipts = db.relationship("Receipt", back_populates="warehouse")
    deliveries = db.relationship("Delivery", back_populates="warehouse")
    transfers_from = db.relationship("InternalTransfer", 
                                     foreign_keys="InternalTransfer.source_warehouse_id",
                                     back_populates="source_warehouse")

    transfers_to = db.relationship("InternalTransfer", 
                                   foreign_keys="InternalTransfer.dest_warehouse_id",
                                   back_populates="dest_warehouse")

    def __repr__(self):
        return f"<Warehouse {self.name}>"
