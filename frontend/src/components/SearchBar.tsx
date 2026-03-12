import { Search, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  placeholder?: string;
  onClick?: () => void;
  readOnly?: boolean;
}

const SearchBar = ({ placeholder = "Search for restaurants and cuisine", onClick, readOnly = false }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (readOnly) {
      navigate("/search");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2.5 cursor-pointer hover:shadow-sm transition-shadow"
    >
      <Menu className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground flex-1">{placeholder}</span>
      <Search className="w-4 h-4 text-muted-foreground" />
    </div>
  );
};

export default SearchBar;
