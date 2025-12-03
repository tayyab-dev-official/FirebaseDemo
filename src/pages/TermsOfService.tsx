import Header from "../components/Header";
import { useAppContext } from "../hooks/useAppContext";

interface TermsOfServicePageProps {
  photoURL?: string;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
}

export default function TermsOfService({
  photoURL = "",
  onProfileClick = () => {},
  onLogoutClick = () => {},
}: TermsOfServicePageProps) {
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
            Terms of Service
          </h1>
          <p className="text-gray-600">Last updated: December 3, 2025</p>
        </div>

        <div className="space-y-6 text-gray-700">
          {/* Acceptance of Terms */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using the Revealian website and application
              ("Service"), you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to abide by the
              above, please do not use this service.
            </p>
          </div>

          {/* Use License */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              2. Use License
            </h2>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of the
              materials (information or software) on Revealian's Service for
              personal, non-commercial transitory viewing only. This is the
              grant of a license, not a transfer of title, and under this
              license you may not:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Modifying or copying the materials</li>
              <li>
                Using the materials for any commercial purpose or for any public
                display
              </li>
              <li>Attempting to decompile or reverse engineer any software</li>
              <li>Removing any copyright or other proprietary notations</li>
              <li>
                Transferring the materials to another person or "mirroring" the
                materials on any other server
              </li>
              <li>Violating any applicable laws or regulations</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              3. Disclaimer
            </h2>
            <p>
              The materials on Revealian's Service are provided on an 'as is'
              basis. Revealian makes no warranties, expressed or implied, and
              hereby disclaims and negates all other warranties including,
              without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property or other violation of
              rights.
            </p>
          </div>

          {/* Limitations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              4. Limitations
            </h2>
            <p>
              In no event shall Revealian or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use the materials on Revealian's Service.
            </p>
          </div>

          {/* Accuracy of Materials */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              5. Accuracy of Materials
            </h2>
            <p>
              The materials appearing on Revealian's Service could include
              technical, typographical, or photographic errors. Revealian does
              not warrant that any of the materials on its Service are accurate,
              complete, or current. Revealian may make changes to the materials
              contained on its Service at any time without notice.
            </p>
          </div>

          {/* Materials and Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              6. Materials and Content
            </h2>
            <p className="mb-4">
              Revealian has not reviewed all of the sites linked to its Service
              and is not responsible for the contents of any such linked site.
              The inclusion of any link does not imply endorsement by Revealian
              of the site. Use of any such linked website is at the user's own
              risk.
            </p>
            <p>
              If you find any linked website that violates these terms or any
              applicable law, please contact Revealian immediately.
            </p>
          </div>

          {/* Modifications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              7. Modifications
            </h2>
            <p>
              Revealian may revise these terms of service for its Service at any
              time without notice. By using this Service, you are agreeing to be
              bound by the then current version of these terms of service.
            </p>
          </div>

          {/* Governing Law */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              8. Governing Law
            </h2>
            <p>
              These terms and conditions are governed by and construed in
              accordance with the laws of [Your Country], and you irrevocably
              submit to the exclusive jurisdiction of the courts in that
              location.
            </p>
          </div>

          {/* User Responsibilities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              9. User Responsibilities
            </h2>
            <p className="mb-4">As a user of our Service, you agree to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Provide accurate and complete information when placing orders
              </li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Not engage in any unlawful or fraudulent activities</li>
              <li>
                Respect the intellectual property rights of Revealian and others
              </li>
              <li>Not transmit viruses or harmful code</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </div>

          {/* Order Terms */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              10. Order Terms
            </h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Order Acceptance
                </h3>
                <p className="text-sm">
                  We reserve the right to accept or decline any order. All
                  orders are subject to verification and acceptance.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Pricing</h3>
                <p className="text-sm">
                  All prices are subject to change without notice. Prices at the
                  time of order confirmation are binding.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Delivery</h3>
                <p className="text-sm">
                  Delivery times are estimates only. Revealian is not liable for
                  delays in delivery caused by factors beyond our control.
                </p>
              </div>
            </div>
          </div>

          {/* Termination */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              11. Termination
            </h2>
            <p>
              Revealian may terminate or suspend your account and access to the
              Service immediately, without prior notice or liability, if you
              violate any of these Terms of Service.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Questions About Terms?</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> legal@revealian.com
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

          {/* Changes to Terms */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-orange-800 mb-4">
              Changes to These Terms
            </h2>
            <p>
              Revealian reserves the right to modify these terms at any time. If
              we make changes that we believe are material, we will notify users
              via email or by placing a prominent notice on our Service. Your
              continued use of the Service following notification of changes
              constitutes your acceptance of the updated Terms of Service.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
