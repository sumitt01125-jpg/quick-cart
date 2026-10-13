import OrderStatus from "../user/OrderStatus";
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";

const STATUS_OPTIONS = [
  "PLACED",
  "CONFIRMED",
  "PACKING",
  "READY_FOR_PICKUP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const AdminOrderCard = ({
  order,
  onStatusUpdate,
  updating = false,
}) => {
  const currentStatus = order.status;

  const getNextStatuses = () => {
    if (currentStatus === "PLACED") {
      return ["CONFIRMED", "CANCELLED"];
    }
    if (currentStatus === "CONFIRMED") {
      return ["PACKING", "CANCELLED"];
    }
    if (currentStatus === "PACKING") {
      return ["READY_FOR_PICKUP", "CANCELLED"];
    }
    if (currentStatus === "READY_FOR_PICKUP") {
      return ["OUT_FOR_DELIVERY"];
    }
    if (currentStatus === "OUT_FOR_DELIVERY") {
      return ["DELIVERED"];
    }
    return [];
  };

  const nextStatuses = getNextStatuses();

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-base font-semibold text-slate-900">
              Order #{order.id}
            </h3>
            <OrderStatus status={currentStatus} />
          </div>

          <p className="mt-1.5 text-sm text-slate-500">
            Placed on {formatDate(order.createdAt)}
          </p>

          {order.user && (
            <p className="mt-1.5 text-sm text-slate-600">
              Customer:{" "}
              <span className="font-medium text-slate-800">
                {order.user.name || order.user.email}
              </span>
            </p>
          )}
        </div>

        <div className="sm:text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Order Total
          </p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
            {formatPrice(order.total)}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Subtotal
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {formatPrice(order.subtotal)}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Discount
          </p>
          <p className="mt-1 text-sm font-medium text-emerald-600">
            {formatPrice(order.discount || 0)}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Payment
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {order.paymentMethod || "COD"} · {order.paymentStatus || "PENDING"}
          </p>
        </div>
      </div>

      {/* Delivery Address */}
      {order.fullAddress && (
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Delivery Address
          </p>
          <p className="mt-1.5 text-sm font-medium text-slate-800">
            {order.addressLabel}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {order.fullAddress}
          </p>
          <p className="text-sm text-slate-500">
            {order.city}, {order.state} — {order.pincode}
          </p>
        </div>
      )}

      {/* Status Actions */}
      {nextStatuses.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="mb-2.5 text-xs font-medium uppercase tracking-wide text-slate-400">
            Update Status
          </p>

          <div className="flex flex-wrap gap-2">
            {nextStatuses.map((status) => (
              <button
                key={status}
                type="button"
                disabled={updating}
                onClick={() => onStatusUpdate?.(order.id, status)}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  status === "CANCELLED"
                    ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {updating ? "Updating..." : status.replaceAll("_", " ")}
              </button>
            ))}
          </div>
        </div>
      )}

      {STATUS_OPTIONS.includes(currentStatus) && nextStatuses.length === 0 && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-400">
            This order has reached a terminal status.
          </p>
        </div>
      )}
    </article>
  );
};

export default AdminOrderCard;
