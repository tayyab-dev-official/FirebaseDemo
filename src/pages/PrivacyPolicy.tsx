import Header from "../components/Header";
import { useAppContext } from "../hooks/useAppContext";

interface PrivacyPolicyPageProps {
  photoURL?: string;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
}

export default function PrivacyPolicy({
  photoURL = "",
  onProfileClick = () => {},
  onLogoutClick = () => {},
}: PrivacyPolicyPageProps) {
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
            Privacy Policy
          </h1>
          <p className="text-gray-600">Last updated: December 3, 2025</p>
        </div>

        <div className="space-y-6 text-gray-700">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              Introduction
            </h2>
            <p>
              Revealian ("we," "us," "our," or "Company") operates the Revealian
              website and application. This page informs you of our policies
              regarding the collection, use, and disclosure of personal data
              when you use our Service and the choices you have associated with
              that data.
            </p>
          </div>

          {/* Information Collection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Personal Data
                </h3>
                <p className="text-sm mb-2">
                  We collect the following types of personal data:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Name and email address</li>
                  <li>Phone number and delivery address</li>
                  <li>Payment information (processed securely)</li>
                  <li>Account creation and login credentials</li>
                  <li>Order history and preferences</li>
                  <li>Device information and browsing history</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Location Data
                </h3>
                <p className="text-sm">
                  With your consent, we collect your location data to provide
                  delivery services and help determine service availability in
                  your area.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Usage Data</h3>
                <p className="text-sm">
                  We automatically collect information about your interactions
                  with our Service, including pages visited, time spent, and
                  search queries.
                </p>
              </div>
            </div>
          </div>

          {/* Use of Data */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              How We Use Your Information
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">→</span>
                <span>To process and deliver your orders</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">→</span>
                <span>To communicate with you about your orders</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">→</span>
                <span>To improve our Service and user experience</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">→</span>
                <span>
                  To send promotional materials and updates (with your consent)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">→</span>
                <span>To prevent fraud and ensure security</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">→</span>
                <span>To comply with legal obligations</span>
              </li>
            </ul>
          </div>

          {/* Data Security */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              Data Security
            </h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to
              protect your personal data against unauthorized access,
              alteration, disclosure, or destruction. However, no method of
              transmission over the Internet or electronic storage is 100%
              secure.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded p-4">
              <p className="text-sm text-gray-700">
                All payment information is processed using industry-standard
                encryption (SSL/TLS) and never stored on our servers.
              </p>
            </div>
          </div>

          {/* Data Retention */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              Data Retention
            </h2>
            <p>
              We retain your personal data only for as long as necessary to
              provide our Services and fulfill the purposes outlined in this
              Privacy Policy. You can request deletion of your account and
              associated data at any time by contacting us.
            </p>
          </div>

          {/* Third-Party Services */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              Third-Party Services
            </h2>
            <p className="mb-4">
              Our Service may contain links to third-party websites and services
              that are not operated by us.
            </p>
            <p>
              This Privacy Policy does not apply to third-party services, and
              we're not responsible for their privacy practices. We encourage
              you to review their privacy policies before providing any
              information.
            </p>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              Your Privacy Rights
            </h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">✓</span>
                <span>Access the personal data we hold about you</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">✓</span>
                <span>Correct any inaccurate or incomplete data</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">✓</span>
                <span>Request deletion of your data</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">✓</span>
                <span>Opt-out of marketing communications</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-3">✓</span>
                <span>Request a copy of your data in portable format</span>
              </li>
            </ul>
          </div>

          {/* Cookies */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              Cookies and Tracking
            </h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to improve your
              experience. You can control cookie settings through your browser
              preferences, but disabling cookies may affect the functionality of
              our Service.
            </p>
          </div>

          {/* Contact Us */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Privacy Questions?</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy, please contact us
              at:
            </p>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> privacy@revealian.com
              </p>
              <p>
                <strong>Address:</strong> 123 Market Street, Fresh City, FC
                12345
              </p>
              <p>
                <strong>Phone:</strong> +91 (555) 123-4567
              </p>
            </div>
          </div>

          {/* Policy Updates */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-orange-800 mb-4">
              Policy Updates
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We'll notify
              you of significant changes via email or through a prominent notice
              on our Service. Your continued use of the Service constitutes your
              acceptance of the updated Privacy Policy.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
