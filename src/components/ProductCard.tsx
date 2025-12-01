import { useState } from "react";
import { FaPlusSquare } from "react-icons/fa";
import { FaMinusSquare } from "react-icons/fa";
import { useAppContext } from "../hooks/useAppContext";

type ProductType = {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  imageUrl: string;
  description: string;
};
interface ProductCardProps {
  product: ProductType;
  index: number;
  selectedProduct: string | undefined;
  OnselectedProductChange: (productId: string | undefined) => void;
}

export default function ProductCard(props: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);
  const { addToCart } = useAppContext();
  const { id, name, imageUrl, description } = props.product;
  const isActive = props.selectedProduct === id;
  return (
    <>
      <article
        key={id}
        id={id}
        onClick={() => {
          if (isActive) {
            props.OnselectedProductChange(undefined);
          } else {
            props.OnselectedProductChange(id);
          }
        }}
        aria-pressed={isActive}
        style={{ animationDelay: `${props.index * 0.3}s` }}
        className={`
                        max-w-[250px] min-w-[150px] flex flex-col items-center gap-4 
                        transition-all duration-1000 ease-in-out rounded-lg bg-orange-300 
                        animate-move-up opacity-0 scale-95 shadow-md shadow-orange-400 mb-20
                        ${
                          quantity > 0
                            ? "scale-100 ring-8 ring-orange-800 mb-24"
                            : "hover:scale-98 hover:shadow-lg"
                        }
                        `}
      >
        <div className="w-[90%] h-[90%] scal-110 transform -translate-y-1/2 mx-auto rounded-3xl my-8 z-100 shadow-image">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full rounded-[inherit] object-cover object-center"
          />
        </div>
        <div className="w-full flex flex-col items-center gap-4 mb-4 transform -translate-y-1/2">
          <div className="font-bold text-4xl">{name}</div>
          <div className="text-4xl text-gray-600">
            {description.split(" - ")[1]}
          </div>
          <div className="text-green-600 font-bold text-4xl">
            {description.split(" - ")[2]}
          </div>
        </div>
        <div className="w-full flex justify-center gap-8 items-center transform -translate-y-12 font-bold text-4xl text-white">
          <button
            className="p-2 font-bold text-4xl text-white"
            onClick={() => {
              if (quantity > 0) {
                setQuantity((prev) => --prev);
              }
            }}
          >
            <FaMinusSquare className="fill-white" />
          </button>
          <span className="text-black">{quantity}</span>
          <button
            className="p-2 font-bold text-4xl text-white"
            onClick={() => setQuantity((prev) => ++prev)}
          >
            <FaPlusSquare className="fill-white " />
          </button>
        </div>
        <button
          onClick={() => {
            if (quantity > 0) {
              const price = parseInt(
                description.split(" - ")[2]?.replace("₹", "") || "0"
              );
              addToCart({
                productId: id,
                name: name,
                quantity: quantity,
                price: price,
                imageUrl: imageUrl,
              });
              setQuantity(0);
            }
          }}
          className="bg-orange-600 px-10 py-2 transform -translate-y-12 rounded-lg text-white font-bold hover:bg-orange-700 transition-colors disabled:opacity-50"
          disabled={quantity === 0}
        >
          Add to Cart
        </button>
      </article>
    </>
  );
}
