// React dependencies
import { 
  createContext,
  useContext,
  useState
} from "react";

// Types
import { type User } from 'firebase/auth'
import { type PostType } from '../components/Post'
import { type updateUserProfileType } from '../backend/authentication'

// Hooks
import useFirebaseAuthentication from "../backend/authentication"

// ============================================
// Context Type Definition
// ============================================
export type AppContextType = {
  currentUser: User | null;
  IsLoadingCurrentUser: boolean
  firebaseSignOut: () => Promise<void>;
  updateUserProfile: (user: User, props: updateUserProfileType) => Promise<void>
  IsUpdateUserProfile: boolean;
  setIsUpdateUserProfile: (value: boolean) => void;
  selectedFolk: string | undefined;
  setselectedFolk: (value: string | undefined) => void;
  posts: PostType[];
  setPosts: (value: PostType[]) => void;
  postFilter: string | undefined;
  setPostFilter: (value: string | undefined) => void;
};

// ============================================
// Create Context
// ============================================
export const AppContext = createContext<AppContextType | undefined>(undefined);

// ============================================
// useAppState Hook - Manages all app state
// ============================================
export function useAppState(): AppContextType {
  // Firebase authentication state
  const { currentUser, IsLoadingCurrentUser, firebaseSignOut, updateUserProfile } =
    useFirebaseAuthentication()
  
  // App state
  const [IsUpdateUserProfile, setIsUpdateUserProfile] = useState<boolean>(false)
  const [selectedFolk, setselectedFolk] = useState<string | undefined>(undefined)
  const [posts, setPosts] = useState<PostType[]>([])
  const [postFilter, setPostFilter] = useState<string | undefined>(undefined)

  return {
    currentUser,
    IsLoadingCurrentUser,
    firebaseSignOut,
    updateUserProfile,
    selectedFolk,
    IsUpdateUserProfile,
    setIsUpdateUserProfile,
    setselectedFolk,
    posts,
    setPosts,
    postFilter,
    setPostFilter,
  }
}

// ============================================
// useAppContext Hook - Consumes context
// ============================================
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppContext.Provider");
  return context;
}
