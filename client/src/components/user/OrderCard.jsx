import { Link } from "react-router-dom";
import OrderStatus from "./OrderStatus";
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";

const OrderCard = ({ order }) => {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Order Info */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-base font-semibold text-slate-900">
              Order #{order.id}
            </h3>
            <OrderStatus status={order.status} />
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Total */}
        <div className="sm:text-right">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Total
          </p>
          <p className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900">
            {formatPrice(order.total)}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Payment
          </p>
          <p className="mt-1 text-sm font-medium text-slate-700">
            {order.paymentMethod || "COD"}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Payment Status
          </p>
          <p className="mt-1 break-words text-sm font-medium text-slate-700">
            {order.paymentStatus || "PENDING"}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Discount
          </p>
          <p className="mt-1 text-sm font-semibold text-emerald-700">
            {formatPrice(order.discount || 0)}
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="mt-4 flex justify-start border-t border-slate-100 pt-4">
        <Link
          to={`/orders/${order.id}`}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          View Order
        </Link>
      </div>
    </article>
  );
};

export default OrderCard;
