export const getRestaurantsQuery = `
WITH all_results AS (
  -- Priority 1: Direct name match
  SELECT
    r.restaurant_id,
    r.name,
    r.cuisine_type,
    r.pricing,
    r.logo_url,
    r.cover_url,
    rt.rating,
    rt.rating_id,
    l.latitude,
    l.longitude,
    1 AS base_priority,
    0 AS distance_km -- name match gets 0 distance bonus
  FROM restaurant r
  LEFT JOIN rating rt ON rt.restaurant_id = r.restaurant_id
  LEFT JOIN location l ON l.restaurant_id = r.restaurant_id
  WHERE r.name ILIKE $3

  UNION ALL

  -- Priority 2: Same cuisine as name match, include distance if coords available
  SELECT
    r.restaurant_id,
    r.name,
    r.cuisine_type,
    r.pricing,
    r.logo_url,
    r.cover_url,
    rt.rating,
    rt.rating_id,
    l.latitude,
    l.longitude,
    2 AS base_priority,
    COALESCE(
      6371 * acos(
        LEAST(1.0, cos(radians($4)) * cos(radians(l.latitude)) *
        cos(radians(l.longitude) - radians($5)) +
        sin(radians($4)) * sin(radians(l.latitude)))
      ), 10
    ) AS distance_km
  FROM restaurant r
  LEFT JOIN rating rt ON rt.restaurant_id = r.restaurant_id
  LEFT JOIN location l ON l.restaurant_id = r.restaurant_id
  WHERE r.cuisine_type IN (
    SELECT DISTINCT cuisine_type
    FROM restaurant
    WHERE name ILIKE $3
  )
  AND r.name NOT ILIKE $3

  UNION ALL

  -- Priority 3: Nearby restaurants (any cuisine) not included above
  SELECT
    r.restaurant_id,
    r.name,
    r.cuisine_type,
    r.pricing,
    r.logo_url,
    r.cover_url,
    rt.rating,
    rt.rating_id,
    l.latitude,
    l.longitude,
    3 AS base_priority,
    6371 * acos(
      LEAST(1.0, cos(radians($4)) * cos(radians(l.latitude)) *
      cos(radians(l.longitude) - radians($5)) +
      sin(radians($4)) * sin(radians(l.latitude)))
    ) AS distance_km
  FROM restaurant r
  LEFT JOIN rating rt ON rt.restaurant_id = r.restaurant_id
  LEFT JOIN location l ON l.restaurant_id = r.restaurant_id
  WHERE $4::numeric IS NOT NULL AND $5::numeric IS NOT NULL
    AND l.latitude IS NOT NULL AND l.longitude IS NOT NULL
    AND r.restaurant_id NOT IN (
      SELECT restaurant_id
      FROM all_results
    )
    AND (6371 * acos(
      LEAST(1.0, cos(radians($4)) * cos(radians(l.latitude)) *
      cos(radians(l.longitude) - radians($5)) +
      sin(radians($4)) * sin(radians(l.latitude)))
    )) <= 10
),
aggregated AS (
  SELECT
    restaurant_id,
    name,
    cuisine_type,
    pricing,
    logo_url,
    cover_url,
    latitude,
    longitude,
    MIN(base_priority) AS base_priority,
    COALESCE(ROUND(AVG(rating)::numeric, 1), 0) AS avg_rating,
    COUNT(rating_id) AS total_ratings,
    MIN(distance_km) AS distance_km
  FROM all_results
  GROUP BY
    restaurant_id,
    name,
    cuisine_type,
    pricing,
    logo_url,
    cover_url,
    latitude,
    longitude
)
SELECT
  restaurant_id,
  name,
  cuisine_type,
  pricing,
  logo_url,
  cover_url,
  avg_rating,
  total_ratings,
  latitude,
  longitude,
  distance_km,
  -- Compute final priority score: lower is better
  (base_priority - COALESCE((10 - distance_km)/10, 0)) AS priority_score
FROM aggregated
ORDER BY priority_score ASC, avg_rating DESC, name ASC
LIMIT $1 OFFSET $2;
`;
// for search suggestions
export const getRestaurantSuggestionsQuery = `
SELECT name
FROM restaurant
WHERE name ILIKE $1
ORDER BY name
LIMIT 10
`;

