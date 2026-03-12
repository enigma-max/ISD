import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, ImageOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import BottomNavbar from "@/components/BottomNavbar";
import type { Restaurant } from "@/types/restaurant";

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("restaurant")
        .select("*")
        .eq("restaurant_id", id)
        .maybeSingle();

      if (error) {
        console.error("Error:", error);
        setNotFound(true);
      } else if (!data) {
        setNotFound(true);
      } else {
        setRestaurant(data);
      }
      setLoading(false);
    };
    fetch();
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
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {restaurant.cuisine_type}
            {restaurant.pricing && <span> · {restaurant.pricing}</span>}
          </p>
          {restaurant.description && (
            <p className="text-sm sm:text-base text-foreground/80 mt-4 leading-relaxed">
              {restaurant.description}
            </p>
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
