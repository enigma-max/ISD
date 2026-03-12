//for search
export const getRestaurantsQuery = `
SELECT
  r.restaurant_id,
  r.name,
  r.cuisine_type,
  r.pricing,
  r.logo_url,
  r.cover_url,
  COALESCE(AVG(rt.rating),0) as avg_rating
FROM restaurant r
LEFT JOIN rating rt
  ON rt.restaurant_id = r.restaurant_id
WHERE r.name ILIKE $3
GROUP BY r.restaurant_id
ORDER BY r.name
LIMIT $1 OFFSET $2
`;
// for search suggestions
export const getRestaurantSuggestionsQuery = `
SELECT name
FROM restaurant
WHERE name ILIKE $1
ORDER BY name
LIMIT 10
`;
