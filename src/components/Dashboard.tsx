// Dependencies
import { useEffect } from "react";
import {
  collection,
  Timestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { startOfDay, endOfDay, startOfWeek, startOfMonth } from "date-fns";

// Types
import type { Post } from "../App";

// Hooks
import { useAppContext } from "../hooks/useAppContext";
import { useFirestore } from "../hooks/useFirestore";
import { db } from "../firebase";

// Components
import PostFilters from "./PostFilters";
import DeliveryFolk from "./DeliveryFolk";
import PostComponent from "./Post";


export default function Dashboard() {
  const {
    user,
    moodState,
    setMoodState,
    posts,
    setPosts,
    postFilter,
  } = useAppContext();

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
    if (!user?.uid) return;
    const postsRef = collection(db, "posts");
    const isUserLoggedIn = where("uid", "==", user.uid);
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
      const firebasePostList: Post[] = postsSnapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data() as Record<string, unknown>;
        return {
          id: docSnapshot.id,
          userName: (data.userName as string) ?? "",
          userPhotoURL: (data.userPhotoURL as string) ?? "",
          createdAt: (data.createdAt as Timestamp) ?? null,
          mood: (data.mood as string | undefined) ?? undefined,
          uid: (data.uid as string) ?? "",
          body: (data.body as string) ?? "",
        };
      });

      setPosts(firebasePostList);
    });

    return () => unsubscribe();
  }, [postFilter, setPosts, user?.uid]);

  // // Scroll textarea into view on mount
  // useEffect(() => {
  //   const postArea = document.querySelector(
  //     "#post-area"
  //   ) as HTMLTextAreaElement;
  //   if (postArea) {
  //     postArea.scrollIntoView({ behavior: "smooth", block: "center" });
  //   }
  // }, []);

  return (
    <div className="w-full min-w-[390px] sm:max-w-[700px] p-2 flex flex-col justify-center">
      <h2 className="text-2xl p-2 text-orange-600 font-Calistoga tracking-wider">
        Welcome, {user ? user.displayName : "User"}
      </h2>
      <section className="w-full my-8 flex flex-col gap-6 p-2">
        <DeliveryFolk moodState={moodState} onMoodChange={setMoodState} />
        <textarea
          name="post-area"
          id="post-area"
          placeholder="Write down shopping list..."
          maxLength={500}
          autoFocus
          className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-1 focus:ring-blue-300"
          style={{
            resize: "none",
          }}
        ></textarea>
        <div className="w-full flex flex-col gap-2">
          {!moodState && (
            <p id="add-mood-warning" className="text-red-600 font-bold"></p>
          )}
          <button
            id="btn-post"
            onClick={async () => {
              const postBody = getPost();
              const docRef = await publishPostToFirebase(
                user,
                postBody,
                moodState,
                user?.displayName,
                user?.photoURL,
                "#add-mood-warning"
              );
              if (docRef) {
                setMoodState(undefined);
              }
            }}
            className="bg-blue-600 py-2 rounded-lg font-bold text-white text-xl"
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
            ? posts.map((post) => <PostComponent key={post.id} post={post} />)
            : "No orders Yet!"}
        </div>
      </section>
    </div>
  );
}