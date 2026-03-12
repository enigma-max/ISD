import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabase";
import type { Restaurant } from "@/types/restaurant";

interface UseRestaurantsOptions {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  latitude?: number;
  longitude?: number;
}

export function useRestaurants({ page = 1, pageSize = 9, searchQuery,latitude,
  longitude }: UseRestaurantsOptions = {}) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("limit", String(pageSize));
        if (searchQuery && searchQuery.trim()) {
          params.append("q", searchQuery.trim());
        }
        // Add location if provided
        if (latitude !== undefined && longitude !== undefined) {
          params.append("lat", String(latitude));
          params.append("lng", String(longitude));
        }
        const res = await fetch(`http://localhost:5000/api/restaurants?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch restaurants");
        const data = await res.json();
        // If backend returns an array, set totalCount to array length (no pagination info)
        setRestaurants(Array.isArray(data) ? data : data.restaurants || []);
        console.log("Fetched restaurants:", data);
        setTotalCount(Array.isArray(data) ? data.length : data.totalCount || 0);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setRestaurants([]);
        setTotalCount(0);
      }
      setLoading(false);
    };
    fetchRestaurants();
  }, [page, pageSize, searchQuery]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return { restaurants, loading, totalCount, totalPages, page };
}
