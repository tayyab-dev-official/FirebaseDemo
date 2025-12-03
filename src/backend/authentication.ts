// ------------------------------------------------------
// React & Context Setup
// ------------------------------------------------------
import { useState, useEffect, useCallback, useMemo } from "react";

// ------------------------------------------------------
// Firebase Authentication Setup
// ------------------------------------------------------
import { app, db } from "./setup";
const firebaseAuth = getAuth(app);

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

// Firestore
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// ------------------------------------------------------
// Context Types
// ------------------------------------------------------
export type updateUserProfileType = {
  displayName?: string;
  photoURL?: string;
};

export type AuthContextType = {
  currentUser: User | null;
  IsLoadingCurrentUser: boolean;
  firebaseSignUp: (
    email: string,
    password: string,
    userName?: string
  ) => Promise<void>;
  firebaseSignIn: (email: string, password: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  firebaseSignOut: () => Promise<void>;
  updateUserProfile: (
    user: User,
    props: updateUserProfileType
  ) => Promise<void>;
};

// ------------------------------------------------------
// Custom Hook for Firebase Authentication
// ------------------------------------------------------
export default function useFirebaseAuthentication(): AuthContextType {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [IsLoadingCurrentUser, setIsLoadingCurrentUser] =
    useState<boolean>(true);

  // --------------------------------------
  // Helper: update profile
  // --------------------------------------
  const updateUserProfile = useCallback(
    async (user: User, props: updateUserProfileType) => {
      try {
        await updateProfile(user, { ...props });
        // Reload user to get updated profile data
        await user.reload();
        // Update context with fresh user data
        setCurrentUser({ ...user });
        console.log("[AUTH] Profile updated successfully");
      } catch (error) {
        console.error("[AUTH] Update profile error:", error);
      }
    },
    []
  );

  // --------------------------------------
  // Helper: Create user role document in Firestore
  // --------------------------------------
  const createUserRoleDocument = useCallback(
    async (user: User) => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          // Create new user document with default "user" role
          await setDoc(userDocRef, {
            email: user.email,
            displayName: user.displayName || "User",
            photoURL: user.photoURL || "",
            role: "user", // Default role
            createdAt: serverTimestamp(),
            status: "active",
          });
          console.log("[AUTH] User role document created");
        }
      } catch (error) {
        console.error("[AUTH] Error creating user role document:", error);
      }
    },
    []
  );

  // --------------------------------------
  // Sign Up
  // --------------------------------------
  const firebaseSignUp = useCallback(
    async (email: string, password: string, userName?: string) => {
      setIsLoadingCurrentUser(true);
      try {
        const userCred = await createUserWithEmailAndPassword(
          firebaseAuth,
          email,
          password
        );

        const user = userCred.user;
        if (userName) {
          await updateUserProfile(user, { displayName: userName });
          await user.reload();
          console.log(`[AUTH] ${user.displayName} Signup successful.`);
        } else {
          console.log("[AUTH] Signup successful.");
        }
        
        // Create user role document
        await createUserRoleDocument(user);
      } catch (error) {
        console.error("[AUTH] Signup error:", error);
      } finally {
        setIsLoadingCurrentUser(false);
      }
    },
    [updateUserProfile, createUserRoleDocument]
  );

  // --------------------------------------
  // Sign In
  // --------------------------------------
  const firebaseSignIn = useCallback(
    async (email: string, password: string) => {
      setIsLoadingCurrentUser(true);
      try {
        const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const user = result.user;
        
        // Create or verify user role document
        await createUserRoleDocument(user);
        
        console.log("[AUTH] Sign-in successful.");
      } catch (error) {
        console.error("[AUTH] Sign-in error:", error);
      } finally {
        setIsLoadingCurrentUser(false);
      }
    },
    [createUserRoleDocument]
  );

  // --------------------------------------
  // Google Sign In
  // --------------------------------------
  const googleSignIn = useCallback(async () => {
    setIsLoadingCurrentUser(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
      
      // Create or verify user role document
      await createUserRoleDocument(user);
      
      console.log("[AUTH] Google sign-in successful.");
    } catch (error) {
      console.error("[AUTH] Google sign-in error:", error);
    } finally {
      setIsLoadingCurrentUser(false);
    }
  }, [createUserRoleDocument]);

  // --------------------------------------
  // Sign Out
  // --------------------------------------
  const firebaseSignOut = useCallback(async () => {
    setIsLoadingCurrentUser(true);
    try {
      await signOut(firebaseAuth);
      setCurrentUser(null);
      console.log("[AUTH] Signed out successfully.");
    } catch (error) {
      console.error("[AUTH] Sign-out error:", error);
    } finally {
      setIsLoadingCurrentUser(false);
    }
  }, []);

  // --------------------------------------
  // Auth State Listener
  // --------------------------------------
  const authStateChangedListener = useCallback(async (user: User | null) => {
    if (!user) {
      console.log("[AUTH] No user — clearing context.");
      setCurrentUser(null);
      setIsLoadingCurrentUser(false);
      return;
    }
    console.log("[AUTH] User active:", user.email);
    await user.reload();
    if (!user.displayName) {
      await new Promise((resolve) =>
        setTimeout(() => {
          setIsLoadingCurrentUser(true);
          console.log("[AUTH] reloading user details...");
          resolve(null);
        }, 1000)
      );
    }

    setCurrentUser(user);
    setIsLoadingCurrentUser(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      authStateChangedListener
    );
    return () => {
      unsubscribe();
      console.log("[AUTH] Stopped listening to auth state.");
    };
  }, [authStateChangedListener]);

  // --------------------------------------
  // Memoized Return Value (Prevents rerenders)
  // --------------------------------------
  const value: AuthContextType = useMemo(
    () => ({
      currentUser,
      IsLoadingCurrentUser,
      firebaseSignUp,
      firebaseSignIn,
      googleSignIn,
      firebaseSignOut,
      updateUserProfile,
    }),
    [
      currentUser,
      IsLoadingCurrentUser,
      firebaseSignUp,
      firebaseSignIn,
      googleSignIn,
      firebaseSignOut,
      updateUserProfile,
    ]
  );

  return value;
}
