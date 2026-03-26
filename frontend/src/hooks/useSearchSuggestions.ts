import { useEffect, useState } from "react";

export const useSearchSuggestions = (query: string) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://foodpanda-search-backend.onrender.com/api/restaurants/suggestions?query=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );

        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error(err);
        }
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);

    return () => {
      controller.abort();
      clearTimeout(debounce);
    };
  }, [query]);

  return suggestions;
};