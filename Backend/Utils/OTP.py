# backend/Utils/OTP.py

import random
import time

otp_storage = {}   # {email: {"otp":1234, "expires":1234567890}}

def generate_otp(email):
    otp = random.randint(100000, 999999)
    otp_storage[email] = {
        "otp": otp,
        "expires": time.time() + 300  # valid for 5 min
    }
    return otp


def verify_otp(email, otp_input):
    if email not in otp_storage:
        return False
    
    data = otp_storage[email]

    if time.time() > data["expires"]:
        return False

    return data["otp"] == int(otp_input)
