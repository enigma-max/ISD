interface PriceFilterProps {
  selected: string[];
  onChange: (prices: string[]) => void;
}

const priceOptions = ["৳", "৳৳", "৳৳৳"];

const PriceFilter = ({ selected, onChange }: PriceFilterProps) => {
  const toggle = (price: string) => {
    onChange(
      selected.includes(price)
        ? selected.filter((p) => p !== price)
        : [...selected, price]
    );
  };

  return (
    <div className="filter-section">
      <h3 className="text-base font-semibold mb-3 text-foreground">Price Range</h3>
      <div className="flex flex-col gap-3">
        {priceOptions.map((p) => (
          <label key={p} className="inline-flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={selected.includes(p)}
              onChange={() => toggle(p)}
              className="accent-[#FF2B85] w-5 h-5 rounded border border-border"
            />
            <span className="text-sm">{p}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PriceFilter;
