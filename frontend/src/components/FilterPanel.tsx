import SortOptions from "./SortOptions";
import CuisineFilter from "./CuisineFilter";
import PriceFilter from "./PriceFilter";
import FilterFooter from "./FilterFooter";
import { type Filters, defaultFilters } from "../utils/filterLogic";

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const FilterPanel = ({ filters, onChange }: FilterPanelProps) => {
  const update = (partial: Partial<Filters>) => onChange({ ...filters, ...partial });

  return (
    <aside className="filter-panel flex flex-col h-full bg-background rounded-xl shadow-lg p-4">
      <h2 className="text-xl font-bold text-primary mb-6 tracking-tight">Filters</h2>
      <div className="flex-1 overflow-y-auto flex flex-col gap-6">
        <div className="bg-muted rounded-lg p-4 mb-2">
          <h3 className="text-base font-semibold mb-3 text-foreground">Sort by</h3>
          <SortOptions value={filters.sortBy} onChange={(v) => update({ sortBy: v })} />
        </div>

        <div className="bg-muted rounded-lg p-4 mb-2">
          <h3 className="text-base font-semibold mb-3 text-foreground">Offers</h3>
          <div className="flex flex-col gap-3">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.freeDelivery}
                onChange={() => update({ freeDelivery: !filters.freeDelivery })}
                className="accent-primary w-5 h-5 rounded border border-border"
              />
              <span className="text-sm">Free delivery</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.acceptsVouchers}
                onChange={() => update({ acceptsVouchers: !filters.acceptsVouchers })}
                className="accent-primary w-5 h-5 rounded border border-border"
              />
              <span className="text-sm">Accepts vouchers</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.deals}
                onChange={() => update({ deals: !filters.deals })}
                className="accent-primary w-5 h-5 rounded border border-border"
              />
              <span className="text-sm">Deals</span>
            </label>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4 mb-2">
          <CuisineFilter
            selected={filters.cuisines}
            onChange={(cuisines) => update({ cuisines })}
          />
        </div>

        <div className="bg-muted rounded-lg p-4 mb-2">
          <PriceFilter
            selected={filters.priceRanges}
            onChange={(priceRanges: string[]) => update({ priceRanges })}
          />
        </div>
      </div>
      <div className="pt-4">
        <FilterFooter filters={filters} onClear={() => onChange(defaultFilters)} />
      </div>
    </aside>
  );
};

export default FilterPanel;
