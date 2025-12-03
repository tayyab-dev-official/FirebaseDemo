import { useAppContext } from "../hooks/useAppContext";
import Profile from "../components/Profile";
import Header from "../components/Header";
import Product from "../components/Product";
import { FaShoppingCart } from "react-icons/fa";
import logo from "/src/assets/revealian/new-logo.png";

interface HomePageProps {
  onOrdersHistoryClick?: () => void;
  onLoginClick?: () => void;
  onDashboardClick?: (dashboardType: "user" | "admin" | "delivery") => void;
}

// Public Header Component for non-logged-in users
function PublicHeader({ onLoginClick }: { onLoginClick?: () => void }) {
  const { cartItems } = useAppContext();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="w-full bg-gradient-to-r from-orange-50 via-white to-orange-50 backdrop-blur-lg shadow-md sticky top-0 z-30">
      <div className="w-full mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src={logo}
            alt="Fruits Shop Logo"
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

export default function Home({
  onOrdersHistoryClick,
  onLoginClick,
  onDashboardClick,
}: HomePageProps) {
  const {
    currentUser,
    firebaseSignOut,
    IsUpdateUserProfile,
    setIsUpdateUserProfile,
    selectedProduct,
    setselectedProduct,
  } = useAppContext();

  const currentUserName = currentUser?.displayName || "User";
  console.log(`[HOME] current user: ${currentUser?.email}`);

  if (IsUpdateUserProfile) return <Profile />;

  return (
    <>
      <div className="w-full mx-auto min-w-[350px] sm:max-w-[1200px] p-2 flex flex-col justify-center">
        {currentUser ? (
          <Header
            photoURL={currentUser.photoURL || ""}
            onProfileClick={() => setIsUpdateUserProfile(true)}
            onLogoutClick={firebaseSignOut}
            onOrdersHistoryClick={onOrdersHistoryClick}
            onDashboardClick={onDashboardClick}
          />
        ) : (
          <PublicHeader onLoginClick={onLoginClick} />
        )}

        <div className="text-center py-4 px-4">
          {currentUser ? (
            <h2 className="text-2xl text-orange-600 font-Calistoga tracking-wider">
              Welcome, {currentUserName.split(" ")[0]}
            </h2>
          ) : (
            <div className="w-full relative overflow-hidden rounded-3xl p-12 sm:p-16 mb-12">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-yellow-300/5 to-orange-500/10 backdrop-blur-3xl rounded-3xl" />
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl animate-pulse" />
              <div
                className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300/20 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
              />

              <div className="relative z-10">
                {/* Animated tagline */}
                <div className="mb-8 min-h-24 flex items-center justify-center">
                  <p className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 animate-pulse max-w-3xl leading-tight">
                    Fresh fruit delivered in minutes — your local market brought
                    to your door by trusted delivery folks.
                  </p>
                </div>

                {/* Feature badges with stagger animation */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <div
                    className="px-4 py-2.5 bg-white/60 backdrop-blur-xl rounded-full text-sm font-semibold text-orange-700 border border-white/40 shadow-lg hover:bg-white/80 transition-all duration-300 transform hover:scale-105 animate-fade-in"
                    style={{ animationDelay: "0.2s" }}
                  >
                    🍎 Fresh Fruits
                  </div>
                  <div
                    className="px-4 py-2.5 bg-white/60 backdrop-blur-xl rounded-full text-sm font-semibold text-orange-700 border border-white/40 shadow-lg hover:bg-white/80 transition-all duration-300 transform hover:scale-105 animate-fade-in"
                    style={{ animationDelay: "0.4s" }}
                  >
                    ⚡ Home Delivery
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full">
          <h3 className="text-xl font-semibold text-gray-800 px-4 mb-4">
            Available from Local Fruit Markets
          </h3>
          <Product
            selectedProduct={selectedProduct}
            OnselectedProductChange={setselectedProduct}
          />
        </div>
      </div>
    </>
  );
}
