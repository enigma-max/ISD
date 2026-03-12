import uuid

# Map raw Foodpanda pricing to allowed DB values
PRICING_MAP = {
    "1৳": "৳",
    "2৳": "৳৳",
    "3৳": "৳৳৳",
    "4৳": "৳৳৳"  # cap at 3৳
}

def map_pricing(raw_price: str) -> str:
    return PRICING_MAP.get(raw_price, "৳")  # default to 1৳ if unknown

def safe_uuid(value=None):
    return value if value else str(uuid.uuid4())