import { useState } from "react";
import Header from "../components/Header";
import RoleGuard from "../components/RoleGuard";
import { useAppContext } from "../hooks/useAppContext";
import {
  FaTruck,
  FaMapPin,
  FaCheckCircle,
  FaClock,
  FaPhone,
  FaArrowLeft,
} from "react-icons/fa";

interface DeliveryDashboardProps {
  photoURL?: string;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
  onNavigate?: (page: string) => void;
}

export default function DeliveryDashboard({
  photoURL = "",
  onProfileClick = () => {},
  onLogoutClick = () => {},
  onNavigate = () => {},
}: DeliveryDashboardProps) {
  const { currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<
    "today" | "assigned" | "history" | "profile"
  >("today");

  // Mock delivery data
  const todayStats = {
    assignedOrders: 8,
    completedOrders: 5,
    totalEarnings: 450,
    rating: 4.9,
  };

  const assignedOrders = [
    {
      id: "ORD201",
      customer: "Raj Kumar",
      items: "Apples, Bananas",
      address: "123 Main St, Apt 4B",
      phone: "98765-43210",
      status: "pending",
      distance: "2.3 km",
    },
    {
      id: "ORD202",
      customer: "Priya Singh",
      items: "Grapes, Pineapple",
      address: "456 Oak Ave",
      phone: "98765-43211",
      status: "in-progress",
      distance: "1.8 km",
    },
    {
      id: "ORD203",
      customer: "Ahmed Ali",
      items: "Pomegranate",
      address: "789 Pine Ln",
      phone: "98765-43212",
      status: "pending",
      distance: "3.1 km",
    },
  ];

  const completedOrders = [
    {
      id: "ORD195",
      customer: "Ananya Gupta",
      deliveredTime: "14:30",
      earnings: 85,
      rating: 5,
    },
    {
      id: "ORD196",
      customer: "Vikram Patel",
      deliveredTime: "13:15",
      earnings: 120,
      rating: 5,
    },
    {
      id: "ORD197",
      customer: "Neha Sharma",
      deliveredTime: "12:45",
      earnings: 95,
      rating: 4,
    },
    {
      id: "ORD198",
      customer: "Sanjay Kumar",
      deliveredTime: "11:20",
      earnings: 150,
      rating: 5,
    },
    {
      id: "ORD199",
      customer: "Meera Reddy",
      deliveredTime: "10:00",
      earnings: 100,
      rating: 4,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <RoleGuard requiredRole="delivery">
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">
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
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mb-6 transition-colors"
        >
          <FaArrowLeft /> Back to Home
        </button>

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome, Delivery Partner!
          </h1>
          <p className="text-gray-600">Manage your deliveries and earnings</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today's Orders</p>
                <p className="text-3xl font-bold text-green-600">
                  {todayStats.assignedOrders}
                </p>
              </div>
              <FaTruck className="text-4xl text-green-300" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-blue-600">
                  {todayStats.completedOrders}
                </p>
              </div>
              <FaCheckCircle className="text-4xl text-blue-300" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today's Earnings</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{todayStats.totalEarnings}
                </p>
              </div>
              <FaMapPin className="text-4xl text-green-300" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Your Rating</p>
                <p className="text-3xl font-bold text-yellow-600">
                  ⭐ {todayStats.rating}
                </p>
              </div>
              <FaClock className="text-4xl text-yellow-300" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("today")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "today"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              Today's Deliveries
            </button>
            <button
              onClick={() => setActiveTab("assigned")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "assigned"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              Assigned Orders
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "history"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              Delivery History
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "profile"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              Profile
            </button>
          </div>

          <div className="p-6">
            {/* Today's Deliveries */}
            {activeTab === "today" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Today's Deliveries
                </h3>
                {assignedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-green-400 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">
                          {order.id} - {order.customer}
                        </p>
                        <p className="text-sm text-gray-600">{order.items}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status === "pending" ? "Pending" : "In Progress"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-start gap-2">
                        <FaMapPin className="text-green-600 mt-1" />
                        <div>
                          <p className="text-xs text-gray-600">
                            Delivery Address
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            {order.address}
                          </p>
                          <p className="text-xs text-gray-600">
                            {order.distance} away
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <FaPhone className="text-green-600 mt-1" />
                        <div>
                          <p className="text-xs text-gray-600">
                            Customer Phone
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            {order.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {order.status === "pending" && (
                          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded transition-colors text-sm">
                            Accept
                          </button>
                        )}
                        {order.status === "in-progress" && (
                          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded transition-colors text-sm">
                            Mark Delivered
                          </button>
                        )}
                        <button className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded transition-colors text-sm">
                          Call Customer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Assigned Orders */}
            {activeTab === "assigned" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  All Assigned Orders
                </h3>
                <div className="space-y-3">
                  {assignedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {order.id}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.customer}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">
                          {order.distance}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status === "pending"
                            ? "Pending"
                            : "In Progress"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery History */}
            {activeTab === "history" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Delivery History
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                          Order ID
                        </th>
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                          Customer
                        </th>
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                          Delivered Time
                        </th>
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                          Rating
                        </th>
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                          Earnings
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-semibold text-gray-800">
                            {order.id}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {order.customer}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {order.deliveredTime}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-yellow-600 font-semibold">
                              ⭐ {order.rating}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold text-green-600">
                            ₹{order.earnings}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Profile */}
            {activeTab === "profile" && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Personal Information
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
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765-43210"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Vehicle Type
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400">
                        <option>Two Wheeler</option>
                        <option>Auto Rickshaw</option>
                        <option>Car</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Performance Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-gray-600 text-sm">Total Deliveries</p>
                      <p className="text-3xl font-bold text-green-600">245</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-gray-600 text-sm">Average Rating</p>
                      <p className="text-3xl font-bold text-blue-600">4.9/5</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-gray-600 text-sm">Total Earnings</p>
                      <p className="text-3xl font-bold text-purple-600">
                        ₹15,240
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Documents
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">
                          Driving License
                        </p>
                        <p className="text-sm text-gray-600">
                          Valid until Dec 2027
                        </p>
                      </div>
                      <span className="text-green-600 font-bold">
                        ✓ Verified
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">
                          Vehicle Registration
                        </p>
                        <p className="text-sm text-gray-600">
                          Valid until June 2026
                        </p>
                      </div>
                      <span className="text-green-600 font-bold">
                        ✓ Verified
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">
                          Insurance Certificate
                        </p>
                        <p className="text-sm text-gray-600">
                          Valid until Dec 2025
                        </p>
                      </div>
                      <span className="text-yellow-600 font-bold">
                        ⚠ Renew Soon
                      </span>
                    </div>
                  </div>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </RoleGuard>
  );
}
