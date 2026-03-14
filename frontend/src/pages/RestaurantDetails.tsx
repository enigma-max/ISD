import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ImageOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import BottomNavbar from "@/components/BottomNavbar";
import StarRating from "@/components/StarRating";
import "../styles/variables.css";

type MenuItem = {
  menu_item_id: number;
  name: string;
  description: string | null;
  price: number;
  photo_url: string | null;
  original_price?: number | null;
  is_popular?: boolean;
};

type MenuSection = {
  section_id: number;
  section_name: string;
  items: MenuItem[];
  is_popular?: boolean;
};

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({});

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

    const fetchMenu = async () => {
      if (!id) return;
      setMenuLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/restaurants/menu/${id}`,
        );
        if (!res.ok) {
          throw new Error("Failed to load menu");
        }
        const data = (await res.json()) as MenuSection[];
        setMenuSections(data);
        const firstWithItems = data.find(
          (section) => section.items && section.items.length > 0,
        );
        if (firstWithItems) {
          setActiveSectionId(firstWithItems.section_id);
        }
      } catch (error) {
        console.error(error);
        setMenuSections([]);
      } finally {
        setMenuLoading(false);
      }
    };

    fetchRestaurant();
    fetchMenu();
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
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-primary font-medium hover:underline"
        >
          Go back home
        </button>
        <BottomNavbar />
      </div>
    );
  }

  const hasMenu =
    menuSections.length > 0 &&
    menuSections.some((section) => section.items && section.items.length > 0);

  const handleSectionClick = (sectionId: number) => {
    setActiveSectionId(sectionId);
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 80; // approximate header height
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementTop - offset,
        behavior: "smooth",
      });
    }
  };

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
        <div
          className={`p-4 sm:p-6 ${
            restaurant.logo_url ? "pt-14 sm:pt-16" : ""
          }`}
        >
          <h1 className="font-bold text-foreground text-xl sm:text-2xl lg:text-3xl">
            {restaurant.name}
          </h1>
          {restaurant.avg_rating != null && (
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={Number(restaurant.avg_rating)} />
              <span className="text-sm sm:text-base font-semibold text-foreground">
                {Number(restaurant.avg_rating).toFixed(1)}
              </span>
              {restaurant.total_ratings != null && (
                <span className="text-sm text-muted-foreground">
                  {Number(restaurant.total_ratings) >= 1000
                    ? `${Math.floor(
                        Number(restaurant.total_ratings) / 1000,
                      )}k+`
                    : `(${restaurant.total_ratings})`}
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
            <div
              className="mt-4 pl-3 pr-8 py-3 rounded-xl inline-flex items-center gap-2 overflow-hidden relative"
              style={{ backgroundColor: "var(--pink-light)" }}
            >
              {/* Icon */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: "var(--pink)" }}
              >
                <span className="text-white text-xs font-bold">%</span>
              </div>

              {/* Text */}
              <div>
                <p
                  className="font-bold text-sm"
                  style={{ color: "var(--pink)" }}
                >
                  {restaurant.discount
                    ? `${
                        Number(restaurant.discount) % 1 === 0
                          ? Math.round(Number(restaurant.discount))
                          : Number(restaurant.discount)
                      }% off`
                    : null}
                </p>
                {restaurant.discount_name && (
                  <p className="text-xs" style={{ color: "var(--gray)" }}>
                    {restaurant.discount_name}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Menu sections */}
          <div className="mt-8">
            {menuLoading && (
              <div className="p-4 sm:p-6 bg-card rounded-xl border border-border space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            )}

            {!menuLoading && !hasMenu && (
              <div className="p-4 sm:p-6 bg-card rounded-xl border border-border">
                <p className="text-muted-foreground text-sm sm:text-base text-center">
                  Menu items will be available soon.
                </p>
              </div>
            )}

            {!menuLoading && hasMenu && (
              <div className="space-y-8">
                {/* Scrollable section tabs */}
                <div className="sticky top-0 z-20 bg-background pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-border">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {menuSections
                      .filter(
                        (section) =>
                          section.items && section.items.length > 0,
                      )
                      .map((section) => {
                        const isActive = section.section_id === activeSectionId;
                        return (
                          <button
                            key={section.section_id}
                            type="button"
                            onClick={() => handleSectionClick(section.section_id)}
                            className={`whitespace-nowrap rounded-full px-3 py-1 text-sm border transition-colors ${
                              isActive
                                ? "bg-foreground text-background border-foreground"
                                : "bg-card text-foreground border-border hover:bg-muted"
                            }`}
                          >
                            {section.section_name}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Section content */}
                {menuSections.map((section) =>
                  section.items && section.items.length > 0 ? (
                    <div
                      key={section.section_id}
                      ref={(el) => {
                        sectionRefs.current[section.section_id] = el;
                      }}
                      className="scroll-mt-24"
                    >
                      {section.is_popular ? (
                        <div className="mb-4">
                          <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
                            <span>🔥</span>
                            <span>{section.section_name}</span>
                          </h2>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Most ordered right now
                          </p>
                        </div>
                      ) : (
                        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
                          {section.section_name}
                        </h2>
                      )}

                      {section.is_popular ? (
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          {section.items.map((item) => (
                            <div
                              key={item.menu_item_id}
                              className="flex items-start gap-3 p-3 sm:p-4 rounded-xl border border-border bg-card"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm sm:text-base text-foreground">
                                  {item.name}
                                </p>
                                <div className="mt-1 flex items-baseline gap-2">
                                  <span className="text-sm sm:text-base font-semibold text-foreground">
                                    Tk {Number(item.price).toFixed(0)}
                                  </span>
                                  {item.original_price &&
                                    Number(item.original_price) >
                                      Number(item.price) && (
                                      <span className="text-xs sm:text-sm text-muted-foreground line-through">
                                        Tk{" "}
                                        {Number(item.original_price).toFixed(0)}
                                      </span>
                                    )}
                                </div>
                              </div>
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                {item.photo_url ? (
                                  <img
                                    src={item.photo_url}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                    <ImageOff className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {section.items.map((item) => (
                            <div
                              key={item.menu_item_id}
                              className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm sm:text-base text-foreground">
                                  {item.name}
                                </p>
                                <div className="mt-1 flex items-baseline gap-2">
                                  <span className="text-sm sm:text-base font-semibold text-foreground">
                                    Tk {Number(item.price).toFixed(0)}
                                  </span>
                                  {item.original_price &&
                                    Number(item.original_price) >
                                      Number(item.price) && (
                                      <span className="text-xs sm:text-sm text-muted-foreground line-through">
                                        Tk{" "}
                                        {Number(item.original_price).toFixed(0)}
                                      </span>
                                    )}
                                </div>
                                {item.description && (
                                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                                {item.is_popular && (
                                  <p className="mt-2 text-xs font-medium text-orange-500 flex items-center gap-1">
                                    <span>🔥</span>
                                    <span>Popular</span>
                                  </p>
                                )}
                              </div>
                              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                {item.photo_url ? (
                                  <img
                                    src={item.photo_url}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                    <ImageOff className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null,
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default RestaurantDetails;
