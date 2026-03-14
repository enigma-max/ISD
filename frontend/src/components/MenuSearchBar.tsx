import { X, ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MenuSearchBarProps {
  query: string;
  onSearch: (query: string) => void;
  onClear: () => void;
  onBack?: () => void; // optional back handler
}

const MenuSearchBar = ({
  query,
  onSearch,
  onClear,
  onBack,
}: MenuSearchBarProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 w-full">
      
      {onBack && (
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
      )}

      <div className="flex-1">
        
        <div className="flex items-center bg-white rounded-full px-4 py-2 w-full">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search menu items..."
            className="flex-1 bg-white outline-none px-2 text-gray-800"
          />
          {query && (
            <button onClick={onClear}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuSearchBar;