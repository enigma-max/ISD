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

    const discountSql = `
      SELECT d.discount
      FROM discount d
      WHERE d.restaurant_id = $1
        AND CURRENT_DATE BETWEEN d.start_date AND d.end_date
      ORDER BY d.discount DESC
      LIMIT 1
    `;

    const discountResult = await pool.query(discountSql, [restaurant_id]);
    const discountPercent =
      discountResult.rows.length > 0
        ? Number(discountResult.rows[0].discount)
        : null;

    const applyDiscount = (price) => {
      const base = Number(price);
      if (
        !discountPercent ||
        Number.isNaN(discountPercent) ||
        discountPercent <= 0 ||
        Number.isNaN(base)
      ) {
        return { price: base, original_price: null };
      }
      const discounted = Math.round(base * (1 - discountPercent / 100));
      return { price: discounted, original_price: base };
    };

    const popularSql = `
      SELECT
        mi.menu_item_id,
        mi.name,
        mi.description,
        mi.price,
        mi.photo_url
      FROM menu_item mi
      JOIN section s ON mi.section_id = s.section_id
      WHERE s.restaurant_id = $1
        -- For now, treat some items as "popular" without requiring extra columns.
        -- This can later be refined to use a real is_popular flag or sales data.
      ORDER BY
        mi.menu_item_id ASC
      LIMIT 5
    `;

    const popularResult = await pool.query(popularSql, [restaurant_id]);
    const popularItems = popularResult.rows.map((item) => {
      const { price, original_price } = applyDiscount(item.price);
      return { ...item, price, original_price };
    });
    const popularIds = new Set(popularItems.map((item) => item.menu_item_id));

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
        const { price, original_price } = applyDiscount(row.price);
        sectionsMap.get(row.section_id).items.push({
          menu_item_id: row.menu_item_id,
          name: row.name,
          description: row.description,
          price,
          original_price,
          photo_url: row.photo_url,
          is_popular: popularIds.has(row.menu_item_id),
        });
      }
    }

    let sections = Array.from(sectionsMap.values());

    if (popularItems.length > 0) {
      const popularSection = {
        section_id: -1,
        section_name: "Popular",
        is_popular: true,
        items: popularItems.map((item) => ({
          menu_item_id: item.menu_item_id,
          name: item.name,
          description: item.description,
          price: item.price,
          original_price: item.original_price,
          photo_url: item.photo_url,
          is_popular: true,
        })),
      };

      sections = [popularSection, ...sections];
    }

    res.json(sections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};