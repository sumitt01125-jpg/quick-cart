import { useEffect, useState } from "react";

const CategoryForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(initialData?.name || "");
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit?.({
      name: name.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Category Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Fruits & Vegetables"
          minLength={2}
          maxLength={50}
          required
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
        />
        <p className="mt-2 text-xs text-slate-400">
          Use a clear name customers can easily recognize.
        </p>
      </div>

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
          {loading ? "Saving..." : initialData ? "Update Category" : "Create Category"}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
