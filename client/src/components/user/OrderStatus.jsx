const STATUS_STYLES = {
  PLACED: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100",
  CONFIRMED: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100",
  PACKING: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100",
  READY_FOR_PICKUP: "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-100",
  OUT_FOR_DELIVERY: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-100",
  DELIVERED: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100",
  CANCELLED: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-100",
};

const STATUS_LABELS = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PACKING: "Packing",
  READY_FOR_PICKUP: "Ready for Pickup",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const OrderStatus = ({ status }) => {
  const normalizedStatus = status || "PLACED";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium leading-4 sm:text-xs ${
        STATUS_STYLES[normalizedStatus] ||
        "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200"
      }`}
    >
      {STATUS_LABELS[normalizedStatus] ||
        normalizedStatus.replaceAll("_", " ")}
    </span>
  );
};

export default OrderStatus;
