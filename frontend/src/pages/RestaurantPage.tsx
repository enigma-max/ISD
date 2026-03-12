import { useState, useEffect, useMemo } from "react";
import FilterPanel from "@/components/FilterPanel";
import RestaurantCard from "@/components/RestaurantCard";
import { type Restaurant } from "@/types/restaurant";
import { type Filters, defaultFilters, applyFilters } from "@/utils/filterLogic";
import "@/styles/filter.css";

const RestaurantPage = () => {

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/restaurants")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(
    () => applyFilters(restaurants, filters),
    [restaurants, filters]
  );

  return (
    <div className="flex min-h-screen bg-background">

      {/* Desktop filter sidebar */}
      <div className="hidden md:block">
        <FilterPanel filters={filters} onChange={setFilters} />
      </div>

      {/* Mobile overlay */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 bg-foreground/40 z-40 md:hidden"
          onClick={() => setMobileFiltersOpen(false)}
        />
      )}

      {/* Mobile filter drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-[300px] transform transition-transform duration-300 md:hidden ${
          mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <FilterPanel filters={filters} onChange={setFilters} />
      </div>


      <main className="flex-1 p-6">

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive font-medium">{error}</p>
            <p className="text-muted-foreground text-sm mt-1">
              Make sure your API server is running at http://localhost:5000
            </p>
          </div>
        )}

        {/* Restaurants */}
        {!loading && !error && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {filtered.length} restaurant{filtered.length !== 1 ? "s" : ""} found
            </p>

            <div className="restaurant-grid">
              {filtered.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.restaurant_id}
                  restaurant={restaurant}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground mt-12">
                No restaurants match your filters.
              </p>
            )}
          </>
        )}

      </main>
    </div>
  );
};

export default RestaurantPage;