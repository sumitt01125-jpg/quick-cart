import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { formatPrice } from "../../utils/formatPrice";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const {
    addItem: addWishlistItem,
    removeItem: removeWishlistItem,
    isWishlisted,
  } = useWishlist();

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      await addItem(product.id, 1);
      navigate("/cart");
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  const handleBuyNow = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      await addItem(product.id, 1);
      navigate("/checkout");
    } catch (error) {
      console.error("Buy now failed:", error);
    }
  };

  const handleWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      if (wishlisted) {
        await removeWishlistItem(product.id);
      } else {
        await addWishlistItem(product.id);
      }
    } catch (error) {
      console.error("Wishlist action failed:", error);
    }
  };

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_10px_24px_rgba(15,23,42,0.07)]">
      {/* Product Image */}
      <div className="relative">
        <Link
          to={`/products/${product.id}`}
          aria-label={`View ${product.name}`}
          className="block"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-[#f7f9f6] p-2 sm:p-2.5">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                  🛒
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Category */}
        {product.category?.name && (
          <span className="absolute left-2 top-2 max-w-[70%] truncate rounded-md border border-white/80 bg-white/95 px-2 py-1 text-[9px] font-medium tracking-wide text-slate-600 shadow-sm">
            {product.category.name}
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={
            wishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          aria-pressed={wishlisted}
          className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white/95 shadow-sm transition-all duration-200 hover:scale-105 ${
            wishlisted
              ? "text-rose-500"
              : "text-slate-400 hover:text-rose-500"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill={wishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-[17px] w-[17px]"
            aria-hidden="true"
          >
            <path
              d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="line-clamp-2 min-h-8 text-[12px] font-medium leading-[1.4] text-slate-800 transition-colors group-hover:text-emerald-700 sm:text-[13px]">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 line-clamp-2 min-h-7 text-[10px] font-normal leading-4 text-slate-500 sm:text-[11px]">
          {product.description || "Everyday essentials, picked for you."}
        </p>

        {/* Price */}
        <div className="mt-auto pt-2">
          <p className="text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
            {formatPrice(product.price)}
          </p>

          <p className="mt-0.5 text-[9px] font-normal text-slate-400">
            Inclusive of applicable taxes
          </p>
        </div>

        {/* Actions */}
        <div className="mt-2.5 grid grid-cols-1 gap-1.5">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex min-h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-600 bg-white px-2 py-1.5 text-[11px] font-medium text-emerald-700 transition-colors duration-200 hover:bg-emerald-50 active:scale-[0.98] sm:text-xs"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path
                d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            Add to Cart
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="flex min-h-8 w-full items-center justify-center rounded-lg bg-emerald-600 px-2 py-1.5 text-[11px] font-medium text-white transition-colors duration-200 hover:bg-emerald-700 active:scale-[0.98] sm:text-xs"
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;