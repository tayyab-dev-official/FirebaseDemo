// Components
import AppContextProvider from "./components/AppContextProvider";
import Dashboard from "./components/Dashboard";
import OrdersHistory from "./components/OrdersHistory";
import Footer from "./components/Footer";
import { useState } from "react";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "orders">(
    "dashboard"
  );

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
          {currentPage === "dashboard" ? (
            <Dashboard onOrdersHistoryClick={() => setCurrentPage("orders")} />
          ) : (
            <OrdersHistory onBackClick={() => setCurrentPage("dashboard")} />
          )}
        </AppContextProvider>
      </main>
      <Footer />
    </>
  );
}
