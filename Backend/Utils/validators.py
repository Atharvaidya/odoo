# backend/Utils/validators.py

def validate_product_data(data):
    required = ["name", "sku", "category_id", "uom"]
    
    for field in required:
        if field not in data:
            return False, f"Missing field: {field}"

    return True, "Valid"


def validate_quantity(qty):
    if qty is None:
        return False
    try:
        return int(qty) >= 0
    except:
        return False


def validate_string(s):
    return isinstance(s, str) and len(s.strip()) > 0
