import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ImageOff } from "lucide-react";
import BottomNavbar from "@/components/BottomNavbar";
import StarRating from "@/components/StarRating";
import MenuSearchBar from "@/components/MenuSearchBar";
import MenuList from "@/components/MenuList";
import { MenuItem } from "@/components/MenuItemCard";
import "../styles/variables.css";

type MenuSection = {
  section_id: number;
  section_name: string;
  items: MenuItem[];
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
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({});



  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/restaurants/${id}`,
        );
        if (!res.ok) throw new Error();
        setRestaurant(await res.json());
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchMenu = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/restaurants/menu/${id}`,
        );
        const data = await res.json();

        setMenuSections(data);

        const first = data.find((s: any) => s.items?.length > 0);
        if (first) setActiveSectionId(first.section_id);
      } catch {
        setMenuSections([]);
      } finally {
        setMenuLoading(false);
      }
    };

    fetchRestaurant();
    fetchMenu();
  }, [id]);



  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const offset = 140;
      let closest: number | null = null;
      let min = Infinity;

      menuSections.forEach((section) => {
        const el = sectionRefs.current[section.section_id];
        if (!el) return;

        const dist = Math.abs(el.getBoundingClientRect().top - offset);

        if (dist < min) {
          min = dist;
          closest = section.section_id;
        }
      });

      if (closest !== null) setActiveSectionId(closest);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuSections]);



  const hasMenu =
    menuSections.length > 0 &&
    menuSections.some((s) => s.items?.length > 0);

 
const allMenuItems: MenuItem[] = (() => {
  const map = new Map<string, MenuItem>();
  menuSections.forEach((section) => {
    section.items?.forEach((item) => {
      map.set(item.menu_item_id.toString(), item); 
    });
  });
  return Array.from(map.values());
})();

  const filteredItems =
    searchQuery.trim() !== ""
      ? allMenuItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      : [];



  const handleSectionClick = (id: number) => {
    setActiveSectionId(id);
    const el = sectionRefs.current[id];
    if (!el) return;
    const offset = 120;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleSelectItem = (item: MenuItem) => {
    console.log("Selected:", item);
  };

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });



  if (loading) return null;

  if (notFound || !restaurant)
    return (
      <div className="p-6 text-center">
        Restaurant not found.
        <button
          onClick={() => navigate("/")}
          className="block mt-4 text-primary"
        >
          Go back home
        </button>
      </div>
    );


  return (
    <>

      <div className="bg-background min-h-screen pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">


          <div className="relative h-64 bg-muted rounded-xl overflow-hidden mt-6">
            {restaurant.cover_url ? (
              <img
                src={restaurant.cover_url}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageOff />
              </div>
            )}

            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 bg-card/80 backdrop-blur rounded-full p-2 shadow"
            >
              <ArrowLeft />
            </button>
          </div>


          <div className="p-6 space-y-3">
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>

            {restaurant.avg_rating && (
              <StarRating rating={restaurant.avg_rating} />
            )}

            {restaurant.description && (
              <p className="text-muted-foreground">{restaurant.description}</p>
            )}
          </div>
            {/* Discount/Deal */}
          {(restaurant.discount_name || restaurant.discount) && (
            <div
              className="mt-4 mb-6 pl-3 pr-8 py-3 rounded-xl inline-flex items-center gap-2 overflow-hidden relative"
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
                <p className="font-bold text-sm" style={{ color: "var(--pink)" }}>
                  {restaurant.discount ? `${Number(restaurant.discount) % 1 === 0
                    ? Math.round(Number(restaurant.discount))
                    : Number(restaurant.discount)}% off` : null}
                </p>
                {restaurant.discount_name && (
                  <p className="text-xs" style={{ color: "var(--gray)" }}>
                    {restaurant.discount_name}
                  </p>
                )}
              </div>
            </div>
          )}

          <MenuSearchBar
            query={searchQuery}
            onSearch={setSearchQuery}
            onClear={() => setSearchQuery("")}
          />


          {!menuLoading && hasMenu && (
            <>
              
              <div className="sticky top-0 bg-background border-b z-20 py-4">
  <div className="flex gap-2 overflow-x-auto">
    {menuSections
      .filter((s) => s.items?.length > 0)
      .map((section) => {
        const active = section.section_id === activeSectionId;

        return (
          <button
            key={section.section_id}
            onClick={() => handleSectionClick(section.section_id)}
            className={`px-4 py-2 rounded-full text-sm border shrink-0 ${
              active ? "text-white border-transparent" : "bg-card"
            }`}
            style={active ? { backgroundColor: "var(--pink)", borderColor: "var(--pink)", fontWeight: 600 } : {}}
          >
            {section.section_name}
          </button>
        );
      })}
  </div>
</div>

              <div className="space-y-10 py-6">
                {menuSections.map(
                  (section) =>
                    section.items?.length > 0 && (
                      <div
                        key={section.section_id}
                        ref={(el) => (sectionRefs.current[section.section_id] = el)}
                      >
                        <h2 className="text-xl font-semibold mb-4">{section.section_name}</h2>
                        <MenuList menuItems={section.items} onSelect={handleSelectItem} />
                      </div>
                    ),
                )}
              </div>
            </>
          )}
        </div>
      </div>


      {searchQuery && (
  <div className="fixed inset-0 bg-background z-50 flex flex-col">
    
    <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 pt-4 pb-3">
      <MenuSearchBar
        query={searchQuery}
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery("")}
        onBack={() => setSearchQuery("")} 
      />
    </div>

    
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3">
      <div className="max-w-5xl mx-auto">
        {filteredItems.length > 0 ? (
          <MenuList menuItems={filteredItems} onSelect={handleSelectItem} />
        ) : (
          <p className="text-muted-foreground text-center py-10">
            No results found for "{searchQuery}"
          </p>
        )}
      </div>
    </div>
  </div>
)}


      {showScrollTop && (
        <button
          onClick={scrollTop}
          className="fixed bottom-24 right-6 bg-foreground text-background px-4 py-2 rounded-full shadow"
        >
          ↑ Top
        </button>
      )}

      
      {!searchQuery && <BottomNavbar />}
    </>
  );
};

export default RestaurantDetails;