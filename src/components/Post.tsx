import { products } from "../data/productsData";
import { useFirestore } from "../hooks/useFirestore";
// import { useAppContext } from "../hooks/useAppContext";
import { Timestamp } from "firebase/firestore";
// import { FaUserCircle } from "react-icons/fa";

interface PostProps {
  post: PostType;
  onEdit?: (post: PostType) => void;
  onDelete?: (post: PostType) => void;
}

// Custom Types
export type PostType = {
  id: string;
  userName: string;
  userPhotoURL: string;
  createdAt: Timestamp;
  itemName: string | undefined;
  uid: string;
  body: string;
  category?: string;
  // Order-specific fields
  orderItems?: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }>;
  totalAmount?: number;
  orderStatus?: "pending" | "confirmed" | "shipped" | "delivered";
  paymentMethod?: string;
  customerName?: string;
  customerLocation?: string;
};

export default function Post({ post, onEdit, onDelete }: PostProps) {
  // const { currentUser } = useAppContext()
  // const currentUserPhotoURL = currentUser?.photoURL || ""
  const {
    updatePost: updatePostInFirebase,
    deletePost: deletePostFromFirebase,
  } = useFirestore();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };

  const postDate = !post.createdAt
    ? "Getting Timestamp..."
    : post.createdAt
        .toDate()
        .toLocaleString("en-IN", options)
        .replace(",", " -")
        .replace("am", "AM")
        .replace("pm", "PM");

  /**
   * Update the post body with user input via prompt
   */
  async function handleUpdatePost() {
    const newBody = prompt("Edit the post body.", post.body);
    if (newBody) {
      const success = await updatePostInFirebase(post.id, newBody);
      if (success) {
        onEdit?.(post);
      }
    }
  }

  /**
   * Delete the post from Firestore
   */
  async function handleDeletePost() {
    const success = await deletePostFromFirebase(post.id);
    if (success) {
      onDelete?.(post);
    }
  }

  return (
    <div
      id={post.id}
      className="relative w-full flex flex-col p-4 rounded-md shadow-lg bg-orange-200"
    >
      {/* Header with timestamp and category */}
      <div className="w-full flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 id="post-timestamp" className="text-lg font-Cabin font-bold">
            {postDate}
          </h3>
          {post.category && (
            <div className="flex items-center gap-2">
              <img
                src={post.userPhotoURL}
                alt={post.category}
                className="w-12 h-12 rounded-full object-cover object-center border-2 border-orange-400"
                title={post.category}
              />
              <span className="text-sm font-semibold text-gray-700">
                {post.category}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Order Items Display */}
      {post.orderItems && post.orderItems.length > 0 && (
        <div className="mb-4 p-3 bg-white rounded-lg">
          <h4 className="font-bold text-gray-800 mb-3">Order Items:</h4>
          <div className="space-y-3">
            {post.orderItems.map((item, index) => (
              <div
                key={index}
                className="flex gap-3 p-2 border-b border-gray-200 last:border-b-0"
              >
                {/* Item Image */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 rounded object-cover object-center"
                />
                {/* Item Details */}
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Unit Price: ₹{item.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  <p className="font-semibold text-gray-800">
                    Total: ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Summary */}
      {post.totalAmount !== undefined && (
        <div className="mb-4 p-3 bg-white rounded-lg">
          <div className="space-y-2">
            {post.customerName && (
              <p className="text-sm">
                <span className="font-bold">Customer:</span> {post.customerName}
              </p>
            )}
            {post.customerLocation && (
              <p className="text-sm">
                <span className="font-bold">Location:</span>{" "}
                {post.customerLocation}
              </p>
            )}
            {post.paymentMethod && (
              <p className="text-sm">
                <span className="font-bold">Payment:</span> {post.paymentMethod}
              </p>
            )}
            {post.orderStatus && (
              <p className="text-sm">
                <span className="font-bold">Status:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded text-white text-xs font-bold ${
                    post.orderStatus === "pending"
                      ? "bg-yellow-500"
                      : post.orderStatus === "confirmed"
                      ? "bg-blue-500"
                      : post.orderStatus === "shipped"
                      ? "bg-purple-500"
                      : "bg-green-500"
                  }`}
                >
                  {post.orderStatus.charAt(0).toUpperCase() +
                    post.orderStatus.slice(1)}
                </span>
              </p>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-300 text-right">
            <p className="text-lg font-bold text-orange-600">
              Final Amount: ₹{post.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Post Body (for non-order posts) */}
      {!post.orderItems && (
        <div
          id="post-body"
          className="w-full text-base whitespace-pre-wrap p-2 mb-4"
        >
          {post.body.split(/\r\n|\n/g).map((line, index) => {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const parts = line.split(urlRegex);

            return (
              <div key={index} className="w-full">
                {line ? (
                  parts.map((part, partIndex) =>
                    urlRegex.test(part) ? (
                      <a
                        key={partIndex}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800 cursor-pointer break-all"
                      >
                        {part}
                      </a>
                    ) : (
                      <span key={partIndex}>{part}</span>
                    )
                  )
                ) : (
                  <br />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit and Delete Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleUpdatePost}
          className="flex-1 bg-orange-600 px-4 py-2 rounded-lg font-bold text-white hover:bg-orange-700 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDeletePost}
          className="flex-1 bg-red-600 px-4 py-2 rounded-lg font-bold text-white hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
