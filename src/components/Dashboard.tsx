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

// Types
import type { PostType } from "./Post";

// Hooks
import { useAppContext } from "../hooks/useAppContext";
import { useFirestore } from "../hooks/useFirestore";
import { db } from "../hooks/useFirestore";
// Components
import Login from "./Login";
import Profile from "./Profile";
import Header from "./Header";
import PostFilters from "./PostFilters";
import DeliveryFolk from "./Product"
import Post from "./Post"

export default function Dashboard() {
  const {
    currentUser,
    firebaseSignOut,
    IsUpdateUserProfile,
    setIsUpdateUserProfile,
    selectedProduct,
    setselectedProduct,
    posts,
    setPosts,
    postFilter,
  } = useAppContext();

  const currentUserName = currentUser?.displayName || "User";
  console.log(`[DASHBOARD] current user: ${currentUser?.email}`)

  // fetchPosts is available from the hook for fetching all posts if needed
  // It can be used alongside the real-time subscription for initial load or manual refreshes
  const { publishPost: publishPostToFirebase } = useFirestore();

  function getPost() {
    const postEl: HTMLInputElement | null =
      document.querySelector("#post-area");
    if (!postEl) {
      return "";
    }
    const postBody = postEl.value;
    postEl.value = "";
    return postBody;
  }

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
      const firebasePostList: PostType[] = postsSnapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        return {
          id: docSnapshot.id,
          userName: data.userName,
          userPhotoURL: data.userPhotoURL,
          createdAt: data.createdAt,
          itemName: data.itemName,
          uid: data.uid,
          body: data.body,
        };
      });

      setPosts(firebasePostList);
    });

    return () => unsubscribe();
  }, [postFilter, setPosts, currentUser]);

  // // Scroll textarea into view on mount
  // useEffect(() => {
  //   const postArea = document.querySelector(
  //     "#post-area"
  //   ) as HTMLTextAreaElement;
  //   if (postArea) {
  //     postArea.scrollIntoView({ behavior: "smooth", block: "center" });
  //   }
  // }, []);

  if (!currentUser) return <Login />;
  if (IsUpdateUserProfile) return <Profile />;

  return (
    <>
      <div className="w-full mx-auto min-w-[350px] sm:max-w-[1200px] p-2 flex flex-col justify-center">
        <Header
          photoURL={currentUser.photoURL || ""}
          onProfileClick={() => setIsUpdateUserProfile(true)}
          onLogoutClick={firebaseSignOut}
        />
        <h2 className="text-2xl p-4 text-orange-600 font-Calistoga tracking-wider">
          Welcome, {currentUserName}
        </h2>
        <DeliveryFolk selectedProduct={selectedProduct} OnselectedProductChange={setselectedProduct} />
        <section className="w-full max-w-[800px] mx-auto flex flex-col gap-6 p-4 sm:p-2">
          <textarea
            name="post-area"
            id="post-area"
            placeholder="Write down address and contact number..."
            maxLength={500}
            className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-1 focus:ring-blue-300"
            style={{
              resize: "none",
            }}
          ></textarea>
          <div className="w-full flex flex-col gap-2">
            {!selectedProduct && (
              <p id="add-product-warning" className="text-red-600 font-bold"></p>
            )}
            <button
              id="btn-post"
              onClick={async () => {
                const postBody = getPost();
                const docRef = await publishPostToFirebase(
                  currentUser,
                  postBody,
                  selectedProduct,
                  currentUser?.displayName,
                  currentUser?.photoURL,
                  "#add-product-warning"
                );
                if (docRef) {
                  setselectedProduct(undefined);
                }
              }}
              className="bg-blue-600 py-2 rounded-lg font-bold text-white text-xl min-w-[350px] self-center"
            >
              Order
            </button>
            {/* <button
              id="btn-fetch-posts"
              onClick={fetchPosts}
              className="bg-yellow-600 py-2 rounded-lg font-bold text-white text-xl"
            >
              Fetch posts
            </button> */}
          </div>
          <PostFilters />
          <div
            id="posts-container"
            className="flex flex-wrap items-center justify-between gap-4"
          >
            {posts.length > 0
              ? posts.map((post) => <Post key={post.id} post={post} />)
              : "No orders Yet!"}
          </div>
        </section>
      </div>
    </>
  );
}
