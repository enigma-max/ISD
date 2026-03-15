import pool from "../config/db.js"
import { getRestaurantsQuery } from "../queries/restaurantQueries.js"
import {getRestaurantSuggestionsQuery} from "../queries/restaurantQueries.js"
import { getTopDiscountRestaurantsQuery } from "../queries/restaurantQueries.js";
import { getTopRatedRestaurantsQuery } from "../queries/restaurantQueries.js";
import { getNearbyRestaurantsQuery, getNearbyRestaurantsCountQuery } from "../queries/restaurantQueries.js";

export const getNearbyRestaurants = async (page, pageSize, latitude, longitude) => {
  const offset = (page - 1) * pageSize;
  const result = await pool.query(getNearbyRestaurantsQuery, [pageSize, offset, latitude, longitude]);
  return result.rows;
};

export const getNearbyRestaurantsCount = async (latitude, longitude) => {
  const result = await pool.query(getNearbyRestaurantsCountQuery, [latitude, longitude]);
  return parseInt(result.rows[0].total);
};

export const getRestaurants = async (page, pageSize, searchQuery = '', latitude = null, longitude = null) => {
  const offset = (page - 1) * pageSize;
  const searchPattern = `%${searchQuery}%`;

  // If lat/lng are provided, use distance filtering
  if(latitude == null && longitude == null) {
    console.log("Executing nearby restaurant query with lat lng null", "search:", searchQuery);
    
  }
  if (latitude != null && longitude != null) {
    console.log("Executing nearby restaurant query with lat:", latitude, "lng:", longitude, "search:", searchQuery);
    const query = `
      WITH filtered AS (
  SELECT
    r.restaurant_id,
    r.name,
    r.cuisine_type,
    r.pricing,
    r.logo_url,
    r.cover_url,
    l.latitude,
    l.longitude,
    rt.rating_id,
    rt.rating,
    (6371 * acos(
      LEAST(1.0,
        cos(radians($4)) * cos(radians(l.latitude)) *
        cos(radians(l.longitude) - radians($5)) +
        sin(radians($4)) * sin(radians(l.latitude))
      )
    )) AS distance_km
  FROM restaurant r
  LEFT JOIN location l ON r.restaurant_id = l.restaurant_id
  LEFT JOIN rating rt ON r.restaurant_id = rt.restaurant_id
  WHERE l.latitude IS NOT NULL
    AND l.longitude IS NOT NULL
    AND (
      r.name ILIKE $3
      OR r.cuisine_type IN (
        SELECT DISTINCT cuisine_type
        FROM restaurant
        WHERE name ILIKE $3
      )
    )
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
    COALESCE(ROUND(AVG(rating)::numeric,1),0) AS avg_rating,
    COUNT(rating_id) AS total_ratings,
    MIN(distance_km) AS distance_km
  FROM filtered
  GROUP BY restaurant_id, name, cuisine_type, pricing, logo_url, cover_url, latitude, longitude
  HAVING MIN(distance_km) <= 10
)
SELECT *
FROM aggregated
ORDER BY distance_km ASC, avg_rating DESC
LIMIT $1 OFFSET $2`;
    const result = await pool.query(query, [pageSize, offset, searchPattern, latitude, longitude]);
    return result.rows;
  }

  // If lat/lng not provided, just do search
  const query = `
    SELECT
      r.restaurant_id,
      r.name,
      r.cuisine_type,
      r.pricing,
      r.logo_url,
      r.cover_url,
      COALESCE(ROUND(AVG(rt.rating)::numeric,1),0) AS avg_rating,
      COUNT(rt.rating_id) AS total_ratings
    FROM restaurant r
    LEFT JOIN rating rt ON r.restaurant_id = rt.restaurant_id
    WHERE r.name ILIKE $3
    GROUP BY r.restaurant_id, r.name, r.cuisine_type, r.pricing, r.logo_url, r.cover_url
    ORDER BY name ASC
    LIMIT $1 OFFSET $2
  `;
  const result = await pool.query(query, [pageSize, offset, searchPattern]);
  return result.rows;
};

