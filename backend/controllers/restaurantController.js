import { getRestaurants } from "../services/restaurantService.js"
import {getRestaurantSuggestions} from "../services/restaurantService.js"
import {getRestaurantDetails} from "../services/restaurantService.js"
export const fetchRestaurants = async (req,res)=>{

  try{
    console.log("fetching restaurants with query:", req.query)  // <-- new line
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

export const fetchRestaurantDetails = async (req,res)=>{

  try{

    const id = req.params.id

    const restaurant = await getRestaurantDetails(id)

    if(!restaurant){
      return res.status(404).json({error:"Restaurant not found"})
    }

    res.json(restaurant)

  }catch(err){

    console.error(err)
    res.status(500).json({error:"server error"})

  }

}