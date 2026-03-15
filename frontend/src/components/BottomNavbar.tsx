import { Link, useLocation } from "react-router-dom";
import { UtensilsCrossed, Search, ShoppingCart, User } from "lucide-react";

const navItems = [
  { label: "Food", icon: UtensilsCrossed, path: "/home" },
  { label: "Search", icon: Search, path: "/search" },
  { label: "Carts", icon: ShoppingCart, path: "/cart" },
  { label: "Account", icon: User, path: "/account" },
];

const BottomNavbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 text-xs transition-colors ${
                isActive ? "text-nav-active" : "text-nav-inactive"
              }`}
            >
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={isActive ? "font-semibold" : "font-medium"}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavbar;
