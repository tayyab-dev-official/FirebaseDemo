import { products } from "../data/productsData"
import ProductCard from './ProductCard'
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
    <div id="product-container" className="w-full flex flex-wrap justify-center gap-6 mx-auto mt-20">
      {productsEl}
    </div>
  );
}
