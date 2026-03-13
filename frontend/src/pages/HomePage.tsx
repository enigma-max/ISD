import { useState } from "react";
import { MapPin, Heart } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import CuisineCarousel from "@/components/CuisineCarousel";
import RestaurantCard from "@/components/RestaurantCard";
import RestaurantCardSkeleton from "@/components/RestaurantCardSkeleton";
import BottomNavbar from "@/components/BottomNavbar";
import PaginationControls from "@/components/PaginationControls";
import { useRestaurants } from "@/hooks/useRestaurants";
import { cuisines, promoBanner } from "@/data/mockData";
import DiscountCarousel from "@/components/DiscountCarousel";

const PAGE_SIZE = 9;

const HomePage = () => {
  const [page, setPage] = useState(1);
  const { restaurants, loading, totalPages } = useRestaurants({ page, pageSize: PAGE_SIZE });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <h1 className="font-bold text-foreground text-sm sm:text-base leading-tight">Buet Chhatri Hall</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Dhaka</p>
            </div>
          </div>
          <Heart className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
        </div>

        {/* Search */}
        <div className="px-4 sm:px-6 py-2">
          <SearchBar readOnly />
        </div>

        {/* Promo Banner */}
        <div className="px-4 sm:px-6 py-3">
          <div className="relative rounded-xl overflow-hidden shadow-sm">
            <img src={promoBanner.image} alt="Promo" className="w-full h-36 sm:h-48 lg:h-56 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-transparent flex flex-col justify-center pl-4 sm:pl-8">
              <p className="text-primary-foreground font-bold text-lg sm:text-2xl leading-tight max-w-[60%]">
                {promoBanner.title}
              </p>
              <p className="text-primary-foreground/80 text-xs sm:text-sm mt-1">
                with code <span className="font-bold">{promoBanner.code}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Popular Cuisines */}
        <div className="px-4 sm:px-6 py-3">
          <CuisineCarousel cuisines={cuisines} />
        </div>
        <DiscountCarousel />
        {/* Restaurant Grid */}
        <div className="px-4 sm:px-6 pt-4">
          <h2 className="font-bold text-foreground text-lg sm:text-xl mb-4">All Restaurants</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <RestaurantCardSkeleton key={i} />
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <p className="text-muted-foreground text-center py-12 text-sm sm:text-base">No restaurants found.</p>
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

export default HomePage;
