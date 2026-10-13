import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import {
  getProductById,
  getProductInventory,
} from "../../services/product.service";
import { formatPrice } from "../../utils/formatPrice";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const {
    addItem: addWishlistItem,
    removeItem: removeWishlistItem,
    isWishlisted,
  } = useWishlist();

  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProductById(id);
      const loadedProduct = data.product || data;

      if (!loadedProduct) {
        throw new Error("Product not found.");
      }

      setProduct(loadedProduct);

      try {
        const inventoryData = await getProductInventory(id);
        setInventory(inventoryData.inventory || inventoryData);
      } catch {
        setInventory(null);
      }
    } catch (error) {
      console.error("Product details loading failed:", error);
      setError(error.message || "Unable to load product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setActionLoading(true);
      setError("");
      await addItem(product.id, 1);
      navigate("/cart");
    } catch (error) {
      console.error("Add to cart failed:", error);
      setError(error.message || "Unable to add product to cart.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setActionLoading(true);
      setError("");
      await addItem(product.id, 1);
      navigate("/checkout");
    } catch (error) {
      console.error("Buy now failed:", error);
      setError(error.message || "Unable to proceed to checkout.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleWishlist = async () => {
    try {
      setActionLoading(true);
      setError("");
      if (isWishlisted(product.id)) {
        await removeWishlistItem(product.id);
      } else {
        await addWishlistItem(product.id);
      }
    } catch (error) {
      console.error("Wishlist action failed:", error);
      setError(error.message || "Unable to update wishlist.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
          🛍️
        </div>
        <h1 className="mt-5 text-xl font-semibold text-slate-900">
          Product not found
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          This product may have been removed or is no longer available.
        </p>
        <Link
          to="/products"
          className="mt-5 inline-flex rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-600"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const outOfStock = inventory && inventory.quantity <= 0;

  return (
    <div className="min-h-screen bg-[#f7f8f5] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
        >
          <span aria-hidden="true">←</span> Back to Products
        </Link>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        <div className="mt-6 grid overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm md:grid-cols-2">
          <div className="relative flex items-center justify-center bg-slate-50 p-5 sm:p-8 md:p-10">
            <div className="absolute left-5 top-5 rounded-full border border-white bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              QuickCart pick
            </div>

            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="aspect-square max-h-[520px] w-full rounded-2xl object-contain"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-emerald-50 text-7xl">
                🛍️
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
            {product.category?.name && (
              <span className="w-fit rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {product.category.name}
              </span>
            )}

            <h1 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <p className="text-2xl font-semibold tracking-tight text-emerald-700 sm:text-3xl">
                {formatPrice(product.price)}
              </p>
              <span className="text-xs text-slate-400">Inclusive of all taxes</span>
            </div>

            <div className="my-6 h-px bg-slate-100" />

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                Product details
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                {product.description || "A great pick for your everyday needs."}
              </p>
            </div>

            {inventory && (
              <div className="mt-5 flex items-center gap-2 text-sm">
                <span
                  className={`h-2 w-2 rounded-full ${
                    inventory.quantity > 0 ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                <span
                  className={
                    inventory.quantity > 0
                      ? "text-emerald-700"
                      : "text-red-600"
                  }
                >
                  {inventory.quantity > 0
                    ? `${inventory.quantity} available`
                    : "Out of stock"}
                </span>
              </div>
            )}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={actionLoading || outOfStock}
                className="rounded-xl border border-emerald-200 bg-white px-5 py-3 text-sm font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Add to Cart"}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={actionLoading || outOfStock}
                className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white shadow-sm shadow-emerald-500/15 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Buy Now"}
              </button>

              <button
                type="button"
                onClick={handleWishlist}
                disabled={actionLoading}
                className={`rounded-xl border px-5 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2 ${
                  wishlisted
                    ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {wishlisted ? "♥ Added to Wishlist" : "♡ Add to Wishlist"}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
              <div className="text-center">
                <span className="text-lg">🚚</span>
                <p className="mt-1 text-xs text-slate-500">Quick delivery</p>
              </div>
              <div className="text-center">
                <span className="text-lg">✓</span>
                <p className="mt-1 text-xs text-slate-500">Quality picks</p>
              </div>
              <div className="text-center">
                <span className="text-lg">↻</span>
                <p className="mt-1 text-xs text-slate-500">Easy ordering</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
