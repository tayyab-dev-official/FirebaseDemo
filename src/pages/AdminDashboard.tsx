import { useState } from "react";
import Header from "../components/Header";
import RoleGuard from "../components/RoleGuard";
import { useAppContext } from "../hooks/useAppContext";
import {
  FaUsers,
  FaShoppingCart,
  FaChartBar,
  FaBox,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";

interface AdminDashboardProps {
  photoURL?: string;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
  onNavigate?: (page: string) => void;
}

export default function AdminDashboard({
  photoURL = "",
  onProfileClick = () => {},
  onLogoutClick = () => {},
  onNavigate = () => {},
}: AdminDashboardProps) {
  const { currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "users" | "analytics"
  >("overview");

  // Mock admin data
  const adminStats = {
    totalUsers: 1250,
    totalOrders: 3420,
    totalRevenue: 254890,
    activeProducts: 25,
    pendingOrders: 18,
    cancelledOrders: 45,
  };

  const pendingOrders = [
    {
      id: "ORD101",
      customer: "John Doe",
      items: 3,
      total: 1200,
      date: "2025-12-03 10:30",
    },
    {
      id: "ORD102",
      customer: "Jane Smith",
      items: 2,
      total: 680,
      date: "2025-12-03 09:15",
    },
    {
      id: "ORD103",
      customer: "Mike Johnson",
      items: 4,
      total: 2100,
      date: "2025-12-02 16:45",
    },
  ];

  const products = [
    { id: 1, name: "Apples", stock: 150, price: 180, status: "in-stock" },
    { id: 2, name: "Bananas", stock: 5, price: 80, status: "low-stock" },
    { id: 3, name: "Grapes", stock: 0, price: 320, status: "out-of-stock" },
    { id: 4, name: "Pineapple", stock: 45, price: 120, status: "in-stock" },
  ];

  const getStockColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800";
      case "out-of-stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <RoleGuard requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
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
        <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 transition-colors"
        >
          <FaArrowLeft /> Back to Home
        </button>

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage your business operations</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs">Users</p>
                <p className="text-2xl font-bold text-blue-600">
                  {adminStats.totalUsers}
                </p>
              </div>
              <FaUsers className="text-3xl text-blue-300" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs">Orders</p>
                <p className="text-2xl font-bold text-orange-600">
                  {adminStats.totalOrders}
                </p>
              </div>
              <FaShoppingCart className="text-3xl text-orange-300" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs">Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{(adminStats.totalRevenue / 1000).toFixed(0)}K
                </p>
              </div>
              <FaChartBar className="text-3xl text-green-300" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs">Products</p>
                <p className="text-2xl font-bold text-purple-600">
                  {adminStats.activeProducts}
                </p>
              </div>
              <FaBox className="text-3xl text-purple-300" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {adminStats.pendingOrders}
                </p>
              </div>
              <FaCheckCircle className="text-3xl text-yellow-300" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">
                  {adminStats.cancelledOrders}
                </p>
              </div>
              <FaCheckCircle className="text-3xl text-red-300" />
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
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "products"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "users"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "analytics"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Analytics
            </button>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Pending Orders
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
                            Items
                          </th>
                          <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                            Amount
                          </th>
                          <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                            Date
                          </th>
                          <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingOrders.map((order) => (
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
                              {order.items} items
                            </td>
                            <td className="px-4 py-3 font-bold text-orange-600">
                              ₹{order.total}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {order.date}
                            </td>
                            <td className="px-4 py-3">
                              <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    Product Inventory
                  </h3>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                    Add Product
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                          Product
                        </th>
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                          Price
                        </th>
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                          Stock
                        </th>
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-semibold text-gray-800">
                            {product.name}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            ₹{product.price}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {product.stock} units
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStockColor(
                                product.status
                              )}`}
                            >
                              {product.status.replace("-", " ")}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm mr-3">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-800 font-semibold text-sm">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  User Management
                </h3>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-600 mb-4">
                    Manage user accounts, permissions, and activity
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-3xl font-bold text-blue-600">
                        {adminStats.totalUsers}
                      </p>
                      <p className="text-gray-600 text-sm">Total Users</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-3xl font-bold text-green-600">892</p>
                      <p className="text-gray-600 text-sm">Active Users</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-3xl font-bold text-orange-600">358</p>
                      <p className="text-gray-600 text-sm">New This Month</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Business Analytics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                    <h4 className="font-bold text-orange-800 mb-4">
                      Revenue Trend
                    </h4>
                    <p className="text-3xl font-bold text-orange-600">
                      ₹{adminStats.totalRevenue}
                    </p>
                    <p className="text-sm text-orange-700">
                      +12% from last month
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                    <h4 className="font-bold text-blue-800 mb-4">
                      Order Volume
                    </h4>
                    <p className="text-3xl font-bold text-blue-600">
                      {adminStats.totalOrders}
                    </p>
                    <p className="text-sm text-blue-700">+8% from last month</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                    <h4 className="font-bold text-green-800 mb-4">
                      Average Order Value
                    </h4>
                    <p className="text-3xl font-bold text-green-600">
                      ₹
                      {Math.round(
                        adminStats.totalRevenue / adminStats.totalOrders
                      )}
                    </p>
                    <p className="text-sm text-green-700">Stable performance</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                    <h4 className="font-bold text-purple-800 mb-4">
                      Customer Satisfaction
                    </h4>
                    <p className="text-3xl font-bold text-purple-600">4.8/5</p>
                    <p className="text-sm text-purple-700">
                      Based on {Math.round(adminStats.totalOrders * 0.75)}{" "}
                      reviews
                    </p>
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
