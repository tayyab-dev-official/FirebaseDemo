import { useState } from "react";
// ------------------------------------------------------
// Firebase Firestore Setup
// ------------------------------------------------------
import {
  getFirestore,
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
import { app } from "../backend/setup";

export const db = getFirestore(app);

// ------------------------------------------------------
// Context Types
// ------------------------------------------------------
import { type PostType } from "../components/Post";

// ------------------------------------------------------
// Custom Hook for Firebase Firestore
// ------------------------------------------------------
export function useFirestore() {
  const [IsLoadingPost, setIsLoadingPost] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Publish a new post to Firestore with validation
   * @param user - Current Firebase user
   * @param postBody - The post content text
   * @param itemName - The selected item/category
   * @param displayName - User's display name
   * @param photoURL - User's photo URL
   * @param warningElementSelector - Optional selector for warning message element
   * @returns DocumentReference if successful, null otherwise
   */
  async function publishPost(
    user: User | null,
    postBody: string,
    itemName: string | undefined,
    displayName: string | null | undefined,
    photoURL: string | null | undefined,
    warningElementSelector?: string
  ): Promise<DocumentReference | null> {
    try {
      setIsLoadingPost(true);
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
        itemName: itemName,
        category: itemName, // Store category from itemName
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
      setIsLoadingPost(false);
    }
  }

  /**
   * Publish an order post to Firestore with complete order details
   * @param user - Current Firebase user
   * @param orderData - Complete order information including items, total, status, etc.
   * @returns DocumentReference if successful, null otherwise
   */
  async function publishOrderPost(
    user: User | null,
    orderData: {
      body: string;
      displayName: string | null | undefined;
      photoURL: string | null | undefined;
      category: string;
      orderItems: Array<{
        productId: string;
        name: string;
        quantity: number;
        price: number;
        imageUrl: string;
      }>;
      totalAmount: number;
      orderStatus: "pending" | "confirmed" | "shipped" | "delivered";
      paymentMethod: string;
      customerName: string;
      customerLocation: string;
    }
  ): Promise<DocumentReference | null> {
    try {
      setIsLoadingPost(true);
      setError(null);

      if (!user) {
        setError("User not authenticated");
        return null;
      }

      const post = {
        userName: orderData.displayName,
        userPhotoURL: orderData.photoURL,
        body: orderData.body,
        uid: user.uid,
        category: orderData.category,
        createdAt: serverTimestamp(),
        // Order-specific fields
        orderItems: orderData.orderItems,
        totalAmount: orderData.totalAmount,
        orderStatus: orderData.orderStatus,
        paymentMethod: orderData.paymentMethod,
        customerName: orderData.customerName,
        customerLocation: orderData.customerLocation,
      };

      const docRef = await addDoc(collection(db, "orders"), post);
      return docRef;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error publishing order post:", errorMessage);
      return null;
    } finally {
      setIsLoadingPost(false);
    }
  }

  /**
   * Fetch all posts from Firestore
   * @returns Array of Post objects if successful, empty array otherwise
   */
  async function fetchPosts(): Promise<PostType[]> {
    try {
      setIsLoadingPost(true);
      setError(null);

      const firebasePostsRef = await getDocs(collection(db, "posts"));
      console.log(`Fetched ${firebasePostsRef.docs.length} posts`);

      const postList: PostType[] = firebasePostsRef.docs.map((docSnapshot) => {
        const data = docSnapshot.data() as Record<string, unknown>;
        return {
          id: docSnapshot.id,
          userName: (data.userName as string) ?? "",
          userPhotoURL: (data.userPhotoURL as string) ?? "",
          createdAt: (data.createdAt as Timestamp) ?? null,
          itemName: (data.mood as string | undefined) ?? undefined,
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
      setIsLoadingPost(false);
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
      setIsLoadingPost(true);
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
      setIsLoadingPost(false);
    }
  }

  /**
   * Delete a post from Firestore
   * @param postId - The ID of the post to delete
   * @returns true if successful, false otherwise
   */
  async function deletePost(postId: string): Promise<boolean> {
    try {
      setIsLoadingPost(true);
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
      setIsLoadingPost(false);
    }
  }

  return {
    publishPost,
    publishOrderPost,
    fetchPosts,
    updatePost,
    deletePost,
    IsLoadingPost,
    error,
  };
}
