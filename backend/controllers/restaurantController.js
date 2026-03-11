import pool from '../config/db.js';

export const getAllRestaurants = async (req, res) => {
  try {
    const result = await pool.query('SELECT restaurant_id, name FROM restaurant');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};