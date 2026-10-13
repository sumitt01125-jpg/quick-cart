import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { removeFromWishlist, getWishlist } from "../../services/wishlist.service";
import { formatPrice } from "../../utils/formatPrice";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getWishlist();
        setItems(data.wishlist || []);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
        setError(error.message || "Unable to load your wishlist.");
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);
      setError("");
      await removeFromWishlist(productId);
      setItems((previous) =>
        previous.filter((item) => item.product?.id !== productId)
      );
    } catch (error) {
      console.error("Failed to remove wishlist item:", error);
      setError(error.message || "Unable to remove this item.");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8f5]">
        <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <div className="animate-pulse">
            <div className="h-3 w-32 rounded bg-emerald-100" />
            <div className="mt-3 h-8 w-48 rounded-lg bg-slate-200" />
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="aspect-[4/3] animate-pulse bg-slate-100" />
                  <div className="space-y-3 p-3">
                    <div className="h-3 w-3/4 rounded bg-slate-200" />
                    <div className="h-3 w-1/2 rounded bg-slate-100" />
                    <div className="h-8 rounded-lg bg-emerald-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8f5]">
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-9">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-700">
              Saved for later
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              My Wishlist
            </h1>
            <p className="mt-2 max-w-xl text-sm font-normal leading-6 text-slate-500">
              Keep your favorite products close and shop them anytime.
            </p>
          </div>

          {items.length > 0 && (
            <span className="w-fit rounded-full border border-emerald-100 bg-white px-3.5 py-2 text-xs font-medium text-emerald-700">
              {items.length} {items.length === 1 ? "saved item" : "saved items"}
            </span>
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-normal text-red-600">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && items.length === 0 && (
          <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white px-6 py-12 text-center shadow-sm sm:py-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-3xl text-rose-500">
              ♡
            </div>
            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              Your wishlist is empty
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm font-normal leading-6 text-slate-500">
              Save products you love and come back to them whenever you're
              ready.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Explore Products
            </Link>
          </div>
        )}

        {/* Wishlist products */}
        {!error && items.length > 0 && (
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {items.map((item) => {
              const product = item.product;

              if (!product) {
                return null;
              }

              return (
                <article
                  key={item.id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_10px_24px_rgba(15,23,42,0.07)]"
                >
                  {/* Product visual */}
                  <Link to={`/products/${product.id}`} className="block">
                    <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#f7f9f6] p-3">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-4xl transition-transform duration-300 group-hover:scale-105">
                          🛍️
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex flex-1 flex-col p-3">
                    <Link to={`/products/${product.id}`} className="block">
                      <h2 className="truncate text-[13px] font-medium text-slate-800 transition group-hover:text-emerald-700 sm:text-sm">
                        {product.name}
                      </h2>
                      <p className="mt-1.5 line-clamp-2 min-h-8 text-[11px] font-normal leading-4 text-slate-500 sm:text-xs">
                        {product.description || "Everyday essentials, picked for you."}
                      </p>
                      <p className="mt-3 text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
                        {formatPrice(product.price)}
                      </p>
                    </Link>

                    <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-3">
                      <Link
                        to={`/products/${product.id}`}
                        className="flex min-h-9 items-center justify-center rounded-lg bg-emerald-600 px-2 py-2 text-center text-[11px] font-medium text-white transition hover:bg-emerald-700 sm:text-xs"
                      >
                        View Product
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemove(product.id)}
                        disabled={removingId === product.id}
                        className="flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-slate-200 px-2 text-sm font-medium text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={`Remove ${product.name} from wishlist`}
                      >
                        {removingId === product.id ? "…" : "♡"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
