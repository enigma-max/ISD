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

const getUserCoords = (): { lat: number; lng: number } | null => {
  try {
    const raw = localStorage.getItem("active_location_coords");
    if (!raw) return null;
    const { lat, lng } = JSON.parse(raw);
    if (typeof lat === "number" && typeof lng === "number") return { lat, lng };
    return null;
  } catch {
    return null;
  }
};

export function useRestaurants({ page = 1, pageSize = 9, searchQuery, latitude,
  longitude }: UseRestaurantsOptions = {}) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const userCoords = getUserCoords();
        const lat = latitude ?? userCoords?.lat;
        const lng = longitude ?? userCoords?.lng;

        let url;
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("pageSize", String(pageSize));
        if (searchQuery && searchQuery.trim()) params.append("q", searchQuery.trim());
        if (lat !== undefined && lng !== undefined) {
          params.append("lat", String(lat));
          params.append("lng", String(lng));
        }

        url = `https://foodpanda-search-backend.onrender.com/api/restaurants?${params.toString()}`;
        console.log("Fetching restaurants with URL:", url);
        const res = await fetch(url);
        
        if (!res.ok) throw new Error("Failed to fetch restaurants");
        const data = await res.json();
        // If backend returns an array, set totalCount to array length (no pagination info)
        setRestaurants(Array.isArray(data) ? data : data.restaurants || []);
        console.log("Fetched restaurants:", data);
        setTotalCount(Array.isArray(data) ? data.length : data.pagination?.totalCount ?? data.totalCount ?? 0);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setRestaurants([]);
        setTotalCount(0);
      }
      setLoading(false);
    };
    fetchRestaurants();
  }, [page, pageSize, searchQuery, latitude, longitude]);

  const totalPages = Math.ceil(totalCount / pageSize);
  console.log(restaurants);
  return { restaurants, loading, totalCount, totalPages, page };
}
