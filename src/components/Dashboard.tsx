import { FaSignOutAlt } from "react-icons/fa";
import { signOut, type AuthError } from "firebase/auth";
import Profile from "./Profile";
import { useAuth } from "../hooks/useAuth";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";

import { delFolks } from "../moods";
import PostFilters from "./PostFilters";

import { startOfDay, endOfDay, startOfWeek, startOfMonth } from "date-fns";

import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  // deleteField,
  // setDoc
  getDocs,
  collection,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

type Post = {
  userName: string;
  userPhotoURL: string;
  id: string;
  createdAt: Timestamp;
  mood: string | undefined;
  uid: string;
  body: string;
};

export default function Dashboard() {
  const [moodState, setMoodState] = useState<string | undefined>(undefined);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postFilter, setPostFilter] = useState<undefined | string>(undefined);

  const { auth, user, setUser, updateProfile, setUpdateProfile } = useAuth();
  const photoURL = user?.photoURL || "";

  const delfolksEl = delFolks.map((folk) => {
    const { id, name, imageUrl, moodText } = folk;
    const isActive = moodState === id;
    return (
      <button
        key={id}
        id={id}
        onClick={() => {
          if (isActive) {
            setMoodState(undefined);
          } else {
            setMoodState(id);
          }
        }}
        aria-pressed={isActive}
        className={`flex flex-col justify-center items-center gap-2 p-2 transition-all duration-1000 ease-in-out rounded-lg ${
          isActive
            ? "scale-110 ring-4 ring-blue-400 opacity-100"
            : "hover:scale-105 hover:opacity-100 opacity-70"
        }`}
      >
        <img
          src={imageUrl}
          alt={name}
          className="w-16 h-16 rounded-full object-cover object-center"
        />
        <div className="text-center">
          <div className="font-bold text-sm">{name}</div>
          <div className="text-xs text-gray-600">
            {moodText.split(" - ")[1]}
          </div>
        </div>
      </button>
    );
  });

  const postsEl = posts.map((post) => {
    const foundMood = delFolks.find((folk) => folk.id === post.mood);
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

    return (
      <div
        id={post.id}
        key={post.id}
        className="relative w-full flex flex-wrap p-2 m-b-4 rounded-md shadow-lg bg-orange-200"
      >
        <div className="w-full flex items-center justify-between -mb-6">
          <h3 id="post-timestamp" className="text-xl font-Cabin font-bold -mt-6">
            {postDate}
          </h3>
          {foundMood && (
            <div className="flex flex-col items-center gap-2 mt-2 mr-2">
              <img
                src={foundMood.imageUrl}
                alt={foundMood.name}
                className="w-14 h-14 rounded-full object-cover object-center"
              />
              <span className="font-bold text-sm">{foundMood.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center mb-4">
          <div className="w-10 h-10 mr-2">
            {post.userPhotoURL !== "" ? (
              <img
                src={post.userPhotoURL}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                alt="profile picture"
                className="w-full h-full rounded-full"
              />
            ) : (
              <FaUserCircle className="w-full h-full rounded-full fill-blue-500 scale-110" />
            )}
          </div>
          <span className="font-bold text-lg text-amber-900">
            {post.userName}
          </span>
        </div>

        <div id="post-body" className="w-full text-xl whitespace-pre-wrap">
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

        <button
          onClick={() => updatePost(post)}
          className="mx-auto bg-orange-600 mt-4 px-6 py-2 rounded-lg font-bold absolute right-25 bottom-4 text-white"
        >
          Edit
        </button>

        <button
          onClick={() => deletePost(post)}
          className="mx-auto bg-orange-600 mt-4 px-4 py-2 rounded-lg font-bold absolute right-2 bottom-4 text-white"
        >
          Delete
        </button>
      </div>
    );
  });

  async function updatePost(post: Post) {
    try {
      const postRef = doc(db, "posts", post.id);
      const newBody = prompt("Edit the post body.", post.body);
      if (newBody) {
        await updateDoc(postRef, {
          body: newBody,
        });

        // Create or update existing document.
        // setDoc(postRef, { body: newBody }, { merge: true})
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  async function deletePost(post: Post) {
    try {
      const postRef = doc(db, "posts", post.id);
      await deleteDoc(postRef);

      // Delete field of an existing document.
      // await updateDoc(postRef, {
      //   body: deleteField(),
      // });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }

  async function handleClick(event: React.MouseEvent) {
    const { id } = event.currentTarget;

    if (id === "user-profile") setUpdateProfile(true);
    else if (id === "btn-post") {
      try {
        const postBody = getPost();
        const user = auth.currentUser;
        const moodWarningEl = document.querySelector("#add-mood-warning");
        if (user) {
          // post object creation
          const post = {
            userName: user.displayName,
            userPhotoURL: user.photoURL,
            body: postBody,
            uid: user.uid,
            mood: moodState,
            createdAt: serverTimestamp(),
          };

          if (!post.mood && moodWarningEl) {
            moodWarningEl.textContent = "Delivery Folk selection is mandatory.";
          }

          // publishing post to the firebase
          // const postRef = await addDoc(collection(db, "posts"), post)
          await addDoc(collection(db, "posts"), post);
          setMoodState(undefined);
          // console.log(postRef.id)

          // post timestamp update
          // const docRef = doc(db, 'posts', postRef.id)
          // await updateDoc(docRef, {
          //   timestamp: serverTimestamp()
          // })
        }
        // setPostCount(prv => ++prv)
        // await setDoc(
        //   doc(db, "posts", `post-${postCount + 1}`),
        //   { post }
        // )
      } catch (error) {
        if (error instanceof Error) {
          const { message, code } = error as AuthError;
          console.error(code);
          console.error(message);
        }
      }
    } else if (id === "btn-fetch-posts") {
      const firebasePostsRef = await getDocs(collection(db, "posts"));
      console.log(firebasePostsRef.docs.length);

      const list: Post[] = firebasePostsRef.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          userName: (data.userName as string) ?? "",
          userPhotoURL: (data.userPhotoURL as string) ?? "",
          createdAt: (data.createdAt as Timestamp) ?? null,
          mood: (data.mood as string | undefined) ?? undefined,
          uid: (data.uid as string) ?? "",
          body: (data.body as string) ?? "",
        };
      });

      setPosts(list);
    }
  }

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

  async function logOut() {
    try {
      if (auth && typeof auth !== "boolean") {
        await signOut(auth);
        setUser(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        const { code, message } = error as AuthError;
        console.error(code);
        console.error(message);
      }
    }
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
  }, [postFilter, user?.uid]);

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
    <>
      <nav className="sm:absolute sm:top-4 sm:right-6 flex gap-2 flex-col items-center justify-center bg-amber-100 p-2 rounded-l-md">
        <div id="img-container" className="w-[50px] h-[50px] ">
          {photoURL ? (
            <img
              id="profile-image"
              src={photoURL}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              alt="profile picture"
              className="w-full h-full rounded-full"
            />
          ) : (
            <FaUserCircle className="w-full h-full rounded-full fill-blue-500 scale-110" />
          )}
        </div>
        <div id="user-profile" onClick={handleClick}>
          Profile
        </div>
        <button
          onClick={logOut}
          className="flex items-center gap-2 shadow-md px-4 py-2 rounded-md bg-blue-400 text-white font-bold"
        >
          <FaSignOutAlt className="text-xl" />
          Logout
        </button>
      </nav>

      {updateProfile ? (
        <Profile />
      ) : (
        <div className="w-full min-w-[350px] sm:max-w-[700px] p-2 flex flex-col justify-center">
          <h2 className="text-xl font-semibold p-2">
            Welcome {user ? user.displayName : "User"}
          </h2>
          <section className="w-full my-8 flex flex-col gap-6 p-2">
            <div
              id="mood-container"
              className="flex flex-wrap gap-2 justify-center"
            >
              {delfolksEl}
            </div>
            <textarea
              name="post-area"
              id="post-area"
              placeholder="Write down how you're feeling..."
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
                onClick={handleClick}
                className="bg-blue-600 py-2 rounded-lg font-bold text-white text-xl"
              >
                Order
              </button>
              {/* <button
                  id="btn-fetch-posts"
                  onClick={handleClick}
                  className="bg-yellow-600 py-2 rounded-lg font-bold text-white text-xl"
                >
                  Fetch posts
                </button> */}
            </div>
            <PostFilters updateFilter={setPostFilter} />
            <div
              id="posts-container"
              className="flex flex-wrap items-center justify-between gap-4"
            >
              {posts.length > 0 ? postsEl : "No orders Yet!"}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
