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

export const getMenuByRestaurant = async (req, res) => {
  try {
    const { restaurant_id } = req.params;

    const sql = `
      SELECT
        s.section_id,
        s.section_name,
        mi.menu_item_id,
        mi.name,
        mi.description,
        mi.price,
        mi.photo_url
      FROM section s
      LEFT JOIN menu_item mi ON mi.section_id = s.section_id
      WHERE s.restaurant_id = $1
      ORDER BY
        s.section_name ASC,
        mi.name ASC
    `;

    const result = await pool.query(sql, [restaurant_id]);

    // Group rows by section
    const sectionsMap = new Map();

    for (const row of result.rows) {
      if (!sectionsMap.has(row.section_id)) {
        sectionsMap.set(row.section_id, {
          section_id: row.section_id,
          section_name: row.section_name,
          items: [],
        });
      }

      if (row.menu_item_id) {
        sectionsMap.get(row.section_id).items.push({
          menu_item_id: row.menu_item_id,
          name: row.name,
          description: row.description,
          price: row.price,
          photo_url: row.photo_url,
        });
      }
    }

    const sections = Array.from(sectionsMap.values());

    res.json(sections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};