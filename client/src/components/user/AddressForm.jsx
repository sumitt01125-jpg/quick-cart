import { useEffect, useState } from "react";

const initialForm = {
  label: "",
  fullAddress: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

const AddressForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        label: initialData.label || "",
        fullAddress: initialData.fullAddress || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pincode: initialData.pincode || "",
        isDefault: Boolean(initialData.isDefault),
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
    onSubmit?.({
      ...form,
      label: form.label.trim(),
      fullAddress: form.fullAddress.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
    });
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50";

  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Label</label>
          <input
            name="label"
            value={form.label}
            onChange={handleChange}
            placeholder="Home"
            minLength={2}
            maxLength={30}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Pincode</label>
          <input
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            placeholder="123456"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Full Address</label>
        <textarea
          name="fullAddress"
          value={form.fullAddress}
          onChange={handleChange}
          placeholder="House no., street, area..."
          minLength={5}
          maxLength={200}
          required
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>City</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Delhi"
            minLength={2}
            maxLength={50}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>State</label>
          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="Delhi"
            minLength={2}
            maxLength={50}
            required
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50/40">
        <input
          type="checkbox"
          name="isDefault"
          checked={form.isDefault}
          onChange={handleChange}
          className="h-4 w-4 accent-emerald-500"
        />
        <span className="text-sm font-medium text-slate-700">
          Set as default address
        </span>
      </label>

      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-medium text-white shadow-sm shadow-emerald-500/15 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : initialData
            ? "Update Address"
            : "Save Address"}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
