# backend/Services/report_service.py

from ..Models.product import Product
from ..Models.stock import StockLevel
from ..App.db import db


class ReportService:

    @staticmethod
    def low_stock_report(threshold=10):
        """Return all products whose stock is below threshold."""
        low_stock_products = db.session.query(Product, StockLevel).join(
            StockLevel, Product.id == StockLevel.product_id
        ).filter(StockLevel.quantity < threshold).all()

        result = []
        for product, stock in low_stock_products:
            result.append({
                "product_id": product.id,
                "product_name": product.name,
                "warehouse_id": stock.warehouse_id,
                "quantity": stock.quantity
            })

        return result

    @staticmethod
    def stock_summary():
        """Return list of all products and their total stock."""
        products = Product.query.all()
        summary = []

        for product in products:
            total_qty = db.session.query(
                db.func.sum(StockLevel.quantity)
            ).filter_by(product_id=product.id).scalar() or 0

            summary.append({
                "product_id": product.id,
                "name": product.name,
                "total_stock": total_qty
            })

        return summary
