import { useEffect, createContext } from "react";
import { onAuthStateChanged, type GoogleAuthProvider } from "firebase/auth";
import type { Auth, User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

import { auth, provider } from "./firebase";
import LogIn from "./components/Login";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Profile from "./components/Profile";
import { useAppStateProvider } from "./hooks/useAppState";
import { useFirebaseAuthentication } from "./hooks/useFirebaseAuthentication";

export type Post = {
  userName: string;
  userPhotoURL: string;
  id: string;
  createdAt: Timestamp;
  mood: string | undefined;
  uid: string;
  body: string;
};

export type AppContextType = {
  auth: Auth;
  provider: GoogleAuthProvider;
  user: User | null;
  setUser: (value: User | null) => void;
  updateProfile: boolean;
  setUpdateProfile: (value: boolean) => void;
  moodState: string | undefined;
  setMoodState: (value: string | undefined) => void;
  posts: Post[];
  setPosts: (value: Post[]) => void;
  postFilter: string | undefined;
  setPostFilter: (value: string | undefined) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export default function App() {
  // All state - initialized from useAppStateProvider hook (SINGLE SOURCE OF TRUTH)
  const appState = useAppStateProvider();
  const { logOut } = useFirebaseAuthentication(auth, provider);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      appState.setUser(firebaseUser);
      if (firebaseUser) await firebaseUser.reload();
    });
    return () => unsubscribe();
  }, [appState]);

  const contextValue: AppContextType = {
    // Auth constants
    auth,
    provider,
    // All state from hook
    ...appState,
  };

  return (
    <>
      <main
        className="
          w-full           
          mx-auto
          mt-[2%] sm:mt-[1%]
          flex flex-col justify-center items-center gap-4
          ring-2
        "
      >
        <AppContext.Provider value={contextValue}>
          {appState.user && (
            <Header
              photoURL={appState.user.photoURL || ""}
              onProfileClick={() => appState.setUpdateProfile(true)}
              onLogoutClick={async () => {
                const success = await logOut();
                if (success) {
                  appState.setUser(null);
                }
              }}
            />
          )}
          {appState.user ? (
            appState.updateProfile ? (
              <Profile />
            ) : (
              <Dashboard />
            )
          ) : (
            <LogIn />
          )}
        </AppContext.Provider>
      </main>
    </>
  );
}

export { AppContext };
