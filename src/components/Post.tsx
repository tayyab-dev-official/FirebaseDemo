import { delFolks } from "../data/DelFolksData";
import { useFirestore } from "../hooks/useFirestore";
import { useAppContext } from "../hooks/useAppContext";
import { Timestamp } from "firebase/firestore";
import { FaUserCircle } from "react-icons/fa";

interface PostProps {
  post: PostType;
  onEdit?: (post: PostType) => void;
  onDelete?: (post: PostType) => void;
}

// Custom Types
export type PostType = {
  userName: string;
  userPhotoURL: string;
  id: string;
  createdAt: Timestamp;
  itemName: string | undefined;
  uid: string;
  body: string;
};

export default function Post({ post, onEdit, onDelete }: PostProps) {
  const { currentUser } = useAppContext()
  const currentUserPhotoURL = currentUser?.photoURL || ""
  const {
    updatePost: updatePostInFirebase,
    deletePost: deletePostFromFirebase,
  } = useFirestore();
  const foundPost = delFolks.find((folk) => folk.id === post.itemName);
  if (foundPost) {
    console.log(foundPost)
  }

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
      className="relative w-full min-h-[180px] flex flex-wrap p-2 rounded-md shadow-lg bg-orange-200"
    >
      <div className="w-full flex items-center justify-between">
        <h3 id="post-timestamp" className="text-xl font-Cabin font-bold -mt-14">
          {postDate}
        </h3>
        {foundPost && (
          <div className="flex flex-col items-center gap-2 mt-2 mr-2">
            <img
              src={foundPost.imageUrl}
              alt={foundPost.name}
              className="w-14 h-14 rounded-full object-cover object-center"
            />
            <span className="font-bold text-sm">{foundPost.name}</span>
          </div>
        )}
      </div>

      <div className="flex items-center my-4">
        <div className="w-10 h-10 mr-2">
          {currentUserPhotoURL !== "" ? (
            <img
              src={currentUserPhotoURL}
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
          {currentUser?.displayName}
        </span>
      </div>

      <div
        id="post-body"
        className="w-full text-xl whitespace-pre-wrap p-2 mt-2"
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

      <button
        onClick={handleUpdatePost}
        className="mx-auto bg-orange-600 mt-4 px-6 py-2 rounded-lg font-bold absolute left-2 top-10 text-white"
      >
        Edit
      </button>

      <button
        onClick={handleDeletePost}
        className="mx-auto bg-orange-600 mt-4 px-4 py-2 rounded-lg font-bold absolute left-25 top-10 text-white"
      >
        Delete
      </button>
    </div>
  );
}
