import { Search } from "lucide-react";

interface Props {
  suggestions: string[];
  query: string;
  onSelect: (value: string) => void;
}

const SearchSuggestions = ({ suggestions, query, onSelect }: Props) => {
  if (!query.trim()) return null;

  return (
    <div className="absolute left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">

      {/* Suggestions */}
      {suggestions.map((item) => (
        <div
          key={item}
          onClick={() => onSelect(item)}
          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-secondary transition"
        >
          <div className="w-9 h-9 flex items-center justify-center bg-secondary rounded-lg">
            <Search className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{item}</span>
            <span className="text-xs text-muted-foreground">in Restaurants</span>
          </div>
        </div>
      ))}

      {/* Search query option */}
      <div
        onClick={() => onSelect(query)}
        className="px-4 py-3 text-sm font-medium text-foreground cursor-pointer hover:bg-secondary border-t"
      >
        Search for "<span className="font-semibold">{query}</span>"
      </div>
    </div>
  );
};

export default SearchSuggestions;