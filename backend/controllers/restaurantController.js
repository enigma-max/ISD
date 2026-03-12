import { getRestaurants } from "../services/restaurantService.js"
import {getRestaurantSuggestions} from "../services/restaurantService.js"
export const fetchRestaurants = async (req,res)=>{

  try{

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ""  // <-- new line

    const offset = (page-1)*limit

    const restaurants = await getRestaurants(limit, offset, search)

    res.json(restaurants)

  }catch(err){

    console.error(err)
    res.status(500).json({error:"server error"})

  }

}
export const fetchSuggestions = async (req, res) => {
  try {
    const query = req.query.query || ""
    if (!query) return res.json([])

    const suggestions = await getRestaurantSuggestions(query)
    res.json(suggestions)
  } catch(err) {
    console.error(err)
    res.status(500).json({ error: "server error" })
  }
}