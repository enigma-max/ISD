import { useState, useEffect } from "react";

interface DiscountRestaurant {
  restaurant_id: string;
  name: string;
  cover_url: string;
  cuisine_type: string;
  pricing: string;
  discount: number;
  discount_name: string;
}

export function useTopDiscounts() {
  const [restaurants, setRestaurants] = useState<DiscountRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopDiscounts = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/restaurants/top-discounts");
        if (!res.ok) throw new Error("Failed to fetch top discounts");
        const data = await res.json();
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching top discounts:", err);
        setRestaurants([]);
      }
      setLoading(false);
    };
    fetchTopDiscounts();
  }, []);

  const highestDiscount = restaurants.length > 0
    ? Math.max(...restaurants.map((r) => Number(r.discount)))
    : null;

  return { restaurants, loading, highestDiscount };
}