// Nearby restaurants within 10km, ordered by distance
export const getNearbyRestaurantsQuery = `
WITH nearby AS (
  SELECT
    r.restaurant_id,
    r.name,
    r.cuisine_type,
    r.pricing,
    r.logo_url,
    r.cover_url,
    l.latitude,
    l.longitude,
    rt.rating,
    rt.rating_id,
    (6371 * acos(
      LEAST(1.0, cos(radians($3)) * cos(radians(l.latitude)) *
      cos(radians(l.longitude) - radians($4)) +
      sin(radians($3)) * sin(radians(l.latitude)))
    )) AS distance_km
  FROM restaurant r
  LEFT JOIN rating rt ON rt.restaurant_id = r.restaurant_id
  LEFT JOIN location l ON l.restaurant_id = r.restaurant_id
  WHERE l.latitude IS NOT NULL AND l.longitude IS NOT NULL
  AND (6371 * acos(
    LEAST(1.0, cos(radians($3)) * cos(radians(l.latitude)) *
    cos(radians(l.longitude) - radians($4)) +
    sin(radians($3)) * sin(radians(l.latitude)))
  )) <= 10
),
aggregated AS (
  SELECT
    restaurant_id,
    name,
    cuisine_type,
    pricing,
    logo_url,
    cover_url,
    latitude,
    longitude,
    MIN(distance_km)                              AS distance_km,
    COALESCE(ROUND(AVG(rating)::numeric, 1), 0)   AS avg_rating,
    COUNT(rating_id)                              AS total_ratings
  FROM nearby
  GROUP BY
    restaurant_id, name, cuisine_type, pricing,
    logo_url, cover_url, latitude, longitude
)
SELECT
  restaurant_id,
  name,
  cuisine_type,
  pricing,
  logo_url,
  cover_url,
  avg_rating,
  total_ratings,
  latitude,
  longitude,
  distance_km
FROM aggregated
ORDER BY distance_km ASC
LIMIT $1 OFFSET $2
`;

// Count for nearby restaurants
export const getNearbyRestaurantsCountQuery = `
SELECT COUNT(DISTINCT r.restaurant_id) AS total
FROM restaurant r
LEFT JOIN location l ON l.restaurant_id = r.restaurant_id
WHERE l.latitude IS NOT NULL AND l.longitude IS NOT NULL
AND (6371 * acos(
  LEAST(1.0, cos(radians($1)) * cos(radians(l.latitude)) *
  cos(radians(l.longitude) - radians($2)) +
  sin(radians($1)) * sin(radians(l.latitude)))
)) <= 10
`;

export const getTopDiscountRestaurantsQuery = `
SELECT 
    r.restaurant_id,
    r.name,
    r.cover_url,
    r.logo_url,
    r.cuisine_type,
    d.discount,
    d.discount_name
  FROM restaurant r
  JOIN discount d ON d.restaurant_id = r.restaurant_id
  WHERE CURRENT_DATE BETWEEN d.start_date AND d.end_date
  AND d.discount = (
    SELECT MAX(discount) FROM discount
    WHERE CURRENT_DATE BETWEEN start_date AND end_date
  )
  AND CURRENT_DATE BETWEEN start_date AND end_date
  ORDER BY r.name ASC;
`

export const getTopRatedRestaurantsQuery = `
  SELECT 
    r.restaurant_id,
    r.name,
    r.cover_url,
    r.cuisine_type,
    r.pricing,
    COALESCE(ROUND(AVG(rt.rating)::numeric, 1), 0) AS avg_rating,
    COUNT(rt.rating_id)                             AS total_ratings
  FROM restaurant r
  LEFT JOIN rating rt ON rt.restaurant_id = r.restaurant_id
  GROUP BY r.restaurant_id
  HAVING COUNT(rt.rating_id) > 0
  ORDER BY avg_rating DESC, total_ratings DESC
  LIMIT 10
`;