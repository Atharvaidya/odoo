# Backend/Routes/auth_routes.py
from flask import Blueprint, request, jsonify
from ..App import db
from ..Models.User import User
import hashlib

bp = Blueprint("auth", __name__)

@bp.route("/signup", methods=["POST"])
def signup():
    data = request.json or {}
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    if not (username and email and password):
        return jsonify({"error":"username,email,password required"}), 400

    if User.query.filter((User.username==username)|(User.email==email)).first():
        return jsonify({"error":"user exists"}), 400

    pw_hash = hashlib.sha256(password.encode()).hexdigest()
    user = User(username=username, email=email, password_hash=pw_hash)
    db.session.add(user)
    db.session.commit()
    return jsonify({"id": user.id, "username": user.username}), 201

@bp.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")
    if not (username and password):
        return jsonify({"error":"username and password required"}), 400
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error":"invalid credentials"}), 401
    pw_hash = hashlib.sha256(password.encode()).hexdigest()
    if pw_hash != user.password_hash:
        return jsonify({"error":"invalid credentials"}), 401
    # no JWT here — return minimal response
    return jsonify({"id": user.id, "username": user.username})
