import { useEffect, useState } from "react";

const initialForm = {
  code: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  minOrderAmount: "",
  maxDiscount: "",
  expiresAt: "",
  usageLimit: "",
  isActive: true,
};

const CouponForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code || "",
        discountType: initialData.discountType || "PERCENTAGE",
        discountValue: initialData.discountValue ?? "",
        minOrderAmount: initialData.minOrderAmount ?? "",
        maxDiscount: initialData.maxDiscount ?? "",
        expiresAt: initialData.expiresAt
          ? new Date(initialData.expiresAt).toISOString().slice(0, 16)
          : "",
        usageLimit: initialData.usageLimit ?? "",
        isActive: initialData.isActive ?? true,
      });
    } else {
      setForm(initialForm);
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderAmount: Number(form.minOrderAmount || 0),
      expiresAt: new Date(form.expiresAt).toISOString(),
      isActive: form.isActive,
    };

    if (form.maxDiscount !== "") {
      payload.maxDiscount = Number(form.maxDiscount);
    }

    if (form.usageLimit !== "") {
      payload.usageLimit = Number(form.usageLimit);
    }

    onSubmit?.(payload);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10";

  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Coupon Code */}
      <div>
        <label className={labelClass}>Coupon Code</label>
        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="WELCOME20"
          minLength={3}
          maxLength={30}
          required
          className={`${inputClass} font-medium uppercase tracking-wide`}
        />
        <p className="mt-1.5 text-xs text-slate-400">
          Customers will enter this code at checkout.
        </p>
      </div>

      {/* Discount */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Discount Type</label>
          <select
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed Amount</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Discount Value</label>
          <input
            name="discountValue"
            type="number"
            min="0.01"
            step="0.01"
            max={form.discountType === "PERCENTAGE" ? "100" : undefined}
            value={form.discountValue}
            onChange={handleChange}
            placeholder={form.discountType === "PERCENTAGE" ? "20" : "100"}
            required
            className={inputClass}
          />
        </div>
      </div>

      {/* Order Limits */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Minimum Order Amount</label>
          <input
            name="minOrderAmount"
            type="number"
            min="0"
            step="0.01"
            value={form.minOrderAmount}
            onChange={handleChange}
            placeholder="500"
            className={inputClass}
          />
        </div>

        {form.discountType === "PERCENTAGE" && (
          <div>
            <label className={labelClass}>Maximum Discount</label>
            <input
              name="maxDiscount"
              type="number"
              min="0.01"
              step="0.01"
              value={form.maxDiscount}
              onChange={handleChange}
              placeholder="200"
              className={inputClass}
            />
          </div>
        )}
      </div>

      {/* Expiry and Usage */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Expiry Date</label>
          <input
            name="expiresAt"
            type="datetime-local"
            value={form.expiresAt}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Usage Limit</label>
          <input
            name="usageLimit"
            type="number"
            min="1"
            step="1"
            value={form.usageLimit}
            onChange={handleChange}
            placeholder="100"
            className={inputClass}
          />
        </div>
      </div>

      {/* Active Toggle */}
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 transition hover:bg-slate-50">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
          className="h-4 w-4 accent-emerald-600"
        />
        <span className="text-sm font-medium text-slate-700">
          Coupon is active
        </span>
      </label>

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
          disabled={loading}
          className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : initialData
              ? "Update Coupon"
              : "Create Coupon"}
        </button>
      </div>
    </form>
  );
};

export default CouponForm;
