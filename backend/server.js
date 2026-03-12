import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import restaurantRoutes from './routes/restaurantRoutes.js';

dotenv.config();

const app = express();

app.use(cors()); // allow frontend requests
app.use(express.json());

app.use('/api/restaurants', restaurantRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});