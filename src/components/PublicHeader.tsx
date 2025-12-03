import { FaShoppingCart } from "react-icons/fa";
import { useAppContext } from "../hooks/useAppContext";
import logo from "/src/assets/revealian/new-logo.png";

interface PublicHeaderProps {
  onLoginClick?: () => void;
}

export default function PublicHeader({ onLoginClick }: PublicHeaderProps) {
  const { cartItems } = useAppContext();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="w-full bg-gradient-to-r from-orange-50 via-white to-orange-50 backdrop-blur-lg shadow-md sticky top-0 z-30">
      <div className="w-full mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src={logo}
            alt="Revealian Logo"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-orange-400"
          />
          <div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Revealian
            </h1>
            <p className="text-xs text-gray-500">Local Fruit Market Delivery</p>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Cart Icon */}
          <div className="relative">
            <button className="p-2 sm:p-3 hover:bg-white/60 rounded-full transition-all duration-200 text-orange-600">
              <FaShoppingCart size={20} />
            </button>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold">
                {totalItems}
              </span>
            )}
          </div>

          {/* Login/Signup Button */}
          <button
            onClick={onLoginClick}
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-full hover:from-orange-700 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
