import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import OrderStatus from "../../components/user/OrderStatus";
import {
  cancelOrder,
  getOrderById,
  reorder,
} from "../../services/order.service";
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [orderData, setOrderData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [orderPlaced, setOrderPlaced] = useState(
    Boolean(location.state?.orderPlaced)
  );

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrderById(id);

        setOrderData(data);
      } catch (error) {
        console.error("Failed to load order:", error);

        setError(
          error.message || "Unable to load this order."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  useEffect(() => {
    if (!location.state?.orderPlaced) {
      return;
    }

    window.history.replaceState({}, document.title);

    const timer = setTimeout(() => {
      setOrderPlaced(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [location.state]);

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const data = await cancelOrder(id);

      setOrderData((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          order: data.order || {
            ...previous.order,
            status: "CANCELLED",
          },
        };
      });

      setSuccess("Order cancelled successfully.");
    } catch (error) {
      console.error("Failed to cancel order:", error);

      setError(
        error.message || "Unable to cancel this order."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReorder = async () => {
    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const data = await reorder(id);

      if (data.addedItems?.length > 0) {
        navigate("/cart");
        return;
      }

      setSuccess(
        "No items could be added to your cart."
      );
    } catch (error) {
      console.error("Failed to reorder:", error);

      setError(
        error.message || "Unable to reorder this order."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8f5]">
        <main className="mx-auto max-w-5xl px-4 py-7 sm:px-5 lg:px-8 lg:py-9">
          <div className="animate-pulse">
            <div className="h-9 w-48 rounded-lg bg-slate-200" />

            <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                <div className="h-48 rounded-3xl bg-slate-200" />
                <div className="h-72 rounded-3xl bg-slate-200" />
              </div>

              <div className="h-80 rounded-3xl bg-slate-200" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !orderData) {
    return (
      <div className="min-h-screen bg-[#f7f8f5]">
        <main className="mx-auto flex max-w-5xl justify-center px-5 py-16 lg:px-8">
          <div className="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-7 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-500">
              !
            </div>

            <h1 className="mt-5 text-xl font-semibold text-slate-900">
              Order unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error}
            </p>

            <Link
              to="/orders"
              className="mt-6 inline-flex rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-600"
            >
              Back to Orders
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const order = orderData?.order;
  const items = orderData?.items || [];

  if (!order) {
    return null;
  }

  const cancellableStatuses = [
    "PLACED",
    "CONFIRMED",
    "PACKING",
  ];

  const canCancel = cancellableStatuses.includes(order.status);

  const canReorder = order.status === "DELIVERED";

  return (
    <div className="min-h-screen bg-[#f7f8f5]">
      <main className="mx-auto max-w-5xl px-4 py-7 sm:px-5 lg:px-8 lg:py-9">
        {/* Header */}
        <div>
          <Link
            to="/orders"
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            ← Back to Orders
          </Link>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-700">
                Order Details
              </p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Order #{order.id}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <OrderStatus status={order.status} />
          </div>
        </div>

        {/* Success */}
        {orderPlaced && (
          <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/80 p-4">
            <p className="text-sm font-medium text-emerald-700">
              🎉 Order placed successfully!
            </p>

            <p className="mt-1 text-xs text-emerald-600">
              Your order has been received and is now being processed.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/80 p-4 text-sm font-medium text-emerald-700">
            {success}
          </div>
        )}

        <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_320px]">
          {/* Main */}
          <div className="space-y-5">
            {/* Items */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Items
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {items.length}{" "}
                    {items.length === 1 ? "product" : "products"}
                  </p>
                </div>
              </div>

              <div className="mt-5 divide-y divide-slate-100">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {item.productName || item.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-slate-900">
                      {formatPrice(
                        item.itemTotal ||
                          Number(item.price) * Number(item.quantity)
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Delivery */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Delivery Address
              </h2>

              <div className="mt-5 rounded-2xl bg-[#f7f8f5] p-5">
                <p className="font-medium text-slate-800">
                  {order.addressLabel}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {order.fullAddress}
                </p>

                <p className="text-sm text-slate-500">
                  {order.city}, {order.state} - {order.pincode}
                </p>
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Payment
              </h2>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#f7f8f5] p-5">
                <div>
                  <p className="font-medium text-slate-800">
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : order.paymentMethod}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Payment status:{" "}
                    {order.paymentStatus || "PENDING"}
                  </p>
                </div>

                <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
                  {order.paymentStatus || "PENDING"}
                </span>
              </div>
            </section>
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-slate-900">
              Order Summary
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>

                <span className="font-medium text-slate-700">
                  {formatPrice(order.subtotal)}
                </span>
              </div>

              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Discount</span>

                  <span className="font-medium text-emerald-700">
                    -{formatPrice(order.discount)}
                  </span>
                </div>
              )}

              {order.couponCode && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Coupon</span>

                  <span className="font-medium text-slate-700">
                    {order.couponCode}
                  </span>
                </div>
              )}

              <div className="h-px bg-slate-200" />

              <div className="flex items-end justify-between">
                <span className="font-medium text-slate-800">
                  Total
                </span>

                <span className="text-xl font-semibold text-slate-900">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            <div className="mt-7 space-y-3">
              {canReorder && (
                <button
                  type="button"
                  onClick={handleReorder}
                  disabled={actionLoading}
                  className="w-full rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionLoading
                    ? "Processing..."
                    : "Reorder Items"}
                </button>
              )}

              {canCancel && (
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={actionLoading}
                  className="w-full rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionLoading
                    ? "Processing..."
                    : "Cancel Order"}
                </button>
              )}

              <Link
                to="/products"
                className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-[#f7f8f5]"
              >
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;