import {
  getStorage,
  deleteObject,
  getDownloadURL as getStorageDownloadURL,
  ref,
  uploadBytes,
  listAll,
} from "firebase/storage";
import { app } from "./setup";

// Initialize Firebase storage
export const storage = getStorage(app);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

/**
 * Delete all existing profile pictures for a user
 * @param uid - User ID
 */
async function deleteAllUserProfilePictures(uid: string): Promise<void> {
  try {
    const userProfileRef = ref(storage, `profile-pictures/${uid}`);
    const fileList = await listAll(userProfileRef);

    // Delete all files in the user's profile-pictures folder
    for (const fileRef of fileList.items) {
      await deleteObject(fileRef);
      console.log(`[STORAGE] Deleted old profile picture: ${fileRef.fullPath}`);
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[STORAGE] Error deleting old profile pictures:", errorMsg);
  }
}

/**
 * Upload an image to Firebase Storage
 * @param image - Image file to upload
 * @param uid - User ID (currentUser's uid)
 * @returns Object with downloadURL and filePath if successful, null otherwise
 */
export async function uploadImage(
  image: File,
  uid: string
): Promise<{ downloadURL: string; filePath: string } | null> {
  try {
    // Validate file size
    if (image.size > MAX_FILE_SIZE) {
      console.error("[STORAGE] File size exceeds 5MB limit");
      return null;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(image.type)) {
      console.error(
        "[STORAGE] Invalid file type. Only JPEG, PNG, and WebP are allowed"
      );
      return null;
    }

    // Delete all existing profile pictures for this user
    await deleteAllUserProfilePictures(uid);

    // Create file path with timestamp
    const filename = `profile_${Date.now()}`;
    const filePath = `profile-pictures/${uid}/${filename}`;
    const storageRef = ref(storage, filePath);

    // Upload file
    await uploadBytes(storageRef, image);
    console.log(`[STORAGE] File uploaded: ${filePath}`);

    // Get and return download URL
    const downloadURL = await getStorageDownloadURL(storageRef);
    console.log(`[STORAGE] Download URL obtained`);

    return { downloadURL, filePath };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[STORAGE] Upload error:", errorMsg);
    return null;
  }
}

/**
 * Get download URL for a file by its storage path
 * @param filePath - Full path to file in storage
 * @returns Download URL if successful, null otherwise
 */
export async function getDownloadURL(filePath: string): Promise<string | null> {
  try {
    const storageRef = ref(storage, filePath);
    const downloadURL = await getStorageDownloadURL(storageRef);
    console.log(`[STORAGE] Download URL retrieved for: ${filePath}`);
    return downloadURL;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[STORAGE] Get download URL error:", errorMsg);
    return null;
  }
}

/**
 * Replace an existing image in Firebase Storage
 * @param image - New image file
 * @param filePath - Path of the file to replace
 * @returns true if successful, false otherwise
 */
export async function replaceImage(
  image: File,
  filePath: string
): Promise<boolean> {
  try {
    // Validate file size
    if (image.size > MAX_FILE_SIZE) {
      console.error("[STORAGE] File size exceeds 5MB limit");
      return false;
    }

    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, image);
    console.log(`[STORAGE] Image replaced: ${filePath}`);
    return true;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[STORAGE] Replace image error:", errorMsg);
    return false;
  }
}

/**
 * Delete an image from Firebase Storage
 * @param filePath - Path of the file to delete
 * @returns true if successful, false otherwise
 */
export async function deleteImage(filePath: string): Promise<boolean> {
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
    console.log(`[STORAGE] Image deleted: ${filePath}`);
    return true;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[STORAGE] Delete image error:", errorMsg);
    return false;
  }
}
