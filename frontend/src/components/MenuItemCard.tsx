import { ImageOff } from "lucide-react";

export type MenuItem = {
  menu_item_id: number;
  name: string;
  description: string | null;
  price: number;
  photo_url: string | null;
  original_price?: number | null;
  is_popular?: boolean;
};

interface MenuItemCardProps {
  menuItem: MenuItem;
  onSelect: (menuItem: MenuItem) => void;
}

const MenuItemCard = ({ menuItem, onSelect }: MenuItemCardProps) => {
  return (
    <div
      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow cursor-pointer"
      onClick={() => onSelect(menuItem)}
    >
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm sm:text-base text-foreground">
          {menuItem.name}
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-semibold text-foreground">
            Tk {Number(menuItem.price).toFixed(0)}
          </span>
          {menuItem.original_price &&
            Number(menuItem.original_price) > Number(menuItem.price) && (
              <span className="text-xs sm:text-sm text-muted-foreground line-through">
                Tk {Number(menuItem.original_price).toFixed(0)}
              </span>
            )}
        </div>
        {menuItem.description && (
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {menuItem.description}
          </p>
        )}
        {menuItem.is_popular && (
          <p className="mt-2 text-xs font-medium text-orange-500 flex items-center gap-1">
            <span>🔥</span>
            <span>Popular</span>
          </p>
        )}
      </div>
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {menuItem.photo_url ? (
          <img
            src={menuItem.photo_url}
            alt={menuItem.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            <ImageOff className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;