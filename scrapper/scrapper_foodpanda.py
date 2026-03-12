import requests
import time
import uuid
from supabase import create_client
from utils import map_pricing, safe_uuid

# -----------------------------
# SUPABASE CONFIG
# -----------------------------
SUPABASE_URL = "https://zzbkphxxvfiwnhkepzcf.supabase.co"
SUPABASE_KEY = "sb_secret_0twSmr28XfIqrT_BnUfWxw_w8tTAPPG"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# -----------------------------
# FOODPANDA API CONFIG
# -----------------------------
VENDOR_LIST_URL = "https://bd.fd-api.com/vendors-gateway/api/v1/pandora/vendors"
VENDOR_DETAIL_URL = "https://bd.fd-api.com/api/v5/vendors/{vendor_code}?include=menus,bundles,multiple_discounts&language_id=1&opening_type=delivery&basket_currency=BDT"

headers = {
    "x-disco-client-id": "pd-microfrontend/web-acquisition",
    "X-FP-API-KEY": "volo",
    "User-Agent": "Mozilla/5.0"
}

params = {
    "latitude": 23.803782,
    "longitude": 90.414964,
    "language_id": 1,
    "country": "bd",
    "limit": 20,
    "offset": 0
}

# -----------------------------
# FETCH RESTAURANTS LIST
# -----------------------------
def fetch_restaurants():
    restaurants = []
    for offset in range(0, 200, 20):
        params["offset"] = offset
        r = requests.get(VENDOR_LIST_URL, headers=headers, params=params)
        try:
            data = r.json()
            items = data.get("data", {}).get("items", [])
            restaurants.extend(items)
        except Exception as e:
            print("Failed to parse JSON:", e)
        time.sleep(1)
    return restaurants

def print_restaurant_info(restaurants):
    for r in restaurants:
        print("="*60)
        print(f"Name: {r.get('name')}")
        print(f"Description: {r.get('description') or 'N/A'}")
        # Pricing mapping (if budget is 1–5)
        budget = r.get('budget', 0)
        pricing = "৳" * budget if budget else "N/A"
        print(f"Pricing: {pricing}")
        
        # Cuisine
        cuisines = r.get('cuisines', [])
        cuisine_names = [c['name'] for c in cuisines]
        print(f"Cuisines: {', '.join(cuisine_names) if cuisine_names else 'N/A'}")
        
        # Images
        print(f"Cover URL: {r.get('hero_image') or 'N/A'}")
        print(f"Logo URL: {r.get('logo') or 'N/A'}")
        
        # Location
        latitude = r.get('latitude', 'N/A')
        longitude = r.get('longitude', 'N/A')
        print(f"Location: Latitude={latitude}, Longitude={longitude}")
        
        # Rating
        print(f"Rating: {r.get('rating', 'N/A')} ({r.get('review_number', 0)} reviews)")
        
        # Discounts
        discounts_info = r.get('discounts_info', [])
        if discounts_info:
            for d in discounts_info:
                print(f"Discount: {d.get('value')}%")
        else:
            print("Discount: None")
        
        # Menu placeholder (you will fetch separately)
        print("Menu Items: [Fetch separately per restaurant]")
        
        print("="*60, "\n")

# Example usage:

# -----------------------------
# INSERT RESTAURANT
# -----------------------------
def insert_restaurant(r):
    restaurant_data = {
        "restaurant_id": safe_uuid(),
        "name": r["name"],
        "description": r.get("description", ""),
        "pricing": map_pricing(r.get("budget", "1৳")),
        "cuisine_type": r["cuisines"][0] if r.get("cuisines") else "Unknown",
        "cover_url": r.get("hero_image", ""),
        "logo_url": r.get("logo", "")
    }
    res = supabase.table("restaurant").insert(restaurant_data).execute()
    return restaurant_data["restaurant_id"]

# -----------------------------
# INSERT RATING
# -----------------------------
def insert_rating(restaurant_id, r):
    rating = r.get("rating")
    if rating:
        supabase.table("rating").insert({
            "rating_id": safe_uuid(),
            "restaurant_id": restaurant_id,
            "rating": round(rating)
        }).execute()

# -----------------------------
# INSERT LOCATION
# -----------------------------
def insert_location(restaurant_id, r):
    supabase.table("location").insert({
        "location_id": safe_uuid(),
        "restaurant_id": restaurant_id,
        "latitude": r.get("latitude", 0),
        "longitude": r.get("longitude", 0)
    }).execute()

# -----------------------------
# FETCH MENU
# -----------------------------
def fetch_menu(vendor_code):
    url = VENDOR_DETAIL_URL.format(vendor_code=vendor_code)
    r = requests.get(url, headers=headers)
    try:
        return r.json()
    except Exception as e:
        print("Failed to parse menu JSON for vendor:", vendor_code, e)
        return {}

# -----------------------------
# INSERT MENU
# -----------------------------
def insert_menu(restaurant_id, menu_data):
    menus = menu_data.get("data", {}).get("menus", [])
    for m in menus:
        categories = m.get("menu_categories", [])
        for order, c in enumerate(categories):
            section_data = {
                "section_id": safe_uuid(),
                "restaurant_id": restaurant_id,
                "section_name": c.get("name", "Menu"),
                "display_order": order
            }
            res = supabase.table("section").insert(section_data).execute()
            section_id = section_data["section_id"]

            for item in c.get("products", []):
                menu_item = {
                    "menu_item_id": safe_uuid(),
                    "section_id": section_id,
                    "name": item.get("name", "Item"),
                    "description": item.get("description", ""),
                    "price": item.get("price", 0),
                    "photo_url": item.get("image_url", "")
                }
                supabase.table("menu_item").insert(menu_item).execute()

# -----------------------------
# MAIN PIPELINE
# -----------------------------
def run():
    restaurants = fetch_restaurants()
    
    print_restaurant_info(restaurants)

    

if __name__ == "__main__":
    run()