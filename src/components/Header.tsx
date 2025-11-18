import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

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
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-Calistoga">
          <span className="text-orange-400">Delfo</span>
        </h1>
        <div className="w-20 h-20">
          <img
            src="src/assets/favicon.png"
            className="w-full h-full"
            alt="Delfo logo"
          />
        </div>
      </div>

      <nav className="sm:absolute sm:top-4 sm:right-6 flex gap-2 flex-col items-center justify-center bg-amber-100 p-2 rounded-l-md">
        <div id="img-container" className="w-[50px] h-[50px]">
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
        </div>
        <div
          id="user-profile"
          onClick={onProfileClick}
          className="cursor-pointer hover:text-blue-600 transition-colors"
        >
          Profile
        </div>
        <button
          onClick={onLogoutClick}
          className="flex items-center gap-2 shadow-md px-4 py-2 rounded-md bg-blue-400 text-white font-bold hover:bg-blue-500 transition-colors"
        >
          <FaSignOutAlt className="text-xl" />
          Logout
        </button>
      </nav>
    </>
  );
}
