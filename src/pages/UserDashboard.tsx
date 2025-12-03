import { useState } from "react";
import Header from "../components/Header";
import RoleGuard from "../components/RoleGuard";
import { useAppContext } from "../hooks/useAppContext";
import {
  FaShoppingBag,
  FaMapPin,
  FaClock,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";

interface UserDashboardProps {
  photoURL?: string;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
  onNavigate?: (page: string) => void;
}

export default function UserDashboard({
  photoURL = "",
  onProfileClick = () => {},
  onLogoutClick = () => {},
  onNavigate = () => {},
}: UserDashboardProps) {
  const { currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "profile">(
    "overview"
  );

  // Mock data for dashboard
  const stats = {
    totalOrders: 12,
    activeOrders: 2,
    totalSpent: 5420,
    rewards: 342,
  };

  const recentOrders = [
    {
      id: "ORD001",
      items: "Apples, Bananas",
      date: "2025-12-03",
      status: "delivered",
      total: 450,
    },
    {
      id: "ORD002",
      items: "Grapes, Pineapple",
      date: "2025-12-02",
      status: "delivered",
      total: 680,
    },
    {
      id: "ORD003",
      items: "Pomegranate, Kiwi",
      date: "2025-12-01",
      status: "in-transit",
      total: 520,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "in-transit":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <RoleGuard requiredRole="user">
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex flex-col">
        {currentUser && (
          <Header
            photoURL={photoURL}
          onProfileClick={onProfileClick}
          onLogoutClick={onLogoutClick}
          onDashboardClick={(type) => {
            if (type === "user") onNavigate("user-dashboard");
            else if (type === "admin") onNavigate("admin-dashboard");
            else if (type === "delivery") onNavigate("delivery-dashboard");
          }}
        />
      )}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-6 transition-colors"
        >
          <FaArrowLeft /> Back to Home
        </button>

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome, {currentUser?.displayName || "User"}!
          </h1>
          <p className="text-gray-600">Your personal shopping dashboard</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.totalOrders}
                </p>
              </div>
              <FaShoppingBag className="text-4xl text-orange-300" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Orders</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.activeOrders}
                </p>
              </div>
              <FaClock className="text-4xl text-blue-300" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Spent</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{stats.totalSpent}
                </p>
              </div>
              <FaCheckCircle className="text-4xl text-green-300" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Reward Points</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.rewards}
                </p>
              </div>
              <FaMapPin className="text-4xl text-purple-300" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "overview"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:text-orange-600"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "orders"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:text-orange-600"
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "profile"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:text-orange-600"
              }`}
            >
              Profile
            </button>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Recent Orders
                  </h3>
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {order.id}
                          </p>
                          <p className="text-sm text-gray-600">{order.items}</p>
                          <p className="text-xs text-gray-500">{order.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-bold text-orange-600">
                            ₹{order.total}
                          </p>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status === "delivered"
                              ? "Delivered"
                              : "In Transit"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h4 className="font-bold text-orange-800 mb-2">
                      🎁 Referral Program
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Invite friends and earn rewards!
                    </p>
                    <button className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded transition-colors">
                      Share Code
                    </button>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-bold text-blue-800 mb-2">
                      💳 Wallet Balance
                    </h4>
                    <p className="text-2xl font-bold text-blue-600">₹234</p>
                    <button className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 transition-colors">
                      Add Money
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  All Orders
                </h3>
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {order.id}
                        </p>
                        <p className="text-sm text-gray-600">{order.items}</p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-orange-600">
                          ₹{order.total}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status === "delivered"
                            ? "Delivered"
                            : "In Transit"}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 font-semibold">
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={currentUser?.displayName || ""}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={currentUser?.email || ""}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Delivery Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Street Address"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input
                      type="text"
                      placeholder="Postal Code"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <button className="mt-4 bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded transition-colors">
                    Update Address
                  </button>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Preferences
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-orange-600"
                      />
                      <span className="ml-2 text-gray-700">
                        Receive order updates via SMS
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-orange-600"
                      />
                      <span className="ml-2 text-gray-700">
                        Receive promotional emails
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-orange-600"
                      />
                      <span className="ml-2 text-gray-700">
                        Receive push notifications
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </RoleGuard>
  );
}
