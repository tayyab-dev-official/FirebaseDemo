import Header from "../components/Header";
import { useAppContext } from "../hooks/useAppContext";

interface DeliveryInfoPageProps {
  photoURL?: string;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
}

export default function DeliveryInfo({
  photoURL = "",
  onProfileClick = () => {},
  onLogoutClick = () => {},
}: DeliveryInfoPageProps) {
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
            Delivery Information
          </h1>
          <p className="text-gray-600">
            Everything you need to know about our delivery service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Delivery Areas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              📍 Delivery Areas
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">✓</span>
                <span>City Center and Downtown Areas</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">✓</span>
                <span>Residential Neighborhoods</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">✓</span>
                <span>Business Districts</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">✓</span>
                <span>Suburban Areas</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">✓</span>
                <span>Special Locations (call us to confirm)</span>
              </li>
            </ul>
          </div>

          {/* Delivery Times */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              ⏰ Delivery Times
            </h2>
            <div className="space-y-3 text-gray-700">
              <div>
                <p className="font-semibold">Express Delivery</p>
                <p className="text-sm text-gray-600">
                  30-45 minutes | Within 2 km
                </p>
              </div>
              <div>
                <p className="font-semibold">Standard Delivery</p>
                <p className="text-sm text-gray-600">1-2 hours | Within 5 km</p>
              </div>
              <div>
                <p className="font-semibold">Extended Delivery</p>
                <p className="text-sm text-gray-600">2-4 hours | 5-10 km</p>
              </div>
              <div>
                <p className="font-semibold">Available Hours</p>
                <p className="text-sm text-gray-600">
                  8:00 AM - 10:00 PM, Daily
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Charges */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              💰 Delivery Charges
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Orders up to ₹500</span>
                <span className="font-semibold">₹30</span>
              </div>
              <div className="flex justify-between">
                <span>Orders ₹500 - ₹1000</span>
                <span className="font-semibold">₹50</span>
              </div>
              <div className="flex justify-between">
                <span>Orders above ₹1000</span>
                <span className="font-semibold">FREE</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <p className="text-sm text-gray-600">
                  🎁 Free delivery on all orders above ₹1000!
                </p>
              </div>
            </div>
          </div>

          {/* Tracking & Support */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              🔍 Order Tracking
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>Every order comes with real-time tracking features:</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-orange-400 mr-3">→</span>
                  <span>Track your delivery in real-time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-3">→</span>
                  <span>Contact driver directly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-3">→</span>
                  <span>Live location updates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-3">→</span>
                  <span>Estimated arrival time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-orange-800 mb-4">
            📝 Special Instructions
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              • Add delivery instructions during checkout (gate codes, apartment
              numbers, etc.)
            </li>
            <li>• Ensure someone is available to receive the delivery</li>
            <li>• Fresh fruits are delivered in eco-friendly packaging</li>
            <li>
              • All fruits are hand-picked and quality-checked before delivery
            </li>
            <li>
              • If you have any concerns about quality, contact us within 1 hour
              of delivery
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
