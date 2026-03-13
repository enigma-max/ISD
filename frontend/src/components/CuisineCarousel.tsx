import type { Cuisine } from "@/data/mockData";
import "../styles/variables.css"

interface Props {
  cuisines: Cuisine[];
}

const CuisineCarousel = ({ cuisines }: Props) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {cuisines.map((c) => (
        <div key={c.name} className="flex flex-col items-center shrink-0 cursor-pointer group">
          <div className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
            <img
              src={c.image}
              alt={c.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              loading="lazy"
            />
          </div>
          <span className="mt-1.5 text-xs sm:text-sm font-medium" style={{ color: "var(--pink)" }}>
  {c.name}
</span>
        </div>
      ))}
    </div>
  );
};

export default CuisineCarousel;
