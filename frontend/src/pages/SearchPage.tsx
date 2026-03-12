import { useState } from "react";
import { ArrowLeft, Search, X, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CuisineCarousel from "@/components/CuisineCarousel";
import BottomNavbar from "@/components/BottomNavbar";
import { cuisines, popularSearches } from "@/data/mockData";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import SearchSuggestions from "@/components/SearchSuggestions";
const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const suggestions = useSearchSuggestions(query);
  const [recentSearches, setRecentSearches] = useState(["Panshi restaurant", "Digger", "Ramen"]);

  const handleSearch = () => {
    if (query.trim()) {
      if (!recentSearches.includes(query.trim())) {
        setRecentSearches((prev) => [query.trim(), ...prev]);
      }
      navigate(`/search-results?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleTagClick = (tag: string) => {
    if (!recentSearches.includes(tag)) {
      setRecentSearches((prev) => [tag, ...prev].slice(0, 5));
    }
    navigate(`/search-results?q=${encodeURIComponent(tag)}`);
  };

  const removeRecent = (item: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== item));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Search Header */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-4 pb-3">
          <button onClick={() => navigate(-1)} className="text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <div className="flex items-center bg-card border border-border rounded-full px-3 py-2.5">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />

              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search Restaurants and Cuisine"
                className="flex-1 text-sm sm:text-base bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              />

              {query && (
                <button onClick={() => setQuery("")}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            <SearchSuggestions
              suggestions={suggestions}
              query={query}
              onSelect={(value) => {
                setQuery(value);
                navigate(`/search-results?q=${encodeURIComponent(value)}`);
              }}
            />
          </div>
        </div>

        {/* Popular Cuisines */}
        <div className="px-4 sm:px-6 py-4">
          <h2 className="font-bold text-foreground text-base sm:text-lg mb-3">Popular Cuisines</h2>
          <CuisineCarousel cuisines={cuisines} />
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="px-4 sm:px-6 py-3">
            <h2 className="font-bold text-foreground text-base sm:text-lg mb-3">Recent searches</h2>
            <div className="space-y-1">
              {recentSearches.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between py-2.5 cursor-pointer hover:bg-secondary/50 rounded-lg px-2 -mx-2 transition-colors"
                  onClick={() => handleTagClick(item)}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm sm:text-base text-foreground">{item}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); removeRecent(item); }}>
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Searches */}
        <div className="px-4 sm:px-6 py-3">
          <h2 className="font-bold text-foreground text-base sm:text-lg mb-3">Popular searches</h2>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-4 py-2 text-sm sm:text-base font-medium text-foreground border border-border rounded-full hover:bg-secondary transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default SearchPage;
