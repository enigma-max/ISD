import { countActiveFilters, type Filters } from "../utils/filterLogic";

interface FilterFooterProps {
  filters: Filters;
  onClear: () => void;
}

const FilterFooter = ({ filters, onClear }: FilterFooterProps) => {
  const active = countActiveFilters(filters);

  if (active === 0) return null;

  return (
    <div className="border-t border-border p-4 flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        {active} filter{active > 1 ? "s" : ""} active
      </span>
      <button
        onClick={onClear}
        className="text-sm font-medium text-primary hover:underline"
      >
        Clear all
      </button>
    </div>
  );
};

export default FilterFooter;
