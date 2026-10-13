const AddressCard = ({
  address,
  selected = false,
  selectable = false,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <article
      className={`rounded-2xl border bg-white p-4 shadow-sm transition duration-200 hover:shadow-md sm:p-5 ${
        selected
          ? "border-emerald-400 ring-2 ring-emerald-100"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Address Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {selectable && (
              <input
                type="radio"
                name="selectedAddress"
                checked={selected}
                onChange={() => onSelect?.(address)}
                className="h-4 w-4 accent-emerald-600"
              />
            )}
            <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
              {address.label}
            </h3>
            {address.isDefault && (
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                Default
              </span>
            )}
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {address.fullAddress}
          </p>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {address.city}, {address.state} — {address.pincode}
          </p>
        </div>
      </div>

      {/* Actions */}
      {(onEdit || onDelete) && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(address)}
              className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(address)}
              className="rounded-xl border border-red-100 px-3.5 py-2 text-sm font-medium text-red-600 transition hover:border-red-200 hover:bg-red-50"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
};

export default AddressCard;
