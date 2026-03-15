import type { Restaurant } from "@/types/restaurant";
import { Star, ImageOff, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface Props {
  restaurant: Restaurant;
}

// Haversine formula — returns distance in km between two lat/lng points
// ── Delivery time helpers ────────────────────────────────────────────────────

const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// 10 min base prep + 3 min/km (≈20 km/h city traffic), min 15 min, max 60 min, rounded to 5
const estimateDeliveryTime = (distanceKm: number): number =>
  Math.min(60, Math.max(15, Math.round((10 + distanceKm * 3) / 5) * 5));

const RestaurantCard = ({ restaurant }: Props) => {
  const navigate = useNavigate();
  const [deliveryLabel, setDeliveryLabel] = useState<string>("...");
  
  useEffect(() => {
    const calculate = (userLat: number, userLng: number) => {
      const rLat = Number(restaurant.latitude);
      const rLng = Number(restaurant.longitude);
      if (!restaurant.latitude || !restaurant.longitude || isNaN(rLat) || isNaN(rLng)) {
        setDeliveryLabel("N/A");
        return;
      }
      const distKm = haversineKm(userLat, userLng, rLat, rLng);
      setDeliveryLabel(`${estimateDeliveryTime(distKm)} min`);
    };

    // 1. Try saved coords from ConfirmLocation first
    try {
      const raw = localStorage.getItem("active_location_coords");
      if (raw) {
        const { lat, lng } = JSON.parse(raw);
        if (typeof lat === "number" && typeof lng === "number") {
          calculate(lat, lng);
          return;
        }
      }
    } catch { /* fall through */ }

    // 2. Fallback: ask browser for live GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // Save for next time
          localStorage.setItem(
            "active_location_coords",
            JSON.stringify({ lat: latitude, lng: longitude })
          );
          calculate(latitude, longitude);
        },
        () => setDeliveryLabel("N/A")
      );
    } else {
      setDeliveryLabel("N/A");
    }
  }, [restaurant.latitude, restaurant.longitude]);

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
        {/* Row 1: Name + Pricing */}
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

        {/* Row 2: Rating + Cuisine */}
        <div className="flex items-center gap-2 mt-1">
          {restaurant.avg_rating != null && (
            <div className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs sm:text-sm font-medium text-card-foreground">
                {Number(restaurant.avg_rating).toFixed(1)}
              </span>
              {restaurant.total_ratings != null && (
                <span className="text-xs text-muted-foreground">
                  ({restaurant.total_ratings >= 1000
                    ? `${Math.floor(restaurant.total_ratings / 1000)}k+`
                    : restaurant.total_ratings}
                  )
                </span>
              )}
            </div>
          )}

          {restaurant.avg_rating != null && (
            <span className="text-xs text-muted-foreground">·</span>
          )}

          <p className="text-xs sm:text-sm text-muted-foreground">
            {restaurant.cuisine_type}
          </p>
        </div>

        {/* Row 3: Delivery time — NEW */}
        <div className="flex items-center gap-1 mt-1">
          <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">From {deliveryLabel}</span>
        </div>

      </div>
    </div>
  );
};

export default RestaurantCard;
