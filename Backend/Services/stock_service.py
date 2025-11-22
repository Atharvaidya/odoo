# backend/Services/stock_service.py

from ..App.db import db
from ..Models.stock import StockLevel
from ..Models.product import Product


class StockService:

    @staticmethod
    def get_stock_by_product(product_id):
        """Return stock for a product across all warehouses."""
        stock = StockLevel.query.filter_by(product_id=product_id).all()
        return [
            {
                "warehouse_id": s.warehouse_id,
                "quantity": s.quantity
            } for s in stock
        ]

    @staticmethod
    def update_stock(product_id, warehouse_id, quantity_change):
        """
        Increase or decrease stock.
        quantity_change: +10 or -5
        """

        stock = StockLevel.query.filter_by(
            product_id=product_id,
            warehouse_id=warehouse_id
        ).first()

        if not stock:
            # create entry if not exists
            stock = StockLevel(
                product_id=product_id,
                warehouse_id=warehouse_id,
                quantity=0
            )
            db.session.add(stock)

        stock.quantity += quantity_change

        if stock.quantity < 0:
            raise ValueError("Stock cannot be negative")

        db.session.commit()
        return {"message": "Stock updated successfully"}

    @staticmethod
    def set_stock(product_id, warehouse_id, quantity):
        """Override stock count during adjustments."""
        stock = StockLevel.query.filter_by(
            product_id=product_id,
            warehouse_id=warehouse_id
        ).first()

        if not stock:
            stock = StockLevel(
                product_id=product_id,
                warehouse_id=warehouse_id,
                quantity=0
            )
            db.session.add(stock)

        stock.quantity = quantity
        db.session.commit()
        return {"message": "Stock adjusted successfully"}
