import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    page: string
  ) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(page);
    }
  };

  return (
    <footer className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-12 border-t border-orange-400/20">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
              Revealian
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Fresh fruit delivered in minutes. Your local market brought to
              your door by trusted delivery folks.
            </p>
            <p className="text-xs text-gray-400">
              Supporting local fruit markets, one delivery at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-orange-400">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  onClick={(e) => handleLinkClick(e, "home")}
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/browse"
                  onClick={(e) => handleLinkClick(e, "browse")}
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Browse Fruits
                </a>
              </li>
              <li>
                <a
                  href="/track-order"
                  onClick={(e) => handleLinkClick(e, "track-order")}
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Track Order
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, "contact")}
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-orange-400">Support</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/delivery-info"
                  onClick={(e) => handleLinkClick(e, "delivery-info")}
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Delivery Info
                </a>
              </li>
              <li>
                <a
                  href="/refund-policy"
                  onClick={(e) => handleLinkClick(e, "refund-policy")}
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Refund Policy
                </a>
              </li>
              <li>
                <a
                  href="/help-faq"
                  onClick={(e) => handleLinkClick(e, "help-faq")}
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Help & FAQ
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => handleLinkClick(e, "privacy-policy")}
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-orange-400">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#facebook"
                className="text-gray-300 hover:text-orange-400 transition-colors transform hover:scale-125 duration-300"
              >
                <FaFacebook className="text-2xl" />
              </a>
              <a
                href="#twitter"
                className="text-gray-300 hover:text-orange-400 transition-colors transform hover:scale-125 duration-300"
              >
                <FaTwitter className="text-2xl" />
              </a>
              <a
                href="#instagram"
                className="text-gray-300 hover:text-orange-400 transition-colors transform hover:scale-125 duration-300"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="#linkedin"
                className="text-gray-300 hover:text-orange-400 transition-colors transform hover:scale-125 duration-300"
              >
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center sm:text-left">
            &copy; {currentYear} Revealian. All rights reserved. | Delivering
            Fresh Fruit Instantly
          </p>
          <div className="flex gap-4">
            <a
              href="/terms-of-service"
              onClick={(e) => handleLinkClick(e, "terms-of-service")}
              className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
            >
              Terms of Service
            </a>
            <span className="text-gray-600">|</span>
            <a
              href="/privacy-policy"
              onClick={(e) => handleLinkClick(e, "privacy-policy")}
              className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
