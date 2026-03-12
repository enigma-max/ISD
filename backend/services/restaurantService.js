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