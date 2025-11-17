import { useState, useEffect, createContext } from "react";
import { onAuthStateChanged, type GoogleAuthProvider } from "firebase/auth";
import type { Auth, User } from "firebase/auth";

import { auth, provider } from "./firebase";
import LogIn from "./components/Login";
import Dashboard from "./components/Dashboard";

import logo from "../src/assets/favicon.png";

export type AppContextType = {
  auth: Auth;
  user: User | null;
  setUser: (value: User | null) => void;
  provider: GoogleAuthProvider;
  updateProfile: boolean;
  setUpdateProfile: (value: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [updateProfile, setUpdateProfile] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) await firebaseUser.reload()
    });
    return () => unsubscribe()
  }, [])

  return (
    <>
      <main
        className="
          w-full           
          sm:mx-auto
          mt-[2%] sm:mt-[1%]
          flex flex-col justify-center items-center gap-4
        "
      >
        <div
          className="flex flex-col items-center"
        >
          <h1 className="text-5xl font-Calistoga">
            <span className="text-orange-400">Delfo</span>
          </h1>
          <div className="w-20 h-20">
            <img src={logo} className="w-full h-full" />
          </div>
        </div>

        <AppContext.Provider
          value={{
            auth,
            user,
            setUser,
            provider,
            updateProfile,
            setUpdateProfile,
          }}
        >
          {user ? <Dashboard /> : <LogIn />}
        </AppContext.Provider>
      </main>
    </>
  );
}

export { AppContext };
