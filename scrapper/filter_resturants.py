import pandas as pd

# Load the CSV
df = pd.read_csv('foodpanda_bd_nationwide_xlsx_-_Restaurant.csv')

# Filter rows where all fields are filled (no nulls, no empty strings)
df_full = df.dropna()
df_full = df_full[df_full.apply(lambda r: r.str.strip().ne('').all(), axis=1)]

# Target cuisines - exact match within the comma-separated cuisine_type field
target_cuisines = {'Bengali', 'Mughlai', 'Fast Food', 'Italian', 'Chinese', 'Middle Eastern', 'Japanese'}

def has_exact_cuisine_match(cuisine_str):
    cuisines = [c.strip() for c in cuisine_str.split(',')]
    return any(c in target_cuisines for c in cuisines)

filtered = df_full[df_full['cuisine_type'].apply(has_exact_cuisine_match)].reset_index(drop=True)

# Save output
filtered.to_csv('filtered_restaurants.csv', index=False, quoting=1)  # quoting=1 = QUOTE_ALL

print(f"Total rows: {len(df)}")
print(f"Rows with all fields filled: {len(df_full)}")
print(f"Rows after cuisine filter: {len(filtered)}")
print("Saved to filtered_restaurants.csv")