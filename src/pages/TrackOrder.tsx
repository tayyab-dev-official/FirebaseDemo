import Header from "../components/Header";
import OrdersHistory from "../components/OrdersHistory";
import { useAppContext } from "../hooks/useAppContext";

interface TrackOrderPageProps {
  photoURL?: string;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
}

export default function TrackOrder({
  photoURL = "",
  onProfileClick = () => {},
  onLogoutClick = () => {},
}: TrackOrderPageProps) {
  const { currentUser } = useAppContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex flex-col">
      {currentUser && (
        <Header
          photoURL={photoURL}
          onProfileClick={onProfileClick}
          onLogoutClick={onLogoutClick}
        />
      )}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Track Your Orders
          </h1>
          <p className="text-gray-600">
            View and monitor all your fruit orders in real-time
          </p>
        </div>
        {currentUser ? (
          <OrdersHistory />
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <p className="text-gray-700 mb-4">
              Please log in to track your orders
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
