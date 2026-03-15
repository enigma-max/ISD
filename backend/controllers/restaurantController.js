import { 
  getRestaurants, 
  getRestaurantCount, 
  getRestaurantSuggestions, 
  getRestaurantDetails,
  getTopDiscountRestaurants,
  getTopRatedRestaurants,
  getNearbyRestaurants,
  getNearbyRestaurantsCount
} from "../services/restaurantService.js"

export const fetchRestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const searchQuery = req.query.q || '';
    const latitude = req.query.lat ? parseFloat(req.query.lat) : null;
    const longitude = req.query.lng ? parseFloat(req.query.lng) : null;

    console.log('fetching restaurants with query:', req.query);
    console.log('parsed params:', { page, pageSize, searchQuery, latitude, longitude });

    const restaurants = await getRestaurants(page, pageSize, searchQuery, latitude, longitude);
    const totalCount = await getRestaurantCount(searchQuery, latitude, longitude);
    const totalPages = Math.ceil(totalCount / pageSize);
    res.json({
      restaurants,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalCount
      }
    });
  } catch (error) {
    console.error('Error in fetchRestaurants:', error);
    res.status(500).json({ 
      error: 'Failed to fetch restaurants',
      message: error.message 
    });
  }
};
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

export const fetchTopDiscountRestaurants = async (req, res) => {
  try {
    const restaurants = await getTopDiscountRestaurants();
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};

// controllers/restaurantController.js
export const fetchTopRatedRestaurants = async (req, res) => {
  try {
    const restaurants = await getTopRatedRestaurants();
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};

export const fetchNearbyRestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 9;
    const latitude = parseFloat(req.query.lat);
    const longitude = parseFloat(req.query.lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: "lat and lng are required" });
    }

    const restaurants = await getNearbyRestaurants(page, pageSize, latitude, longitude);
    const totalCount = await getNearbyRestaurantsCount(latitude, longitude);
    const totalPages = Math.ceil(totalCount / pageSize);

    res.json({ restaurants, pagination: { currentPage: page, pageSize, totalPages, totalCount } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};