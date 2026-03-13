import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTopRated } from "@/hooks/useTopRated";
import { Skeleton } from "@/components/ui/skeleton";

const TopRatedCarousel = () => {
    const { restaurants, loading } = useTopRated();
    const scrollRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const scroll = (dir: "left" | "right") => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
        }
    };

    if (loading) {
        return (
            <div className="px-4 sm:px-6 py-3">
                <Skeleton className="h-6 w-48 mb-3" />
                <div className="flex gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="w-40 h-28 rounded-xl shrink-0" />
                    ))}
                </div>
            </div>
        );
    }

    if (restaurants.length === 0) return null;

    return (
        <div className="px-4 sm:px-6 py-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-foreground text-lg sm:text-xl">
                    Top Rated Restaurants
                </h2>
                <div className="hidden sm:flex items-center gap-1">
                    <button
                        onClick={() => scroll("left")}
                        className="p-1.5 rounded-full border border-border hover:bg-muted transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 text-foreground" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="p-1.5 rounded-full border border-border hover:bg-muted transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-foreground" />
                    </button>
                </div>
            </div>

            {/* Scrollable cards */}
            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto scrollbar-hide pb-1"
            >
                {restaurants.map((r) => (
                    <div
                        key={r.restaurant_id}
                        onClick={() => navigate(`/restaurant/${r.restaurant_id}`)}
                        className="shrink-0 w-40 sm:w-48 rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow group"
                    >
                        {/* Cover image */}
                        <div className="relative overflow-hidden">
                            <img
                                src={r.cover_url}
                                alt={r.name}
                                className="w-full h-24 sm:h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        {/* Info */}
                        <div className="p-2 bg-card">
                            <div className="flex items-center justify-between gap-1">
                                <p className="text-xs sm:text-sm font-semibold text-card-foreground line-clamp-1">
                                    {r.name}
                                </p>
                                <div className="flex items-center gap-0.5 shrink-0">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-bold text-card-foreground">
                                        {Number(r.avg_rating).toFixed(1)}
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {r.cuisine_type} 
                            </p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopRatedCarousel;