import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as firebaseUpdateProfile,
  type Auth,
  type User,
  type GoogleAuthProvider,
} from "firebase/auth";

export interface AuthErrorInfo {
  code: string;
  message: string;
}

/**
 * Custom hook for Firebase Authentication operations
 * Handles sign up, sign in, Google authentication, and profile updates
 */
export function useFirebaseAuthentication(auth: Auth, provider: GoogleAuthProvider) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sign up with email and password
   * @param email - User email
   * @param password - User password
   * @param displayName - User display name
   * @returns User object if successful, null otherwise
   */
  async function signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<User | null> {
    try {
      setIsLoading(true);
      setError(null);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await firebaseUpdateProfile(user, {
        displayName: displayName,
      });

      await user.reload();
      return user;
    } catch (err) {
      const authError = err as AuthErrorInfo;
      setError(authError.message);
      console.error("Sign up error:", authError.code, authError.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Sign in with email and password
   * @param email - User email
   * @param password - User password
   * @returns User object if successful, null otherwise
   */
  async function signIn(email: string, password: string): Promise<User | null> {
    try {
      setIsLoading(true);
      setError(null);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (err) {
      const authError = err as AuthErrorInfo;
      setError(authError.message);
      console.error("Sign in error:", authError.code, authError.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Sign in with Google using popup
   * @returns User object if successful, null otherwise
   */
  async function signInWithGoogle(): Promise<User | null> {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err) {
      const authError = err as AuthErrorInfo;
      setError(authError.message);
      console.error("Google sign in error:", authError.code, authError.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Update user profile with display name and/or photo URL
   * @param user - The current Firebase user
   * @param displayName - New display name (optional)
   * @param photoURL - New photo URL (optional)
   * @returns Updated user object if successful, null otherwise
   */
  async function updateUserProfile(
    user: User | null,
    displayName?: string,
    photoURL?: string
  ): Promise<User | null> {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        setError("User not found");
        return null;
      }

      const updates: { displayName?: string; photoURL?: string } = {};
      if (displayName) updates.displayName = displayName;
      if (photoURL) updates.photoURL = photoURL;

      await firebaseUpdateProfile(user, updates);
      await user.reload();
      return user;
    } catch (err) {
      const authError = err as AuthErrorInfo;
      setError(authError.message);
      console.error("Update profile error:", authError.code, authError.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Sign out the current user
   * @returns true if successful, false otherwise
   */
  async function logOut(): Promise<boolean> {
    try {
      setIsLoading(true);
      setError(null);

      await signOut(auth);
      return true;
    } catch (err) {
      const authError = err as AuthErrorInfo;
      setError(authError.message);
      console.error("Logout error:", authError.code, authError.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    signUp,
    signIn,
    signInWithGoogle,
    updateUserProfile,
    logOut,
    isLoading,
    error,
  };
}

