import { useEffect, useState } from "react";

const InventoryForm = ({
  products = [],
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (initialData) {
      setProductId(
        initialData.productId ? String(initialData.productId) : ""
      );
      setQuantity(
        initialData.quantity !== undefined
          ? String(initialData.quantity)
          : ""
      );
    } else {
      setProductId("");
      setQuantity("");
    }
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit?.({
      productId: Number(productId),
      quantity: Number(quantity),
    });
  };

  const isEditing = Boolean(initialData);

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Product */}
      <div>
        <label className={labelClass}>Product</label>
        <select
          value={productId}
          onChange={(event) => setProductId(event.target.value)}
          disabled={isEditing || loading}
          required
          className={inputClass}
        >
          <option value="">Select product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        {isEditing && (
          <p className="mt-1.5 text-xs text-slate-400">
            Product selection is locked while editing inventory.
          </p>
        )}
      </div>

      {/* Quantity */}
      <div>
        <label className={labelClass}>Stock Quantity</label>
        <input
          type="number"
          min="0"
          step="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          placeholder="100"
          required
          disabled={loading}
          className={inputClass}
        />
        <p className="mt-1.5 text-xs text-slate-400">
          Quantity must be zero or greater.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading || !productId}
          className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : isEditing
              ? "Update Stock"
              : "Create Inventory"}
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;
