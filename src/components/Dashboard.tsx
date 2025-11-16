import { FaSignOutAlt } from "react-icons/fa";
import { signOut, type AuthError } from "firebase/auth";
import Profile from "./Profile";
import { useAuth } from "../hooks/useAuth";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";

import { moods } from "../moods";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  Timestamp,
  onSnapshot,
  // doc,
  // setDoc
  // updateDoc
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

  const { auth, user, setUser, updateProfile, setUpdateProfile } = useAuth();

  const photoURL = user?.photoURL || "";

  const moodEls = moods.map((mood) => {
    const { id, emoji, moodText } = mood;
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
        className={`flex flex-col justify-center gap-4 p-2 transition-all duration-1000 ease-in-out ${
          isActive
            ? "scale-125 bg-blue-300 opacity-100 rounded-md"
            : "hover:scale-125  hover:opacity-100 opacity-70"
        }`}
      >
        <span className="text-4xl">{emoji}</span>
        {moodText}
      </button>
    );
  });

  const postsEl = posts.map((post) => {
    const foundMood =
      moods.find((storedMood) => storedMood.id === post.mood) || "😁";
    const options = {
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
        className="w-full flex flex-wrap p-2 m-b-4 bg-orange-200 rounded-md"
      >
        <div className="flex items-center">
          <div className="w-10 h-10 mr-2">
            {post.userPhotoURL ? (
              <img
                src={post.userPhotoURL}
                alt="user profile photo"
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
        <div className="w-full flex items-center justify-between">
          <h3 id="post-timestamp" className="text-xl font-Cabin font-bold">
            {postDate}
          </h3>
          {typeof foundMood === "object" && (
            <span className="text-3xl ml-auto">{foundMood.emoji}</span>
          )}
        </div>
        <div id="post-body" className="text-xl">
          {post.body.split(/\r\n|\n/g).map((line, index) => (
            <p key={index}>{line ? line : <br />}</p>
          ))}
        </div>
      </div>
    );
  });

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
            moodWarningEl.textContent = "Mood selection is mandatory.";
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

      setPosts([]);
      firebasePostsRef.forEach((post) => {
        const newPost: Post = {
          id: post.id,
          ...post.data(),
        };
        setPosts((prevPosts) => [...prevPosts, newPost]);
      });
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
    const unsubscribe = onSnapshot(collection(db, "posts"), (postsSnapshot) => {
      const firebasePostList: Post[] = postsSnapshot.docs.map((post) => {
        return {
          id: post.id,
          ...post.data(),
        };
      });

      setPosts(firebasePostList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <nav className="absolute top-4 right-6 flex gap-2 flex-col items-center justify-center bg-amber-100 p-2 rounded-l-md">
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
        <div className="w-1/2 mx-auto flex flex-col justify-center">
          <h2 className="text-xl font-semibold p-2">
            Welcome {user ? user.displayName : "User"}
          </h2>
          <section className="w-full my-8 mx-auto flex flex-col gap-6 p-2">
            <div id="mood-container" className="flex gap-2">
              {moodEls}
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
                Post
              </button>
              {/* <button
                  id="btn-fetch-posts"
                  onClick={handleClick}
                  className="bg-yellow-600 py-2 rounded-lg font-bold text-white text-xl"
                >
                  Fetch posts
                </button> */}
            </div>
            <div
              id="posts-container"
              className="flex flex-wrap items-center justify-between gap-4"
            >
              {posts.length > 0 ? postsEl : "No posts Yet!"}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
