import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import OrderCard from "../../components/user/OrderCard";
import { getOrders } from "../../services/order.service";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getOrders();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Failed to load orders:", error);
        setError(error.message || "Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8f5]">
        <main className="mx-auto max-w-5xl px-5 py-8 lg:px-8 lg:py-9">
          <div className="animate-pulse">
            <div className="h-3 w-32 rounded bg-emerald-100" />
            <div className="mt-3 h-8 w-40 rounded-lg bg-slate-200" />
            <div className="mt-2 h-4 w-64 max-w-full rounded bg-slate-200" />
            <div className="mt-7 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 rounded-2xl border border-slate-200 bg-white"
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8f5]">
      <main className="mx-auto max-w-5xl px-5 py-8 lg:px-8 lg:py-9">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-700">
              Shopping history
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              My Orders
            </h1>
            <p className="mt-2 text-sm font-normal leading-6 text-slate-500">
              Track and manage your previous QuickCart orders.
            </p>
          </div>

          {orders.length > 0 && (
            <span className="w-fit rounded-full border border-emerald-100 bg-white px-3.5 py-2 text-xs font-medium text-emerald-700">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-normal text-red-600">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && orders.length === 0 && (
          <div className="mt-7 rounded-2xl border border-slate-200/80 bg-white px-6 py-12 text-center shadow-sm sm:py-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
              📦
            </div>
            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              No orders yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm font-normal leading-6 text-slate-500">
              Once you place an order, you'll be able to track it right here.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Orders */}
        {!error && orders.length > 0 && (
          <div className="mt-7 space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
