interface CuisineFilterProps {
  selected: string[];
  onChange: (cuisines: string[]) => void;
}

const cuisines = [
  "Fast Food",
  "Fried Chicken",
  "Bangladeshi",
  "Burger",
  "Pizza",
  "Chinese",
  "Indian",
  "Middle Eastern",
  "Rice Dishes",
  "Cakes",
];

const CuisineFilter = ({ selected, onChange }: CuisineFilterProps) => {
  const toggle = (cuisine: string) => {
    onChange(
      selected.includes(cuisine)
        ? selected.filter((c) => c !== cuisine)
        : [...selected, cuisine]
    );
  };

  return (
    <div className="filter-section">
      <h3 className="text-base font-semibold mb-3 text-foreground">Cuisine type</h3>
      <div className="flex flex-col gap-3">
        {cuisines.map((c) => (
          <label key={c} className="inline-flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={selected.includes(c)}
              onChange={() => toggle(c)}
              className="accent-[#FF2B85] w-5 h-5 rounded border border-border"
            />
            <span className="text-sm">{c}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CuisineFilter;
