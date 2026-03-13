import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, ImageOff } from "lucide-react";
// import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import BottomNavbar from "@/components/BottomNavbar";
import StarRating from "@/components/StarRating"
import type { Restaurant } from "@/types/restaurant";

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/restaurants/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setRestaurant(data);
      } catch (err) {
        setNotFound(true);
      }
      setLoading(false);
    };
    fetchRestaurant();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="w-full h-56 sm:h-72" />
          <div className="p-4 sm:p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        <BottomNavbar />
      </div>
    );
  }

  if (notFound || !restaurant) {
    return (
      <div className="min-h-screen bg-background pb-20 flex flex-col items-center justify-center">
        <p className="text-muted-foreground text-lg">Restaurant not found.</p>
        <button onClick={() => navigate("/")} className="mt-4 text-primary font-medium hover:underline">
          Go back home
        </button>
        <BottomNavbar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Cover */}
        <div className="relative">
          {restaurant.cover_url ? (
            <img
              src={restaurant.cover_url}
              alt={restaurant.name}
              className="w-full h-56 sm:h-72 lg:h-80 object-cover"
            />
          ) : (
            <div className="w-full h-56 sm:h-72 lg:h-80 bg-muted flex items-center justify-center">
              <ImageOff className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-card/80 backdrop-blur-sm rounded-full p-2 shadow hover:bg-card transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>

          {/* Logo overlay */}
          {restaurant.logo_url && (
            <div className="absolute -bottom-10 left-4 sm:left-6">
              <img
                src={restaurant.logo_url}
                alt={`${restaurant.name} logo`}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-4 border-card bg-card object-cover shadow-md"
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className={`p-4 sm:p-6 ${restaurant.logo_url ? "pt-14 sm:pt-16" : ""}`}>
          <h1 className="font-bold text-foreground text-xl sm:text-2xl lg:text-3xl">{restaurant.name}</h1>
          {restaurant.avg_rating != null && (
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={Number(restaurant.avg_rating)} />
              <span className="text-sm sm:text-base font-semibold text-foreground">
                {Number(restaurant.avg_rating).toFixed(1)}
              </span>
              {restaurant.total_ratings != null && (
                <span className="text-sm text-muted-foreground">
                  ({Number(restaurant.total_ratings) >= 1000
                    ? `${Math.floor(Number(restaurant.total_ratings) / 1000)}k+`
                    : restaurant.total_ratings})
                </span>
              )}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm sm:text-base text-muted-foreground">
            <span>{restaurant.cuisine_type}</span>
            {restaurant.pricing && <span>· {restaurant.pricing}</span>}
            {restaurant.rating && (
              <span className="flex items-center gap-1">
                · <span className="font-semibold text-yellow-500">★</span>
                {Number(restaurant.rating).toFixed(1)}
              </span>
            )}
          </div>
          {restaurant.description && (
            <p className="text-sm sm:text-base text-foreground/80 mt-4 leading-relaxed">
              {restaurant.description}
            </p>
          )}

          {/* Discount/Deal */}
          {(restaurant.discount_name || restaurant.discount) && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="font-semibold text-green-700">
                {restaurant.discount_name || "Special Offer"}
              </div>
              <div className="text-green-800 text-sm mt-1">
                {restaurant.discount ? `${restaurant.discount}% off` : null}
                {restaurant.start_date && restaurant.end_date && (
                  <span> · {restaurant.start_date} to {restaurant.end_date}</span>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 p-4 sm:p-6 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground text-sm sm:text-base text-center">
              Menu items will be available soon.
            </p>
          </div>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default RestaurantDetails;
