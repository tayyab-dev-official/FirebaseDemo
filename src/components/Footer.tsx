import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-800 text-white mt-12">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-orange-400">FruitsShop</h3>
            <p className="text-gray-300 text-sm">
              Your trusted online destination for fresh, quality fruits
              delivered to your doorstep.
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
                  href="#"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Shop
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Contact
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
                  href="#"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
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
                href="#"
                className="text-gray-300 hover:text-orange-400 transition-colors transform hover:scale-125 duration-300"
              >
                <FaFacebook className="text-2xl" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-orange-400 transition-colors transform hover:scale-125 duration-300"
              >
                <FaTwitter className="text-2xl" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-orange-400 transition-colors transform hover:scale-125 duration-300"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="#"
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
            &copy; {currentYear} FruitsShop. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
            >
              Terms of Service
            </a>
            <span className="text-gray-600">|</span>
            <a
              href="#"
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
