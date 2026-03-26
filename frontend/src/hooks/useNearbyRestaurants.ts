// hooks/useNearbyRestaurants.ts
import { useState, useEffect } from "react";
import type { Restaurant } from "@/types/restaurant";

interface UseNearbyRestaurantsOptions {
  page?: number;
  pageSize?: number;
  latitude?: number;
  longitude?: number;
}

export function useNearbyRestaurants({
  page = 1,
  pageSize = 9,
  latitude,
  longitude,
}: UseNearbyRestaurantsOptions) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // Only fetch if valid coordinates exist
    if (latitude == null || longitude == null) {
      setRestaurants([]);
      setTotalCount(0);
      return;
    }

    const fetchNearby = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("pageSize", String(pageSize));
        params.append("lat", String(latitude));
        params.append("lng", String(longitude));

        const res = await fetch(
          `https://foodpanda-search-backend.onrender.com/api/restaurants/nearby?${params.toString()}`
        );

        if (!res.ok) throw new Error("Failed to fetch nearby restaurants");

        const data = await res.json();
        setRestaurants(data.restaurants || []);
        setTotalCount(data.pagination?.totalCount ?? 0);
      } catch (err) {
        console.error("Error fetching nearby restaurants:", err);
        setRestaurants([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchNearby();
  }, [page, pageSize, latitude, longitude]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return { restaurants, loading, totalCount, totalPages, page };
}