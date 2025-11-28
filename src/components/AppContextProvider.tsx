import { useAppState } from "../hooks/useAppContext"
import { type AppContextType, AppContext } from "../hooks/useAppContext"
import type { ReactNode } from "react"

type AppContextProviderType = {
  children: ReactNode
}

export default function AppContextProvider({ children }: AppContextProviderType) {
  const context: AppContextType = useAppState()
  if (!context) {
    throw new Error("Child component must be used within an AppContext.Provider")
  }

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}
