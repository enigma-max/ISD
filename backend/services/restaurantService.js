import pool from "../config/db.js"
import { getRestaurantsQuery } from "../queries/restaurantQueries.js"
import {getRestaurantSuggestionsQuery} from "../queries/restaurantQueries.js"
export const getRestaurants = async (limit, offset, search="") => {

  const result = await pool.query(
    getRestaurantsQuery,
    [limit, offset, `%${search}%`]
  )

  return result.rows
}

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

      COALESCE(AVG(rt.rating),0) AS rating,

      l.latitude,
      l.longitude,

      d.name AS discount_name,
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