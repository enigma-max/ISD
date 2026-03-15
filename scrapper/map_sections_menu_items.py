import pandas as pd
import uuid

# ── Load files ────────────────────────────────────────────────────────────────
restaurants   = pd.read_csv('restaurant_rows.csv')
sections_df   = pd.read_csv('section_rows.csv')
menu_items_df = pd.read_csv('menu_item_rows.csv')
filtered      = pd.read_csv('filtered_restaurants.csv')

# ── Target cuisines ───────────────────────────────────────────────────────────
target_cuisines = ['Bengali', 'Mughlai', 'Fast Food', 'Italian', 'Chinese', 'Middle Eastern', 'Japanese']

# ── Build cuisine → sections → menu items template from dummy data ────────────
cuisine_map = {}

for _, r in restaurants.iterrows():
    cuisine = r['cuisine_type']
    rest_sections = sections_df[sections_df['restaurant_id'] == r['restaurant_id']]

    if cuisine not in cuisine_map:
        cuisine_map[cuisine] = {}

    for _, sec in rest_sections.iterrows():
        sec_name = sec['section_name']
        items = menu_items_df[menu_items_df['section_id'] == sec['section_id']][
            ['name', 'description', 'price', 'photo_url']
        ].to_dict('records')

        if sec_name not in cuisine_map[cuisine]:
            cuisine_map[cuisine][sec_name] = items
        else:
            # Merge items, avoid duplicates by name
            existing_names = {i['name'] for i in cuisine_map[cuisine][sec_name]}
            for item in items:
                if item['name'] not in existing_names:
                    cuisine_map[cuisine][sec_name].append(item)

# ── Map filtered restaurants — FIRST matched cuisine only ─────────────────────
new_sections   = []
new_menu_items = []

for _, rest in filtered.iterrows():
    rest_id       = rest['restaurant_id']
    rest_cuisines = [c.strip() for c in str(rest['cuisine_type']).split(',')]

    # Pick only the FIRST matched cuisine
    matched_cuisine = next((c for c in rest_cuisines if c in target_cuisines), None)

    if not matched_cuisine or matched_cuisine not in cuisine_map:
        continue

    display_order = 1
    for sec_name, items in cuisine_map[matched_cuisine].items():
        sec_id = str(uuid.uuid4())
        new_sections.append({
            'section_id':    sec_id,
            'restaurant_id': rest_id,
            'section_name':  sec_name,
            'display_order': display_order
        })
        display_order += 1
        for item in items:
            new_menu_items.append({
                'menu_item_id': str(uuid.uuid4()),
                'section_id':   sec_id,
                'name':         item['name'],
                'description':  item['description'],
                'price':        item['price'],
                'photo_url':    item['photo_url']
            })

# ── Save outputs ──────────────────────────────────────────────────────────────
sections_out   = pd.DataFrame(new_sections)
menu_items_out = pd.DataFrame(new_menu_items)

sections_out.to_csv('mapped_sections.csv',     index=False)
menu_items_out.to_csv('mapped_menu_items.csv', index=False)

print(f"Filtered restaurants : {len(filtered)}")
print(f"Generated sections   : {len(sections_out)}")
print(f"Generated menu items : {len(menu_items_out)}")
print("Saved to mapped_sections.csv and mapped_menu_items.csv")
