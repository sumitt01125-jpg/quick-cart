import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  price: "",
  description: "",
  imageUrl: "",
  categoryId: "",
};

const ProductForm = ({
  initialData = null,
  categories = [],
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        price: initialData.price ?? "",
        description: initialData.description || "",
        imageUrl: initialData.imageUrl || "",
        categoryId: initialData.categoryId
          ? String(initialData.categoryId)
          : "",
      });
    } else {
      setForm(initialForm);
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.({
      name: form.name.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim() || undefined,
      categoryId: Number(form.categoryId),
    });
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50";

  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Product Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Fresh Apples"
          minLength={2}
          maxLength={100}
          required
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Price</label>
          <input
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="99.99"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Image URL</label>
        <input
          name="imageUrl"
          type="url"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/product.jpg"
          className={inputClass}
        />
        <p className="mt-1.5 text-xs text-slate-400">
          Add a direct image link to display the product photo.
        </p>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the product..."
          minLength={5}
          maxLength={500}
          rows={4}
          required
          className={`${inputClass} resize-none`}
        />
        <p className="mt-1.5 text-right text-xs text-slate-400">
          {form.description.length}/500
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
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
            ? "Update Product"
            : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
