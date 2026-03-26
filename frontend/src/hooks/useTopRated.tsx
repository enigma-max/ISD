// hooks/useTopRated.ts
import { useState, useEffect } from "react";

interface TopRatedRestaurant {
  restaurant_id: string;
  name: string;
  cover_url: string;
  cuisine_type: string;
  pricing: string;
  avg_rating: number;
  total_ratings: number;
}

export function useTopRated() {
  const [restaurants, setRestaurants] = useState<TopRatedRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRated = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://foodpanda-search-backend.onrender.com/api/restaurants/top-rated");
        if (!res.ok) throw new Error("Failed to fetch top rated");
        const data = await res.json();
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching top rated:", err);
        setRestaurants([]);
      }
      setLoading(false);
    };
    fetchTopRated();
  }, []);

  return { restaurants, loading };
}