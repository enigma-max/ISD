import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Restaurant } from "@/types/restaurant";

interface UseRestaurantsOptions {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export function useRestaurants({ page = 1, pageSize = 9, searchQuery }: UseRestaurantsOptions = {}) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      let query = supabase
        .from("restaurant")
        .select("*", { count: "exact" });

      if (searchQuery?.trim()) {
        query = query.ilike("name", `%${searchQuery.trim()}%`);
      }

      const { data, count, error } = await query
        .range(start, end)
        .order("name");

      if (error) {
        console.error("Error fetching restaurants:", error);
      } else {
        setRestaurants(data || []);
        setTotalCount(count || 0);
      }
      setLoading(false);
    };

    fetchRestaurants();
  }, [page, pageSize, searchQuery]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return { restaurants, loading, totalCount, totalPages, page };
}
