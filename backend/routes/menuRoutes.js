import express from "express";
import { searchMenuItems } from "../controllers/menuController.js";

const router = express.Router();

router.get("/:restaurant_id/search", searchMenuItems);

export default router;