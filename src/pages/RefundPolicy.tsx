import Header from "../components/Header";
import { useAppContext } from "../hooks/useAppContext";

interface RefundPolicyPageProps {
  photoURL?: string;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
}

export default function RefundPolicy({
  photoURL = "",
  onProfileClick = () => {},
  onLogoutClick = () => {},
}: RefundPolicyPageProps) {
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
            Refund Policy
          </h1>
          <p className="text-gray-600">Our commitment to your satisfaction</p>
        </div>

        <div className="space-y-6">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              Our Promise
            </h2>
            <p className="text-gray-700 leading-relaxed">
              At Revealian, we're committed to ensuring your complete
              satisfaction. If you're not satisfied with your order for any
              reason, we'll work with you to make it right. Whether it's a
              refund, replacement, or credit, we've got you covered.
            </p>
          </div>

          {/* Refund Eligibility */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              ✓ Eligible for Refund
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">→</span>
                <span>
                  <strong>Quality Issues:</strong> Damaged, spoiled, or rotten
                  fruits upon delivery
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">→</span>
                <span>
                  <strong>Wrong Items:</strong> Incorrect fruits or quantities
                  delivered
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">→</span>
                <span>
                  <strong>Missing Items:</strong> Parts of order not received
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">→</span>
                <span>
                  <strong>Non-Delivery:</strong> Order not delivered within
                  promised timeframe
                </span>
              </li>
            </ul>
          </div>

          {/* Refund Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              ⏱️ Refund Timeline
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="border-l-4 border-orange-400 pl-4">
                <p className="font-semibold">Report Within 1 Hour</p>
                <p className="text-sm text-gray-600">
                  Report quality issues within 1 hour of delivery for immediate
                  assistance
                </p>
              </div>
              <div className="border-l-4 border-orange-400 pl-4">
                <p className="font-semibold">Quick Verification</p>
                <p className="text-sm text-gray-600">
                  Our team verifies the issue within 24 hours
                </p>
              </div>
              <div className="border-l-4 border-orange-400 pl-4">
                <p className="font-semibold">Processing</p>
                <p className="text-sm text-gray-600">
                  Refunds are processed within 3-5 business days
                </p>
              </div>
              <div className="border-l-4 border-orange-400 pl-4">
                <p className="font-semibold">Bank Transfer</p>
                <p className="text-sm text-gray-600">
                  Amount appears in your account 1-2 business days after
                  processing
                </p>
              </div>
            </div>
          </div>

          {/* Refund Process */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              📋 How to Request a Refund
            </h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex">
                <span className="font-semibold text-orange-600 mr-3">1.</span>
                <span>
                  Contact us via email at support@revealian.com within 1 hour of
                  delivery
                </span>
              </li>
              <li className="flex">
                <span className="font-semibold text-orange-600 mr-3">2.</span>
                <span>
                  Provide your order number and clear photos of the issue
                </span>
              </li>
              <li className="flex">
                <span className="font-semibold text-orange-600 mr-3">3.</span>
                <span>Our team will review and respond within 24 hours</span>
              </li>
              <li className="flex">
                <span className="font-semibold text-orange-600 mr-3">4.</span>
                <span>Once approved, refund is initiated immediately</span>
              </li>
              <li className="flex">
                <span className="font-semibold text-orange-600 mr-3">5.</span>
                <span>
                  Funds appear in your account within 3-5 business days
                </span>
              </li>
            </ol>
          </div>

          {/* Exchange Option */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-orange-800 mb-4">
              🔄 Alternative: Free Replacement
            </h2>
            <p className="text-gray-700 mb-3">
              Instead of a refund, you can choose a free replacement delivery of
              the same item. Most replacements are delivered within 2-4 hours.
            </p>
            <p className="text-sm text-gray-600">
              Choose the option that works best for you during the claim
              process.
            </p>
          </div>

          {/* Non-Refundable Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              ✗ Non-Refundable Items
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-gray-400 mr-3">•</span>
                <span>
                  Items damaged due to customer mishandling after delivery
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-3">•</span>
                <span>Orders reported more than 1 hour after delivery</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-3">•</span>
                <span>Items consumed before quality verification</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-3">•</span>
                <span>
                  Orders placed with incorrect address or special instructions
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">📞 Need Help?</h2>
            <p className="mb-4">
              Contact our support team anytime for assistance with refunds or
              replacements.
            </p>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> support@revealian.com
              </p>
              <p>
                <strong>Phone:</strong> +91 (555) 123-4567
              </p>
              <p>
                <strong>Hours:</strong> 8 AM - 10 PM, Daily
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
