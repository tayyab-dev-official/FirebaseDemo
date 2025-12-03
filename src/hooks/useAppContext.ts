// React dependencies
import { createContext, useContext, useState, useEffect } from "react";

// Types
import { type User } from "firebase/auth";
import { type PostType } from "../components/Post";
import { type updateUserProfileType } from "../backend/authentication";

// Firestore
import { doc, getDoc } from "firebase/firestore";
import { db } from "../backend/setup";

// Hooks
import useFirebaseAuthentication from "../backend/authentication";

// ============================================
// User Role Type
// ============================================
export type UserRole = "user" | "admin" | "delivery";

// ============================================
// Cart Item Type
// ============================================
export type CartItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
};

// ============================================
// Context Type Definition
// ============================================
export type AppContextType = {
  currentUser: User | null;
  IsLoadingCurrentUser: boolean;
  firebaseSignOut: () => Promise<void>;
  updateUserProfile: (
    user: User,
    props: updateUserProfileType
  ) => Promise<void>;
  IsUpdateUserProfile: boolean;
  setIsUpdateUserProfile: (value: boolean) => void;
  selectedProduct: string | undefined;
  setselectedProduct: (value: string | undefined) => void;
  posts: PostType[];
  setPosts: (value: PostType[]) => void;
  postFilter: string | undefined;
  setPostFilter: (value: string | undefined) => void;
  cartItems: CartItem[];
  setCartItems: (value: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  userRole: UserRole | null;
  isLoadingUserRole: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  canAccessDashboard: (dashboard: "user" | "admin" | "delivery") => boolean;
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
  const {
    currentUser,
    IsLoadingCurrentUser,
    firebaseSignOut,
    updateUserProfile,
  } = useFirebaseAuthentication();

  // App state
  const [IsUpdateUserProfile, setIsUpdateUserProfile] =
    useState<boolean>(false);
  const [selectedProduct, setselectedProduct] = useState<string | undefined>(
    undefined
  );
  const [posts, setPosts] = useState<PostType[]>([]);
  const [postFilter, setPostFilter] = useState<string | undefined>(undefined);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Role state
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoadingUserRole, setIsLoadingUserRole] = useState<boolean>(false);

  // Fetch user role from Firestore
  const fetchUserRole = async (uid: string) => {
    try {
      setIsLoadingUserRole(true);
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const role = userDocSnap.data().role as UserRole;
        setUserRole(role);
      } else {
        // Default to 'user' role if document doesn't exist
        setUserRole("user");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole("user"); // Default to user role on error
    } finally {
      setIsLoadingUserRole(false);
    }
  };

  // Fetch role whenever current user changes
  useEffect(() => {
    if (currentUser?.uid) {
      fetchUserRole(currentUser.uid);
    } else {
      setUserRole(null);
    }
  }, [currentUser?.uid]);

  // Helper function to check if user has a specific role
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!userRole) return false;
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    return userRole === role;
  };

  // Helper function to check if user can access a dashboard
  const canAccessDashboard = (
    dashboard: "user" | "admin" | "delivery"
  ): boolean => {
    if (!userRole) return false;
    return userRole === dashboard;
  };

  // Cart methods
  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.productId === item.productId
      );
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.productId === item.productId
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prevItems, item];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
  };

  const updateCartItem = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  return {
    currentUser,
    IsLoadingCurrentUser,
    firebaseSignOut,
    updateUserProfile,
    selectedProduct,
    IsUpdateUserProfile,
    setIsUpdateUserProfile,
    setselectedProduct,
    posts,
    setPosts,
    postFilter,
    setPostFilter,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    updateCartItem,
    userRole,
    isLoadingUserRole,
    hasRole,
    canAccessDashboard,
  };
}

// ============================================
// useAppContext Hook - Consumes context
// ============================================
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within an AppContext.Provider");
  return context;
}
