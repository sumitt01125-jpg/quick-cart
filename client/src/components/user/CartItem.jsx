import { formatPrice } from "../../utils/formatPrice";

const CartItem = ({
  item,
  onUpdate,
  onRemove,
  updating = false,
}) => {
  const itemTotal = Number(item.itemTotal ?? 0);
  const price = Number(item.product?.price ?? 0);

  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-3.5 transition-all duration-200 hover:border-emerald-200 hover:shadow-[0_8px_22px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:p-4">
      {/* Product */}
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f2f8f2] text-2xl sm:h-[72px] sm:w-[72px]">
          {item.product?.imageUrl ? (
            <img
              src={item.product.imageUrl}
              alt={item.product?.name || "Product"}
              loading="lazy"
              className="h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <span aria-hidden="true">🛍️</span>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium text-slate-900">
            {item.product?.name || "Product"}
          </h3>
          <p className="mt-1 text-xs font-normal text-slate-500 sm:text-sm">
            {formatPrice(price)} each
          </p>
        </div>
      </div>

      {/* Quantity and total */}
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="inline-flex items-center rounded-xl border border-slate-200 bg-[#f8faf8] p-0.5">
          <button
            type="button"
            disabled={updating || item.quantity <= 1}
            onClick={() => onUpdate(item.id, item.quantity - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-base font-medium text-slate-600 transition hover:bg-white hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-8 px-1 text-center text-sm font-medium tabular-nums text-slate-800">
            {item.quantity}
          </span>
          <button
            type="button"
            disabled={updating}
            onClick={() => onUpdate(item.id, item.quantity + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-base font-medium text-slate-600 transition hover:bg-white hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Total */}
        <div className="min-w-24 text-right">
          <p className="text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
            {formatPrice(itemTotal)}
          </p>
          <button
            type="button"
            disabled={updating}
            onClick={() => onRemove(item.id)}
            className="mt-1 text-xs font-medium text-rose-500 transition hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
};

export default CartItem;
