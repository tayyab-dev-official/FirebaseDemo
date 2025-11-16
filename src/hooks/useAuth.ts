import { useContext } from "react";
import { AppContext } from "../App";

export function useAuth() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAuth must be used within an AppContext.Provider");
  return context;
}
