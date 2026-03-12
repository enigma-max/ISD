const express = require("express");
const router = express.Router();

const { searchMenuItems } = require("../controllers/menuController");


router.get(
  "/:restaurant_id/search",
  searchMenuItems
);

module.exports = router;