// Dependencies
import { useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { startOfDay, endOfDay, startOfWeek, startOfMonth } from "date-fns";
import { FaArrowLeft } from "react-icons/fa";

// Types
import type { PostType } from "./Post";

// Hooks
import { useAppContext } from "../hooks/useAppContext";
import { db } from "../hooks/useFirestore";

// Components
import PostFilters from "./PostFilters";
import OrderPost from "./OrderPost";

interface OrdersHistoryProps {
  onBackClick?: () => void;
}

export default function OrdersHistory({ onBackClick }: OrdersHistoryProps) {
  const { currentUser, posts, setPosts, postFilter } = useAppContext();

  useEffect(() => {
    if (!currentUser?.uid) return;
    const postsRef = collection(db, "posts");
    const isUserLoggedIn = where("uid", "==", currentUser.uid);
    const filter = postFilter?.toLowerCase();

    let activeQuery;
    if (filter === "today") {
      const today = new Date();
      const dayStart = startOfDay(today);
      const dayEnd = endOfDay(today);
      const isStartOfTheDay = where("createdAt", ">=", dayStart);
      const isEndOfTheDay = where("createdAt", "<=", dayEnd);

      activeQuery = query(
        postsRef,
        isUserLoggedIn,
        isStartOfTheDay,
        isEndOfTheDay,
        orderBy("createdAt", "desc")
      );
    } else if (filter === "week") {
      const today = new Date();

      const lastMonday = startOfWeek(today, { weekStartsOn: 1 });
      const dayEnd = endOfDay(today);

      activeQuery = query(
        postsRef,
        isUserLoggedIn,
        where("createdAt", ">=", lastMonday),
        where("createdAt", "<=", dayEnd),
        orderBy("createdAt", "desc")
      );
    } else if (filter === "month") {
      const today = new Date();

      const monthStart = startOfMonth(today);
      const dayEnd = endOfDay(today);

      activeQuery = query(
        postsRef,
        isUserLoggedIn,
        where("createdAt", ">=", monthStart),
        where("createdAt", "<=", dayEnd),
        orderBy("createdAt", "desc")
      );
    } else {
      activeQuery = query(
        postsRef,
        isUserLoggedIn,
        orderBy("createdAt", "desc")
      );
    }
    const unsubscribe = onSnapshot(activeQuery, (postsSnapshot) => {
      const firebasePostList: PostType[] = postsSnapshot.docs.map(
        (docSnapshot) => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            userName: data.userName,
            userPhotoURL: data.userPhotoURL,
            createdAt: data.createdAt,
            itemName: data.itemName,
            uid: data.uid,
            body: data.body,
            category: data.category,
            // Order-specific fields
            orderItems: data.orderItems,
            totalAmount: data.totalAmount,
            orderStatus: data.orderStatus,
            paymentMethod: data.paymentMethod,
            customerName: data.customerName,
            customerLocation: data.customerLocation,
          };
        }
      );

      setPosts(firebasePostList);
    });

    return () => unsubscribe();
  }, [postFilter, setPosts, currentUser]);

  return (
    <div className="w-full max-w-[800px] mx-auto flex flex-col gap-6 p-4 sm:p-2">
      <div className="flex items-center gap-4">
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="flex items-center gap-2 px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors"
          >
            <FaArrowLeft className="text-lg" />
            Back
          </button>
        )}
        <h2 className="text-2xl text-orange-600 font-Calistoga tracking-wider">
          Orders History
        </h2>
      </div>
      <PostFilters />
      <div
        id="posts-container"
        className="flex flex-wrap items-center justify-between gap-4"
      >
        {posts.length > 0
          ? posts.map((post) => <OrderPost key={post.id} post={post} />)
          : "No orders Yet!"}
      </div>
    </div>
  );
}
