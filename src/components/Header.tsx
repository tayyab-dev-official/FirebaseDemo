import { FaSignOutAlt, FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useRef, useEffect, useState } from "react";
import CartSidebar from "./CartSidebar";
import { useAppContext } from "../hooks/useAppContext";
import { FaHistory } from "react-icons/fa";

import logo from "/src/assets/revealian/new-logo.png";

interface HeaderProps {
  photoURL: string;
  onProfileClick: () => void;
  onLogoutClick: () => void;
  onOrdersHistoryClick?: () => void;
}

/**
 * Header Component
 * Displays the application logo, user profile, and navigation actions
 */
export default function Header({
  photoURL,
  onProfileClick,
  onLogoutClick,
  onOrdersHistoryClick,
}: HeaderProps) {
  const locationRef = useRef<HTMLDivElement | null>(null);
  const cartRef = useRef<HTMLDivElement | null>(null);
  const cartButtonRef = useRef<HTMLButtonElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const [locationName, setLocationName] = useState<string>("Loading...");
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const { cartItems } = useAppContext();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close cart only if clicking outside both cart button and cart sidebar
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target as Node) &&
        cartButtonRef.current &&
        !cartButtonRef.current.contains(event.target as Node)
      ) {
        setShowCart(false);
      }
      // Close profile menu only if clicking outside
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    if (showCart || showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showCart, showProfileMenu]);

  useEffect(() => {
    // Get user's geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Use reverse geocoding to get location name
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              "Unknown Location";
            setLocationName(city);
          } catch (error) {
            console.error("Error fetching location name:", error);
            setLocationName("Location Unknown");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationName("Location Access Denied");
        }
      );
    }
  }, []);

  useEffect(() => {
    if (locationRef.current) {
      locationRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [locationRef]);

  useEffect(() => {
    // Auto-close cart if it becomes empty
    if (showCart && totalItems === 0) {
      const timer = setTimeout(() => {
        setShowCart(false);
      }, 1500); // Close after 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, [showCart, totalItems]);

  return (
    <>
      <nav className="w-full bg-white">
        <div className="w-full h-full rounded-xl mb-4 p-2">
          <img
            src={logo}
            className="w-full h-full object-cover object-center rounded-[inherit]"
            alt="Revelian logo"
          />
        </div>
      </nav>
      <div className="sticky top-0 z-50 w-full bg-white border-b shadow-md">
        <div className="w-full flex gap-4 items-center justify-between p-2">
          <div className="flex items-center rounded-lg">
            <FaLocationDot className="fill-orange-400" />
            <span className="text-lg px-0 text-orange-600 font-Cabin pl-px">
              {locationName}
            </span>
          </div>
          <div
            className="flex gap-4 items-center"
            tabIndex={0}
            autoFocus
            ref={locationRef}
          >
            <div className="relative">
              <button
                ref={cartButtonRef}
                onClick={() => setShowCart(!showCart)}
                className="relative flex items-center justify-center shadow-md p-2 rounded-md bg-orange-400 text-white font-bold hover:ring-4 ring-blue-400 hover:cursor-pointer hover:scale-125 transition-all duration-600 ease-in"
              >
                <FaShoppingCart className="text-xl" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
              {showCart && (
                <div
                  ref={cartRef}
                  className="absolute top-full right-0 mt-2 z-40"
                >
                  <CartSidebar />
                </div>
              )}
            </div>
            <div ref={profileMenuRef} className="relative">
              <div
                id="user-profile"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="cursor-pointer shadow-lg rounded-full"
              >
                <div
                  id="img-container"
                  className="w-12 h-12 rounded full opacity-100"
                >
                  {photoURL ? (
                    <img
                      id="profile-image"
                      src={photoURL}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      alt="profile picture"
                      className="w-full h-full hover:scale-110 hover:ring-4 ring-blue-400 rounded-full transition-all duration-500 ease-in-out"
                    />
                  ) : (
                    <FaUserCircle className="w-full h-full rounded-full fill-orange-400 scale-110" />
                  )}
                </div>
              </div>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                  <button
                    onClick={() => {
                      onProfileClick();
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-orange-100 flex items-center gap-2 transition-colors"
                  >
                    <FaUserCircle className="text-orange-400" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      onOrdersHistoryClick?.();
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-orange-100 flex items-center gap-2 transition-colors"
                  >
                    <FaHistory className="text-orange-400" />
                    Orders History
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={() => {
                      onLogoutClick();
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-100 flex items-center gap-2 transition-colors"
                  >
                    <FaSignOutAlt className="text-red-600" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
