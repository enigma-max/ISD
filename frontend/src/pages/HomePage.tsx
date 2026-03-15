import { useState, useEffect } from "react";
import { MapPin, Heart } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import ConfirmLocation from "./ConfirmLocation";
import CuisineCarousel from "@/components/CuisineCarousel";
import RestaurantCard from "@/components/RestaurantCard";
import RestaurantCardSkeleton from "@/components/RestaurantCardSkeleton";
import BottomNavbar from "@/components/BottomNavbar";
import PaginationControls from "@/components/PaginationControls";
import { useRestaurants } from "@/hooks/useRestaurants";
import { cuisines, promoBanner } from "@/data/mockData";
import DiscountCarousel from "@/components/DiscountCarousel";
import TopRatedCarousel from "@/components/TopRatedCarousel";
import "../styles/variables.css"

const PAGE_SIZE = 9;

const HomePage = () => {
  const [page, setPage] = useState(1);
  const getCoordsFromStorage = () => {
    try {
      const raw = localStorage.getItem("active_location_coords");
      if (!raw) return {};
      const { lat, lng } = JSON.parse(raw);
      return { latitude: lat, longitude: lng };
    } catch { return {}; }
  };

  const [userCoords, setUserCoords] = useState(getCoordsFromStorage);
  const { restaurants, loading, totalPages } = useRestaurants({ page, pageSize: PAGE_SIZE, ...userCoords });
  const [activeLocation, setActiveLocation] = useState<string>("");
  const [showLocationPopup, setShowLocationPopup] = useState(() => {
    return !sessionStorage.getItem("location_confirmed");
  });

  useEffect(() => {
    const saved = localStorage.getItem("active_location") || "";
    if (saved) {
      setActiveLocation(saved);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await res.json();
          setActiveLocation(data.display_name);
        } catch {
          setActiveLocation("");
        }
      },
      () => {
        setActiveLocation("");
      }
    );
  }, []);

  const handleLocationConfirmed = () => {
    const loc = localStorage.getItem("active_location") || "";
    setActiveLocation(loc);
    setUserCoords(getCoordsFromStorage());
    sessionStorage.setItem("location_confirmed", "true");
    setShowLocationPopup(false);
  };

  useEffect(() => {
    if (!showLocationPopup) {
      const loc = localStorage.getItem("active_location") || "";
      setActiveLocation(loc);
    }
  }, [showLocationPopup]);

  const locationParts = activeLocation.split(",");
  const locationName = locationParts[0]?.trim() || "Select Location";
  const locationSub = locationParts.slice(1, 3).join(",").trim() || "";

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-4 pb-2">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowLocationPopup(true)}>
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <h1 className="font-bold text-foreground text-sm sm:text-base leading-tight">{locationName}</h1>
              {locationSub && <p className="text-xs sm:text-sm text-muted-foreground">{locationSub}</p>}
            </div>
          </div>
          <Heart className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
        </div>

        {/* Search */}
        <div className="px-4 sm:px-6 py-2">
          <SearchBar readOnly />
        </div>

        {/* GIF Banner */}
        <div className="px-4 sm:px-6 py-3">
          <div
            className="rounded-xl overflow-hidden shadow-sm flex items-center h-32 sm:h-48 lg:h-56"
            style={{ background: "linear-gradient(to right, var(--pink-light), var(--pink-mid))" }}
          >
            {/* Left: GIF */}
            <img
              // src="https://media.giphy.com/media/BFo2i7Y42HgHZOmewZ/giphy.gif"
              src="https://media.giphy.com/media/EE9yk4wxMmz0VswQha/giphy.gif"
              alt="Banner"
              className="h-full w-36 sm:w-52 lg:w-64 object-contain shrink-0"
            />

            {/* Right: Text */}
            <div className="flex-1 flex flex-col justify-center px-3 sm:px-6 gap-2 sm:gap-4">
              <p
                className="font-extrabold text-left text-base sm:text-2xl lg:text-3xl leading-snug"
                style={{ color: "var(--black)" }}
              >
                {/* Mobile: broken into lines */}
                <span className="sm:hidden">
                  Sign up for
                  <br />
                  <span style={{ color: "var(--pink)" }}>free delivery</span>
                  <br />
                  on your first order!
                </span>

                {/* Desktop: one line */}
                <span className="hidden sm:inline">
                  Sign up for{" "}
                  <span style={{ color: "var(--pink)" }}>free delivery</span>
                  {" "}on your first order!
                </span>
              </p>

              {/* Mobile button */}
              <div className="flex justify-end sm:hidden">
                <button
                  className="text-xs font-bold text-white px-3 py-1.5 rounded-full transition-opacity hover:opacity-90 whitespace-nowrap"
                  style={{ backgroundColor: "var(--pink)" }}
                >
                  Sign Up
                </button>
              </div>

              {/* Desktop button — bigger and more top margin */}
              <div className="hidden sm:flex justify-end mt-4 mr-4">
                <button
                  className="text-base lg:text-lg font-bold text-white px-5 py-3 lg:px-6 lg:py-4 rounded-2xl transition-opacity hover:opacity-90 whitespace-nowrap shadow-md"
                  style={{ backgroundColor: "var(--pink)" }}
                >
                  Sign Up
                </button>
              </div>

            </div>
          </div>
        </div>



        



        {/* Popular Cuisines */}
        <div className="px-4 sm:px-6 py-3">
          <CuisineCarousel cuisines={cuisines} />
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

        <DiscountCarousel />
        <TopRatedCarousel />
        {/* Restaurant Grid */}
        <div className="px-4 sm:px-6 pt-4">
          <h2 className="font-bold text-foreground text-lg sm:text-xl mb-4">Nearby Restaurants</h2>
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
      {showLocationPopup && (
        <ConfirmLocation onConfirm={handleLocationConfirmed} />
      )}
    </div>
  );
};

export default HomePage;
