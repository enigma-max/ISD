import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import RestaurantCardSkeleton from "@/components/RestaurantCardSkeleton";
import BottomNavbar from "@/components/BottomNavbar";
import PaginationControls from "@/components/PaginationControls";
import { useRestaurants } from "@/hooks/useRestaurants";

const filters = ["Delivery", "Sort", "Free delivery"];
const PAGE_SIZE = 9;

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get("q") || "";
  const [query, setQuery] = useState(q);
  const [activeFilters, setActiveFilters] = useState<string[]>(["Delivery"]);
  const [page, setPage] = useState(1);

  const { restaurants, loading, totalPages } = useRestaurants({
    page,
    pageSize: PAGE_SIZE,
    searchQuery: q,
  });

  const toggleFilter = (f: string) => {
    setActiveFilters((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const handleSearch = () => {
    if (query.trim()) {
      setPage(1);
      navigate(`/search-results?q=${encodeURIComponent(query.trim())}`, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Search Header */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-4 pb-2">
          <button onClick={() => navigate("/search")} className="text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center bg-card border border-border rounded-full px-3 py-2.5">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 text-sm sm:text-base bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-2 overflow-x-auto">
          <button className="shrink-0 p-2 border border-border rounded-lg text-muted-foreground">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => toggleFilter(f)}
              className={`shrink-0 px-4 py-1.5 text-sm sm:text-base font-medium rounded-full border transition-colors ${
                activeFilters.includes(f)
                  ? "bg-foreground text-primary-foreground border-foreground"
                  : "bg-card text-foreground border-border hover:bg-secondary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="px-4 sm:px-6 pt-2">
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Search results for "<span className="text-foreground font-medium">{q}</span>"
          </p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <RestaurantCardSkeleton key={i} />
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <p className="text-muted-foreground text-center py-12 text-sm sm:text-base">
              No restaurants found for "{q}".
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {restaurants.map((r) => (
                <RestaurantCard key={r.restaurant_id} restaurant={r} />
              ))}
            </div>
          )}
          <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default SearchResultsPage;
