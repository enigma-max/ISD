import MenuItemCard, { MenuItem } from "./MenuItemCard";

interface MenuListProps {
  menuItems: MenuItem[];
  onSelect: (menuItem: MenuItem) => void;
}

const MenuList = ({ menuItems, onSelect }: MenuListProps) => {
  if (menuItems.length === 0) {
    return (
      <div className="p-4 sm:p-6 bg-card rounded-xl border border-border">
        <p className="text-muted-foreground text-sm sm:text-base text-center">
          No menu items found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {menuItems.map((menuItem) => (
        <MenuItemCard
          key={menuItem.menu_item_id}
          menuItem={menuItem}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default MenuList;