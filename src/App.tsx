// Components
import AppContextProvider from "./components/AppContextProvider"
import Dashboard from "./components/Dashboard"

export default function App() {
  return (
    <>
      <main
        className="
          w-full 
          max-w[800px]          
          mx-auto
          mt-[2%] sm:mt-[1%]
          flex flex-col justify-center items-center gap-4
        "
      >
        <AppContextProvider>          
              <Dashboard />
        </AppContextProvider>
      </main>
    </>
  )
}
