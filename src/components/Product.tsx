import { products } from "../data/productsData"
interface ProductProps {
  selectedProduct: string | undefined;
  OnselectedProductChange: (productId: string | undefined) => void;
}

export default function Product({
  selectedProduct,
  OnselectedProductChange,
}: ProductProps) {
  const productsEl = products.map((product) => {
    const { id, name, imageUrl, description } = product;
    const isActive = selectedProduct === id;
    
    return (
      <button
        key={id}
        id={id}
        onClick={() => {
          if (isActive) {
            OnselectedProductChange(undefined);
          } else {
            OnselectedProductChange(id);
          }
        }}
        aria-pressed={isActive}
        className={`w-5/6 max-w-[350px] min-w-[300px] flex flex-col items-center gap-4 p-2 transition-all duration-1000 ease-in-out rounded-lg bg-orange-400 scale-95 ${
          isActive
            ? "scale-100 ring-4 ring-blue-400"
            : "hover:scale-98 hover:opacity-100"
        }`}
      >
        <div className="w-3/4 h-3/4">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-4 mb-4">
          <div className="font-bold text-4xl">{name}</div>
          <div className="text-4xl text-gray-600">
            {description.split(" - ")[1]}
          </div>
          <div className="text-green-600 font-bold text-4xl">
            {description.split(" - ")[2]}
          </div>
        </div>
      </button>
    );
  });

  return (
    <div id="product-container" className="w-full flex flex-wrap justify-center gap-2 mx-auto">
      {productsEl}
    </div>
  );
}
