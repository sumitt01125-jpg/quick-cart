import { Link, useNavigate } from "react-router-dom";

import CartItem from "../../components/user/CartItem";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatPrice";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, emptyCart } = useCart();

  const handleClearCart = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove all items from your cart?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await emptyCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8f5]">
        <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <div className="animate-pulse">
            <div className="h-3 w-32 rounded bg-emerald-100" />
            <div className="mt-3 h-8 w-40 rounded-lg bg-slate-200" />
            <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_340px]">
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-28 rounded-2xl border border-slate-200 bg-white"
                  />
                ))}
              </div>
              <div className="h-72 rounded-2xl border border-slate-200 bg-white" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  const items = cart?.items || [];
  const total = Number(cart?.total || 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f8f5]">
        <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center justify-center px-5 py-12 lg:px-8">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
              🛒
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
              Your cart is empty
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm font-normal leading-6 text-slate-500">
              Looks like you haven't added anything yet. Explore our products
              and find something you like.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
            >
              Start Shopping
            </Link>
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
              Your Shopping Bag
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Your Cart
            </h1>
            <p className="mt-2 text-sm font-normal text-slate-500">
              {items.length} {items.length === 1 ? "item" : "items"} ready for
              checkout.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearCart}
            className="w-fit rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
          >
            Clear Cart
          </button>
        </div>

        {/* Content */}
        <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_340px] lg:items-start">
          {/* Cart items */}
          <section className="space-y-3">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            <Link
              to="/products"
              className="inline-flex items-center py-1 text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
            >
              ← Continue Shopping
            </Link>
          </section>

          {/* Summary */}
          <aside className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:sticky lg:top-24 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Order Summary
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-normal text-slate-500">Items</span>
                <span className="font-medium text-slate-800">
                  {items.reduce((count, item) => count + item.quantity, 0)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="font-normal text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-800">
                  {formatPrice(total)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-normal text-slate-500">Delivery</span>
                <span className="text-right text-xs font-medium text-emerald-700">
                  Calculated at checkout
                </span>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="flex items-end justify-between gap-3">
                <span className="text-sm font-medium text-slate-800">
                  Total
                </span>
                <span className="text-xl font-semibold tracking-tight text-slate-900">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
            >
              Proceed to Checkout
            </button>

            <div className="mt-4 rounded-xl bg-[#f7f8f5] p-3.5">
              <div className="flex gap-3">
                <span className="text-base">🔒</span>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Secure checkout
                  </p>
                  <p className="mt-1 text-xs font-normal leading-5 text-slate-500">
                    Your order is protected and payment is handled securely.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Cart;