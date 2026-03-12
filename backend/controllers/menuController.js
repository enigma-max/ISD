import pool from "../config/db.js";

export const searchMenuItems = async (req, res) => {
  try {

    const { restaurant_id } = req.params;
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const sql = `
      SELECT 
        mi.menu_item_id,
        mi.name,
        mi.description,
        mi.price,
        mi.photo_url,
        s.section_name
      FROM menu_item mi
      JOIN section s ON mi.section_id = s.section_id
      WHERE s.restaurant_id = $1
      AND mi.name ILIKE $2
      ORDER BY mi.name
    `;

    const values = [restaurant_id, `%${q}%`];

    const result = await pool.query(sql, values);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};