export const getRestaurantCount = async (searchQuery = '', latitude = null, longitude = null) => {
  const searchPattern = `%${searchQuery}%`;

  if (latitude != null && longitude != null) {
    const query = `
      SELECT COUNT(*) AS total
      FROM (
        SELECT r.restaurant_id,
          (6371 * acos(
            LEAST(1.0, cos(radians($2)) * cos(radians(l.latitude)) *
            cos(radians(l.longitude) - radians($3)) +
            sin(radians($2)) * sin(radians(l.latitude)))
          )) AS distance_km
        FROM restaurant r
        LEFT JOIN location l ON r.restaurant_id = l.restaurant_id
        WHERE r.name ILIKE $1
          AND l.latitude IS NOT NULL
          AND l.longitude IS NOT NULL
      ) t
      WHERE t.distance_km <= 10
    `;
    const result = await pool.query(query, [searchPattern, latitude, longitude]);
    return parseInt(result.rows[0].total);
  }

  const query = `
    SELECT COUNT(*) AS total
    FROM restaurant r
    WHERE r.name ILIKE $1
  `;
  const result = await pool.query(query, [searchPattern]);
  return parseInt(result.rows[0].total);
};

// export const getRestaurantCount = async (searchQuery, latitude, longitude) => {
//   const searchPattern = `%${searchQuery}%`;
  
//   const countQuery = `
//     SELECT COUNT(DISTINCT r.restaurant_id) as total
//     FROM restaurant r
//     LEFT JOIN location l ON l.restaurant_id = r.restaurant_id
//     WHERE r.name ILIKE $1
//     AND (
//       $2::numeric IS NULL OR $3::numeric IS NULL OR l.latitude IS NULL OR l.longitude IS NULL
//       OR (6371 * acos(
//         LEAST(1.0, cos(radians($2)) * cos(radians(l.latitude)) *
//         cos(radians(l.longitude) - radians($3)) +
//         sin(radians($2)) * sin(radians(l.latitude)))
//       )) <= 10
//     )
//   `;
  
//   const result = await pool.query(countQuery, [searchPattern, latitude, longitude]);
//   return parseInt(result.rows[0].total);
// };


export const getRestaurantSuggestions = async (query) => {
  const result = await pool.query(
    getRestaurantSuggestionsQuery,
    [`%${query}%`]
  )
  return result.rows.map(r => r.name) // return only names
}

export const getRestaurantDetails = async (id) => {

  const query = `
    SELECT 
      r.restaurant_id,
      r.name,
      r.description,
      r.pricing,
      r.cuisine_type,
      r.cover_url,
      r.logo_url,

      COALESCE(ROUND(AVG(rt.rating)::numeric, 1), 0) AS avg_rating,
      COUNT(rt.rating_id)                             AS total_ratings,

      l.latitude,
      l.longitude,

      d.discount_name AS discount_name,
      d.discount,
      d.start_date,
      d.end_date

    FROM restaurant r

    LEFT JOIN rating rt 
      ON r.restaurant_id = rt.restaurant_id

    LEFT JOIN location l 
      ON r.restaurant_id = l.restaurant_id

    LEFT JOIN discount d 
      ON r.restaurant_id = d.restaurant_id
      AND CURRENT_DATE BETWEEN d.start_date AND d.end_date

    WHERE r.restaurant_id = $1

    GROUP BY 
      r.restaurant_id,
      l.latitude,
      l.longitude,
      d.discount_id
  `

  const result = await pool.query(query,[id])

  return result.rows[0]
}


export const getTopDiscountRestaurants = async () => {
  const result = await pool.query(getTopDiscountRestaurantsQuery);
  return result.rows;
};

export const getTopRatedRestaurants = async () => {
  const result = await pool.query(getTopRatedRestaurantsQuery);
  return result.rows;
};