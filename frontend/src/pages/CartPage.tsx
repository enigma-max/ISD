import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BottomNavbar from "@/components/BottomNavbar";
import emptyCart from "@/assets/empty_cart.png";

const CartPage = () => {
  const navigate = useNavigate();

  const activeLocation = localStorage.getItem("active_location") || "Select Location";
  const locationParts = activeLocation.split(",");
  const locationName = locationParts[0]?.trim();
  const locationSub = locationParts.slice(1, 3).join(",").trim();
  const deliverTo = locationSub ? `${locationName} ${locationSub}` : locationName;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
        <h1 className="font-bold text-lg text-gray-900">All carts</h1>
        <div className="flex items-center gap-1 mt-0.5">
          <ArrowLeft
            className="w-4 h-4 text-gray-500 cursor-pointer"
            onClick={() => navigate("/home")}
          />
          <span className="text-xs text-gray-500">
            Deliver to: <span className="font-semibold text-gray-700">{deliverTo}</span>
          </span>
        </div>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center mt-24 px-8 text-center">

        <img
          src={emptyCart}
          alt="Empty cart"
          className="w-52 h-52 object-contain mb-6"
        />

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hungry?</h2>
        <p className="text-gray-500 text-sm mb-8">
          You haven't added anything to your cart!
        </p>

        <button
          onClick={() => navigate("/home")}
          className="bg-pink-500 text-white px-10 py-2.5 rounded-full font-semibold text-sm hover:bg-pink-600 transition-colors"
        >
          Browse
        </button>

      </div>

      <BottomNavbar />
    </div>
  );
};

export default CartPage;
