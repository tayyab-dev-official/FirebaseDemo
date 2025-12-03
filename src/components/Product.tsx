import { products } from "../data/productsData";
import ProductCard from "./ProductCard";
interface ProductProps {
  selectedProduct: string | undefined;
  OnselectedProductChange: (productId: string | undefined) => void;
}

export default function Product({
  selectedProduct,
  OnselectedProductChange,
}: ProductProps) {
  const productsEl = products.map((product, index) => {
    return (
      <ProductCard
        key={index}
        index={index}
        product={product}
        selectedProduct={selectedProduct}
        OnselectedProductChange={OnselectedProductChange}
      />
    );
  });

  return (
    <div
      id="product-container"
      className="w-full mx-auto mt-8 sm:mt-12 px-3 sm:px-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 auto-rows-max justify-items-center sm:justify-items-stretch">
        {productsEl}
      </div>
    </div>
  );
}
