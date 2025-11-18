import { useState, useContext } from "react";
import { AppContext, type Post } from "../App";
import type { User } from "firebase/auth";

/**
 * AppState interface represents all application state
 */
export interface AppState {
  // User state
  user: User | null;
  setUser: (value: User | null) => void;
  updateProfile: boolean;
  setUpdateProfile: (value: boolean) => void;
  // App state
  moodState: string | undefined;
  setMoodState: (value: string | undefined) => void;
  posts: Post[];
  setPosts: (value: Post[]) => void;
  postFilter: string | undefined;
  setPostFilter: (value: string | undefined) => void;
}

/**
 * useAppStateProvider - This hook initializes and manages all app state.
 * This is the ONLY place where app state should be created.
 * Used only in the App component to initialize state.
 */
export function useAppStateProvider(): AppState {
  // User state
  const [user, setUser] = useState<User | null>(null);
  const [updateProfile, setUpdateProfile] = useState<boolean>(false);
  // App state
  const [moodState, setMoodState] = useState<string | undefined>(undefined);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postFilter, setPostFilter] = useState<string | undefined>(undefined);

  return {
    user,
    setUser,
    updateProfile,
    setUpdateProfile,
    moodState,
    setMoodState,
    posts,
    setPosts,
    postFilter,
    setPostFilter,
  };
}

/**
 * useAppState - This hook provides app state from context.
 * Used by all child components to access the app state.
 * This is the single source of truth - all components use this hook.
 */
export function useAppState(): AppState {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppContext.Provider");
  }

  return {
    user: context.user,
    setUser: context.setUser,
    updateProfile: context.updateProfile,
    setUpdateProfile: context.setUpdateProfile,
    moodState: context.moodState,
    setMoodState: context.setMoodState,
    posts: context.posts,
    setPosts: context.setPosts,
    postFilter: context.postFilter,
    setPostFilter: context.setPostFilter,
  };
}
