import type { Restaurant } from "@/types/restaurant";
import { Star, ImageOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/restaurant/${restaurant.restaurant_id}`)}
      className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="relative overflow-hidden">
        {restaurant.cover_url ? (
          <img
            src={restaurant.cover_url}
            alt={restaurant.name}
            className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-44 sm:h-48 bg-muted flex items-center justify-center">
            <ImageOff className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-card-foreground text-sm sm:text-base leading-tight line-clamp-1">
            {restaurant.name}
          </h3>
          {restaurant.pricing && (
            <span className="text-xs sm:text-sm text-muted-foreground shrink-0">
              {restaurant.pricing}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {restaurant.cuisine_type}
        </p>
      </div>
    </div>
  );
};

export default RestaurantCard;
