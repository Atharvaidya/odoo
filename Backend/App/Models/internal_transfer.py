# Backend/Models/internal_transfer.py
from ..App.db import db

class InternalTransfer(db.Model):
    __tablename__ = "internal_transfers"

    id = db.Column(db.Integer, primary_key=True)
    from_location = db.Column(db.String(100))
    to_location = db.Column(db.String(100))
    status = db.Column(db.String(50), default="draft")
    created_at = db.Column(db.DateTime, server_default=db.func.now())
