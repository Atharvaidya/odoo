# backend/Utils/jwt_handler.py

import jwt
import datetime
from backend.App.config import SECRET_KEY


def create_token(data, expires_in=24):
    """
    Creates JWT valid for `expires_in` hours.
    """
    payload = {
        "data": data,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=expires_in)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def verify_token(token):
    """
    Validates JWT. Returns payload or None.
    """
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded["data"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
