import express from "express"
import { fetchRestaurants } from "../controllers/restaurantController.js"
import {fetchSuggestions} from "../controllers/restaurantController.js"
import {fetchRestaurantDetails} from "../controllers/restaurantController.js"
import { fetchTopDiscountRestaurants } from "../controllers/restaurantController.js"
import { fetchTopRatedRestaurants } from "../controllers/restaurantController.js"
import { fetchNearbyRestaurants } from "../controllers/restaurantController.js"

const router = express.Router()

router.get("/",fetchRestaurants)
router.get("/suggestions", fetchSuggestions)
router.get('/top-discounts', fetchTopDiscountRestaurants);
router.get('/top-rated', fetchTopRatedRestaurants);
router.get('/nearby', fetchNearbyRestaurants);
router.get("/:id", fetchRestaurantDetails)
export default router