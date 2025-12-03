// Components
import AppContextProvider from "./components/AppContextProvider";
import Home from "./pages/Home";
import BrowseFruits from "./pages/BrowseFruits";
import TrackOrder from "./pages/TrackOrder";
import ContactUs from "./pages/ContactUs";
import DeliveryInfo from "./pages/DeliveryInfo";
import RefundPolicy from "./pages/RefundPolicy";
import HelpFAQ from "./pages/HelpFAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import OrdersHistory from "./components/OrdersHistory";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { useState } from "react";

export default function App() {
  const [currentPage, setCurrentPage] = useState<
    | "home"
    | "orders"
    | "browse"
    | "track-order"
    | "contact"
    | "delivery-info"
    | "refund-policy"
    | "help-faq"
    | "privacy-policy"
    | "terms-of-service"
    | "user-dashboard"
    | "admin-dashboard"
    | "delivery-dashboard"
  >("home");
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <main
        className="
          w-full 
          max-w[800px]          
          mx-auto
          mt-[2%] sm:mt-[1%]
          flex flex-col justify-center items-center gap-4
        "
      >
        <AppContextProvider>
          {/* Background content */}
          {currentPage === "home" ? (
            <Home
              onOrdersHistoryClick={() => setCurrentPage("orders")}
              onLoginClick={() => setShowLoginModal(true)}
              onDashboardClick={(type) => {
                if (type === "user") setCurrentPage("user-dashboard");
                else if (type === "admin") setCurrentPage("admin-dashboard");
                else if (type === "delivery")
                  setCurrentPage("delivery-dashboard");
              }}
            />
          ) : currentPage === "browse" ? (
            <BrowseFruits />
          ) : currentPage === "track-order" ? (
            <TrackOrder />
          ) : currentPage === "contact" ? (
            <ContactUs />
          ) : currentPage === "delivery-info" ? (
            <DeliveryInfo />
          ) : currentPage === "refund-policy" ? (
            <RefundPolicy />
          ) : currentPage === "help-faq" ? (
            <HelpFAQ />
          ) : currentPage === "privacy-policy" ? (
            <PrivacyPolicy />
          ) : currentPage === "terms-of-service" ? (
            <TermsOfService />
          ) : currentPage === "user-dashboard" ? (
            <UserDashboard onNavigate={setCurrentPage as any} />
          ) : currentPage === "admin-dashboard" ? (
            <AdminDashboard onNavigate={setCurrentPage as any} />
          ) : currentPage === "delivery-dashboard" ? (
            <DeliveryDashboard onNavigate={setCurrentPage as any} />
          ) : (
            <OrdersHistory onBackClick={() => setCurrentPage("home")} />
          )}

          {/* Login Modal Overlay */}
          {showLoginModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md relative">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
                <Login onLoginSuccess={() => setShowLoginModal(false)} />
              </div>
            </div>
          )}
        </AppContextProvider>
      </main>
      <Footer onNavigate={(page) => setCurrentPage(page as any)} />
    </>
  );
}
