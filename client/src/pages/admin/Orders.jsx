import { useEffect, useState } from "react";
import AdminOrderCard from "../../components/admin/AdminOrderCard";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../services/admin.service";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllOrders();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
      setError(error.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      setError("");
      setSuccess("");

      const data = await updateOrderStatus(orderId, status);

      setOrders((previous) =>
        previous.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: data.order?.status || status,
              }
            : order
        )
      );

      setSuccess(`Order #${orderId} status updated successfully.`);
    } catch (error) {
      console.error("Failed to update order status:", error);
      setError(error.message || "Unable to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f5]">
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-5 sm:py-9 lg:px-8">
        {/* Header */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
            Admin Panel
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Orders
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Monitor customer orders and update their delivery status.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* Orders */}
        <section className="mt-7">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-44 animate-pulse rounded-2xl border border-slate-100 bg-white"
                />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                📦
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No orders yet
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <AdminOrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={handleStatusUpdate}
                  updating={updatingId === order.id}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Orders;
