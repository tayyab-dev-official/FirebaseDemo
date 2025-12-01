// Dependencies
import { useEffect } from "react";
// Hooks
import { useAppContext } from "../hooks/useAppContext";

// Components
import Login from "./Login";
import Profile from "./Profile";
import Header from "./Header";
import DeliveryFolk from "./Product";

interface DashboardProps {
  onOrdersHistoryClick?: () => void;
}

export default function Dashboard({ onOrdersHistoryClick }: DashboardProps) {
  const {
    currentUser,
    firebaseSignOut,
    IsUpdateUserProfile,
    setIsUpdateUserProfile,
    selectedProduct,
    setselectedProduct,
  } = useAppContext();

  const currentUserName = currentUser?.displayName || "User";
  console.log(`[DASHBOARD] current user: ${currentUser?.email}`);

  useEffect(() => {
    if (!currentUser?.uid) return;
    console.log("Dashboard mounted");
  }, [currentUser]);

  if (!currentUser) return <Login />;
  if (IsUpdateUserProfile) return <Profile />;

  return (
    <>
      <div className="w-full mx-auto min-w-[350px] sm:max-w-[1200px] p-2 flex flex-col justify-center">
        <Header
          photoURL={currentUser.photoURL || ""}
          onProfileClick={() => setIsUpdateUserProfile(true)}
          onLogoutClick={firebaseSignOut}
          onOrdersHistoryClick={onOrdersHistoryClick}
        />
        <h2 className="text-2xl p-4 text-orange-600 font-Calistoga tracking-wider">
          Welcome, {currentUserName.split(" ")[0]}
        </h2>
        <DeliveryFolk
          selectedProduct={selectedProduct}
          OnselectedProductChange={setselectedProduct}
        />
      </div>
    </>
  );
}
