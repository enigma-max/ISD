import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";

import RestaurantCard from "@/components/RestaurantCard";
import RestaurantCardSkeleton from "@/components/RestaurantCardSkeleton";
import PaginationControls from "@/components/PaginationControls";
import FilterPanel from "@/components/FilterPanel";

import { useRestaurants } from "@/hooks/useRestaurants";
import { defaultFilters, type Filters, applyFilters } from "@/utils/filterLogic";
import { countActiveFilters } from "@/utils/filterLogic";

const PAGE_SIZE = 9;

const RestaurantPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get the search query from the URL (?q=...)
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "";

  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<Filters>(filters);
  const [page, setPage] = useState(1);

  const { restaurants, loading, totalPages } = useRestaurants({
    page,
    pageSize: PAGE_SIZE,
    searchQuery,
  });

  // Apply filters after fetching
  const filteredRestaurants = applyFilters(restaurants, filters);
  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className="flex min-h-screen bg-background pb-20 relative">

      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-[320px] max-w-full bg-background shadow-lg transform transition-transform duration-300
        ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ minHeight: '100vh' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <FilterPanel filters={pendingFilters} onChange={setPendingFilters} />
          </div>
          <button
            className="w-full bg-[#FF2B85] text-primary-foreground py-3 font-semibold text-base hover:bg-[#D9226F] transition-all"
            onClick={() => {
              setFilters(pendingFilters);
              setDrawerOpen(false);
            }}
          >
            Apply Filters
            {countActiveFilters(pendingFilters) > 0 && (
              <span className="ml-2 bg-background text-primary rounded-full px-2 py-0.5 text-xs font-semibold">
                {countActiveFilters(pendingFilters)}
              </span>
            )}
          </button>
        </div>
      </div>


      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6">

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={() => navigate(-1)} 
              className="text-foreground p-2 hover:bg-secondary rounded-full transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex-1">
              <button
                onClick={() => navigate("/search")}
                className="flex items-center w-full bg-card border border-border rounded-full px-3 py-2.5 transition-all hover:border-muted-foreground/30"
              >
                <Search className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                <span className={`text-sm sm:text-base flex-1 text-left ${searchQuery ? "text-foreground" : "text-muted-foreground"}`}>
                  {searchQuery ? searchQuery : "Search Restaurants and Cuisine"}
                </span>
              </button>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Restaurants
          </h1>
          <button
            className="mt-4 bg-[#FF2B85] text-primary-foreground rounded-full shadow-lg px-5 py-3 flex items-center gap-2 hover:bg-[#D9226F] transition-all"
            onClick={() => {
              setPendingFilters(filters);
              setDrawerOpen(true);
            }}
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-background text-primary rounded-full px-2 py-0.5 text-xs font-semibold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No restaurants found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredRestaurants.map((r) => (
                <RestaurantCard key={r.restaurant_id} restaurant={r} />
              ))}
            </div>

            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default RestaurantPage;