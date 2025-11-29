import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

import logo from "/src/assets/favicon.png"

interface HeaderProps {
  photoURL: string;
  onProfileClick: () => void;
  onLogoutClick: () => void;
}

/**
 * Header Component
 * Displays the application logo, user profile, and navigation actions
 */
export default function Header({
  photoURL,
  onProfileClick,
  onLogoutClick,
}: HeaderProps) {
  return (
    <>
      <div className="flex flex-col justify-center m-2">
        <h1 className="text-5xl font-Calistoga text-center">
          <span className="text-orange-400">Delfo</span>
        </h1>

        <nav className="w-full flex justify-between items-center p-2">
          <div className="w-18 h-18 flex items-center justify-center rounded-lg">
            <img
              src={logo}
              className="w-full h-full object-cover object-center"
              alt="Delfo logo"
            />
          </div>
          {/* <div id="img-container" className="w-20 h-20">
            {photoURL ? (
              <img
                id="profile-image"
                src={photoURL}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                alt="profile picture"
                className="w-full h-full rounded-full"
              />
            ) : (
              <FaUserCircle className="w-full h-full rounded-full fill-blue-500 scale-110" />
            )}
          </div> */}
          <div className="flex flex-wrap gap-4 items-center">
            <div
              id="user-profile"
              onClick={onProfileClick}
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
                    className="w-full h-full hover:scale-105 hover:ring-4 ring-blue-400 rounded-full transition-all duration-500 ease-in-out"
                  />
                ) : (
                  <FaUserCircle className="w-full h-full rounded-full fill-blue-500 scale-110" />
                )}
              </div>
            </div>
            <button
              onClick={onLogoutClick}
              className="flex items-center justify-center shadow-md px-1 sm:px-4 py-2 rounded-md bg-orange-400 text-white font-bold hover:ring-4 ring-blue-400 hover:cursor-pointer hover:scale-125 transition-all duration-600 ease-in after-content-none sm:after:content-['Logout']"
            >
              <FaSignOutAlt className="text-xl" />
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
