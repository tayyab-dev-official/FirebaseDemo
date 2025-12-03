import { useState } from "react";
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { useAppContext } from "../hooks/useAppContext";

type ProductType = {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  imageUrl: string;
  unit: string;
  price: number;
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
  const { id, name, imageUrl, unit, price } = props.product;
  const isActive = props.selectedProduct === id;

  return (
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
      style={{ animationDelay: `${props.index * 0.1}s` }}
      className={`
        animate-move-up opacity-0 
        w-full sm:max-w-[300px] 
        h-full
        flex flex-col 
        rounded-3xl
        overflow-hidden
        transition-all duration-400 ease-out
        cursor-pointer
        backdrop-blur-xl
        border border-white/30
        shadow-2xl
        ${
          quantity > 0
            ? "scale-100 ring-2 ring-orange-400/60 shadow-2xl shadow-orange-500/20 bg-gradient-to-br from-white/95 via-orange-50/90 to-white/95"
            : "hover:scale-105 hover:shadow-2xl hover:shadow-orange-400/20 scale-95 bg-gradient-to-br from-white/90 via-orange-50/80 to-white/90 hover:from-white/95 hover:via-orange-100/90 hover:to-white/95"
        }
      `}
    >
      {/* Image Container with Overlay */}
      <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-orange-200/50 to-orange-100/30">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover object-center transition-all duration-500 hover:scale-115 hover:rotate-1 filter brightness-95 hover:brightness-100"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/85 backdrop-blur-md rounded-full text-xs font-bold text-orange-600 shadow-lg border border-white/50">
          {props.product.category}
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col gap-3">
        {/* Product Name */}
        <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent line-clamp-2 leading-tight">
          {name}
        </h3>

        {/* Quantity & Rating Row */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-100/60 to-orange-50/60 backdrop-blur-sm text-orange-700 rounded-full text-xs sm:text-sm font-semibold border border-orange-200/50">
            📦 {unit}
          </span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Fresh
          </span>
        </div>

        {/* Price Section */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              ₹{price}
            </span>
          </div>
          <span className="text-sm text-gray-600 font-medium">per {unit}</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Quantity Selector with Modern Design */}
        {quantity > 0 && (
          <div className="mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-100/70 to-orange-50/70 backdrop-blur-md rounded-2xl border border-orange-200/40 shadow-sm">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (quantity > 0) {
                  setQuantity((prev) => prev - 1);
                }
              }}
              className="p-2 hover:bg-white/60 rounded-lg transition-all duration-200 text-orange-600 hover:text-orange-700 hover:scale-110 active:scale-95"
              aria-label="Decrease quantity"
            >
              <FaMinus className="text-base" />
            </button>
            <div className="px-4 py-1 mx-1 text-xl font-bold text-gray-800 min-w-[2.5rem] text-center bg-white/60 rounded-lg backdrop-blur-sm">
              {quantity}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuantity((prev) => prev + 1);
              }}
              className="p-2 hover:bg-white/60 rounded-lg transition-all duration-200 text-orange-600 hover:text-orange-700 hover:scale-110 active:scale-95"
              aria-label="Increase quantity"
            >
              <FaPlus className="text-base" />
            </button>
          </div>
        )}

        {/* Action Button with Modern Design */}
        <div className="pt-3">
          {quantity === 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(1);
              }}
              className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:via-orange-700 hover:to-orange-600 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base shadow-lg hover:shadow-xl shadow-orange-500/30 hover:shadow-orange-600/40 border border-orange-400/30"
            >
              Select Item
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart({
                  productId: id,
                  name: name,
                  quantity: quantity,
                  price: price,
                  imageUrl: imageUrl,
                });
                setQuantity(0);
              }}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 hover:from-green-600 hover:via-emerald-600 hover:to-green-600 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg hover:shadow-xl shadow-green-500/30 hover:shadow-green-600/40 border border-green-400/30"
            >
              <FaShoppingCart className="text-lg" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>

        {/* Total Price Display with Modern Look */}
        {quantity > 0 && (
          <div className="mt-3 pt-3 border-t border-orange-200/40 text-center">
            <p className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-1">
              Total
            </p>
            <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              ₹{price * quantity}
            </p>
          </div>
        )}
      </div>

      {/* Subtle Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/0 via-orange-500/0 to-orange-400/0 pointer-events-none group-hover:from-white/10 group-hover:via-orange-500/5 group-hover:to-orange-400/10 transition-all duration-500" />
    </article>
  );
}
