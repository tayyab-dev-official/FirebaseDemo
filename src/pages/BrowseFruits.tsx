import { useState } from "react";
import Header from "../components/Header";
import Product from "../components/Product";
import { useAppContext } from "../hooks/useAppContext";

interface BrowsePageProps {
  photoURL?: string;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
}

export default function BrowseFruits({
  photoURL = "",
  onProfileClick = () => {},
  onLogoutClick = () => {},
}: BrowsePageProps) {
  const { currentUser } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(
    undefined
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex flex-col">
      {currentUser && (
        <Header
          photoURL={photoURL}
          onProfileClick={onProfileClick}
          onLogoutClick={onLogoutClick}
        />
      )}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Browse Fresh Fruits
          </h1>
          <p className="text-gray-600">
            Explore our selection of fresh, locally-sourced fruits
          </p>
        </div>
        <Product
          selectedProduct={selectedProduct}
          OnselectedProductChange={setSelectedProduct}
        />
      </main>
    </div>
  );
}
