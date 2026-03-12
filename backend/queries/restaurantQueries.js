//for search
//for search with location-based cuisine matching
export const getRestaurantsQuery = `
WITH search_results AS (
  SELECT
    r.restaurant_id,
    r.name,
    r.cuisine_type,
    r.pricing,
    r.logo_url,
    r.cover_url,
    COALESCE(AVG(rt.rating), 0) as avg_rating,
    l.latitude,
    l.longitude,
    1 as priority -- Direct name match gets highest priority
  FROM restaurant r
  LEFT JOIN rating rt ON rt.restaurant_id = r.restaurant_id
  LEFT JOIN location l ON l.restaurant_id = r.restaurant_id
  WHERE r.name ILIKE $3
  GROUP BY r.restaurant_id, l.latitude, l.longitude
  
  UNION
  
  SELECT
    r.restaurant_id,
    r.name,
    r.cuisine_type,
    r.pricing,
    r.logo_url,
    r.cover_url,
    COALESCE(AVG(rt.rating), 0) as avg_rating,
    l.latitude,
    l.longitude,
    2 as priority -- Cuisine match gets lower priority
  FROM restaurant r
  LEFT JOIN rating rt ON rt.restaurant_id = r.restaurant_id
  LEFT JOIN location l ON l.restaurant_id = r.restaurant_id
  WHERE r.cuisine_type IN (
    SELECT DISTINCT cuisine_type 
    FROM restaurant 
    WHERE name ILIKE $3
  )
  AND r.name NOT ILIKE $3 -- Exclude already matched by name
  AND ($4::numeric IS NULL OR $5::numeric IS NULL OR (
    -- Calculate distance if coordinates provided (Haversine formula approximation)
    (6371 * acos(
      cos(radians($4)) * cos(radians(l.latitude)) * 
      cos(radians(l.longitude) - radians($5)) + 
      sin(radians($4)) * sin(radians(l.latitude))
    )) <= 10 -- Within 10km radius
  ))
  GROUP BY r.restaurant_id, l.latitude, l.longitude
)
SELECT 
  restaurant_id,
  name,
  cuisine_type,
  pricing,
  logo_url,
  cover_url,
  avg_rating
FROM search_results
ORDER BY priority ASC, avg_rating DESC, name ASC
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
