interface SortOptionsProps {
  value: string;
  onChange: (value: string) => void;
}

const options = [
  { value: "relevance", label: "Relevance" },
  { value: "fastest", label: "Fastest delivery" },
  { value: "distance", label: "Distance" },
  { value: "topRated", label: "Top rated" },
];

const SortOptions = ({ value, onChange }: SortOptionsProps) => {
  return (
    <div className="filter-section">
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <label key={opt.value} className="inline-flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="radio"
              name="sortBy"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="accent-primary w-5 h-5 rounded-full border border-border"
            />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default SortOptions;
