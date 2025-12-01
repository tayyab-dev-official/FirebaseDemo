import { useAppContext } from "../hooks/useAppContext";
import { FaTrash, FaShoppingCart, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { Timestamp, type DocumentReference } from "firebase/firestore";
import { type PostType } from "./Post";
import { products } from "../data/productsData";
import { useFirestore } from "../hooks/useFirestore";
import fruitShopLogo from "../assets/FruitsShop.jpg";

type Order = {
  id: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalPrice: number;
  customerName: string;
  address: string;
  city: string;
  timestamp: Date;
};

export default function CartSidebar() {
  const {
    cartItems,
    removeFromCart,
    updateCartItem,
    setCartItems,
    currentUser,
    posts,
    setPosts,
  } = useAppContext();
  const { publishOrderPost } = useFirestore();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "card",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode
    ) {
      alert("Please fill in all fields");
      return;
    }

    // Get category from first product in cart
    const orderCategory =
      cartItems.length > 0
        ? products.find((p) => p.id === cartItems[0].productId)?.category ||
          "Fresh Fruits"
        : "Fresh Fruits";

    // Create new order
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: totalPrice,
      customerName: formData.fullName,
      address: formData.address,
      city: formData.city,
      timestamp: new Date(),
    };

    // Add to orders list
    setOrders((prevOrders) => [newOrder, ...prevOrders]);

    // Create order body
    const orderBody = `📦 Order Placed!\n\nCustomer: ${
      formData.fullName
    }\nLocation: ${formData.city}\nItems: ${cartItems
      .map((item) => `${item.name} (x${item.quantity})`)
      .join(", ")}\nTotal: ₹${totalPrice}\nPayment: ${formData.paymentMethod}`;

    // Post order to Firestore
    if (currentUser) {
      publishOrderPost(currentUser, {
        body: orderBody,
        displayName: currentUser.displayName,
        photoURL: fruitShopLogo,
        category: orderCategory,
        orderItems: cartItems.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return {
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            imageUrl: product?.imageUrl || "",
          };
        }),
        totalAmount: totalPrice,
        orderStatus: "pending",
        paymentMethod: formData.paymentMethod,
        customerName: formData.fullName,
        customerLocation: formData.city,
      }).then((docRef: DocumentReference | null) => {
        if (docRef) {
          // Create post object for local state with detailed order info
          const orderPost: PostType = {
            id: docRef.id,
            userName: currentUser.displayName || "Anonymous",
            userPhotoURL: fruitShopLogo,
            createdAt: Timestamp.now(),
            itemName: undefined,
            uid: currentUser.uid,
            body: orderBody,
            category: orderCategory,
            // Order-specific fields
            orderItems: cartItems.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              return {
                productId: item.productId,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                imageUrl: product?.imageUrl || "",
              };
            }),
            totalAmount: totalPrice,
            orderStatus: "pending",
            paymentMethod: formData.paymentMethod,
            customerName: formData.fullName,
            customerLocation: formData.city,
          };

          // Add post to posts array
          setPosts([orderPost, ...posts]);
        }
      });
    }

    // Show order confirmation
    setOrderPlaced(true);

    // Clear cart after 2 seconds
    setTimeout(() => {
      setCartItems([]);
      setShowCheckout(false);
      setOrderPlaced(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        paymentMethod: "card",
      });
    }, 2000);
  };

  return (
    <div className="w-80 bg-white rounded-lg shadow-lg p-4 flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b">
        <FaShoppingCart className="text-orange-600 text-2xl" />
        <h2 className="text-2xl font-bold text-gray-800">Cart</h2>
        <span className="ml-auto bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
          {totalItems}
        </span>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto mt-24 space-y-4">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FaShoppingCart className="text-5xl mb-4 opacity-50" />
            <p className="text-lg">Your cart is empty</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-gray-800">
                  {item.name}
                </h3>
                <p className="text-orange-600 font-bold">₹{item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateCartItem(item.productId, item.quantity - 1)
                    }
                    className="px-2 py-1 bg-orange-200 text-orange-600 rounded hover:bg-orange-300 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateCartItem(item.productId, item.quantity + 1)
                    }
                    className="px-2 py-1 bg-orange-200 text-orange-600 rounded hover:bg-orange-300 transition-colors"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="ml-auto p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4 text-lg font-bold">
            <span>Total:</span>
            <span className="text-orange-600">₹{totalPrice}</span>
          </div>
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
          >
            Checkout
          </button>
        </div>
      )}

      {/* Placed Orders */}
      {orders.length > 0 && (
        <div className="border-t mt-6 pt-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Your Orders</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-green-50 p-3 rounded-lg border border-green-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {order.id}
                  </span>
                  <span className="text-xs text-gray-500">
                    {order.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">Name:</span>{" "}
                  {order.customerName}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">Location:</span> {order.city}
                </p>
                <div className="bg-white p-2 rounded mb-2 max-h-20 overflow-y-auto">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-gray-600 flex justify-between"
                    >
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-green-200">
                  <span className="text-sm font-bold text-gray-800">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    ₹{order.totalPrice}
                  </span>
                </div>
                <div className="mt-2 px-3 py-1 bg-green-200 text-green-800 rounded text-xs font-semibold text-center">
                  ✓ Order Confirmed
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {orderPlaced ? (
              // Order Confirmation
              <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="text-6xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Order Placed!
                </h2>
                <p className="text-gray-600 text-center mb-4">
                  Thank you for your order. Your items will be delivered soon.
                </p>
                <p className="text-lg font-bold text-orange-600">
                  ₹{totalPrice}
                </p>
              </div>
            ) : (
              // Checkout Form
              <>
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FaTimes size={24} className="text-gray-600" />
                  </button>
                </div>

                <form onSubmit={handleCheckout} className="p-4 space-y-4">
                  {/* Order Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">
                      Order Summary
                    </h3>
                    <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div
                          key={item.productId}
                          className="flex justify-between text-sm text-gray-700"
                        >
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-semibold">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-orange-600">
                      <span>Total:</span>
                      <span>₹{totalPrice}</span>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="+91 9876543210"
                    />
                  </div>

                  {/* Address Information */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="New Delhi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="110001"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Payment Method *
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="card">Credit/Debit Card</option>
                      <option value="upi">UPI</option>
                      <option value="netbanking">Net Banking</option>
                      <option value="cod">Cash on Delivery</option>
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                    >
                      Place Order
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
