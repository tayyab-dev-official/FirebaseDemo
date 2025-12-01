import { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { app } from "../backend/setup";

export const storage = getStorage(app);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

export function useFirebaseStorage() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload a file to Firebase Storage
   * @param file - File to upload
   * @param path - Path in storage (e.g., "profile-pictures/userId")
   * @returns Download URL if successful, null otherwise
   */
  async function uploadFile(file: File, path: string): Promise<string | null> {
    try {
      setIsUploading(true);
      setError(null);

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
        return null;
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPEG, PNG, and WebP images are allowed");
        return null;
      }

      // Create a unique filename with timestamp
      const timestamp = Date.now();
      const filename = `${path}_${timestamp}`;
      const fileRef = ref(storage, `profile-pictures/${filename}`);

      // Upload file
      const snapshot = await uploadBytes(fileRef, file);
      console.log(`[STORAGE] File uploaded: ${snapshot.ref.fullPath}`);

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log(`[STORAGE] Download URL obtained: ${downloadURL}`);

      return downloadURL;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error uploading file:", errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  }

  /**
   * Delete a file from Firebase Storage
   * @param fileUrl - Download URL of the file to delete
   * @returns true if successful, false otherwise
   */
  async function deleteFile(fileUrl: string): Promise<boolean> {
    try {
      setIsUploading(true);
      setError(null);

      // Extract path from URL (simplified approach)
      // In production, store the file path separately in Firestore
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
      console.log(`[STORAGE] File deleted`);

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error deleting file:", errorMessage);
      return false;
    } finally {
      setIsUploading(false);
    }
  }

  return {
    uploadFile,
    deleteFile,
    isUploading,
    error,
    MAX_FILE_SIZE,
  };
}
