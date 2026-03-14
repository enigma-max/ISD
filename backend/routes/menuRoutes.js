import express from "express";
import {
  searchMenuItems,
  getMenuByRestaurant,
} from "../controllers/menuController.js";

const router = express.Router();

// Full menu for a restaurant (grouped by sections)
router.get("/:restaurant_id", getMenuByRestaurant);

// Search within a restaurant's menu
router.get("/:restaurant_id/search", searchMenuItems);

export default router;