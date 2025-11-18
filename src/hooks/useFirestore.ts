import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  type DocumentReference,
  type Timestamp,
} from "firebase/firestore";
import { type User } from "firebase/auth";
import { db } from "../firebase";

export interface Post {
  userName: string;
  userPhotoURL: string;
  id: string;
  createdAt: Timestamp;
  mood: string | undefined;
  uid: string;
  body: string;
}

/**
 * Custom hook for Firebase Firestore operations
 * Handles post creation, updates, and deletions
 */
export function useFirestore() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Publish a new post to Firestore with validation
   * @param user - Current Firebase user
   * @param postBody - The post content text
   * @param mood - The selected delivery folk/mood
   * @param displayName - User's display name
   * @param photoURL - User's photo URL
   * @param warningElementSelector - Optional selector for warning message element
   * @returns DocumentReference if successful, null otherwise
   */
  async function publishPost(
    user: User | null,
    postBody: string,
    mood: string | undefined,
    displayName: string | null | undefined,
    photoURL: string | null | undefined,
    warningElementSelector?: string
  ): Promise<DocumentReference | null> {
    try {
      setIsLoading(true);
      setError(null);
      const warningEl = warningElementSelector
        ? (document.querySelector(warningElementSelector) as HTMLElement | null)
        : null;

      if (!user) {
        setError("User not authenticated");
        if (warningEl) {
          warningEl.textContent = "User not authenticated";
        }
        return null;
      }

      if (!mood) {
        setError("Delivery Folk selection is mandatory");
        if (warningEl) {
          warningEl.textContent = "Delivery Folk selection is mandatory.";
        }
        return null;
      }

      if (!postBody.trim()) {
        setError("Post content cannot be empty");
        if (warningEl) {
          warningEl.textContent = "Post content cannot be empty.";
        }
        return null;
      }

      const post = {
        userName: displayName,
        userPhotoURL: photoURL,
        body: postBody,
        uid: user.uid,
        mood: mood,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "posts"), post);
      // Clear warning on success
      if (warningEl) {
        warningEl.textContent = "";
      }
      return docRef;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error publishing post:", errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Fetch all posts from Firestore
   * @returns Array of Post objects if successful, empty array otherwise
   */
  async function fetchPosts(): Promise<Post[]> {
    try {
      setIsLoading(true);
      setError(null);

      const firebasePostsRef = await getDocs(collection(db, "posts"));
      console.log(`Fetched ${firebasePostsRef.docs.length} posts`);

      const postList: Post[] = firebasePostsRef.docs.map((docSnapshot) => {
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

      return postList;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error fetching posts:", errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Update a post's body content
   * @param postId - The ID of the post to update
   * @param newBody - The new post body content
   * @returns true if successful, false otherwise
   */
  async function updatePost(postId: string, newBody: string): Promise<boolean> {
    try {
      setIsLoading(true);
      setError(null);

      if (!newBody.trim()) {
        setError("Post content cannot be empty");
        return false;
      }

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        body: newBody,
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error updating post:", errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Delete a post from Firestore
   * @param postId - The ID of the post to delete
   * @returns true if successful, false otherwise
   */
  async function deletePost(postId: string): Promise<boolean> {
    try {
      setIsLoading(true);
      setError(null);

      const postRef = doc(db, "posts", postId);
      await deleteDoc(postRef);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error deleting post:", errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    publishPost,
    fetchPosts,
    updatePost,
    deletePost,
    isLoading,
    error,
  };
}

