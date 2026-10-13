import { useEffect, useState } from "react";
import CategoryForm from "../../components/admin/CategoryForm";
import { createCategory } from "../../services/admin.service";
import { getCategories } from "../../services/category.service";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setError(error.message || "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (categoryData) => {
    try {
      setFormLoading(true);
      setError("");
      setSuccess("");
      await createCategory(categoryData);
      setSuccess("Category created successfully.");
      setShowForm(false);
      await loadCategories();
    } catch (error) {
      console.error("Failed to create category:", error);
      setError(error.message || "Unable to create this category.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f5]">
      <main className="mx-auto max-w-5xl px-4 py-7 sm:px-5 lg:px-8 lg:py-9">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
              Admin Panel
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Categories
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Organize products into categories for easier shopping.
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={() => {
                setShowForm(true);
                setError("");
                setSuccess("");
              }}
              className="w-fit rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600"
            >
              + Add Category
            </button>
          )}
        </header>

        {error && (
          <div role="alert" className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div role="status" className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {showForm && (
          <section className="mt-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-700">
                New Category
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Create a category
              </h2>
            </div>
            <CategoryForm
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              loading={formLoading}
            />
          </section>
        )}

        {loading && (
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-2xl bg-slate-200/80"
              />
            ))}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="mt-7 rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
              📂
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No categories yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Create your first category to organize products.
            </p>
            {!showForm && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-5 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-600"
              >
                Create Category
              </button>
            )}
          </div>
        )}

        {!loading && categories.length > 0 && (
          <section className="mt-7">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                All Categories
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {categories.length}{" "}
                {categories.length === 1 ? "category" : "categories"}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                    📂
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {category.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Category ID: {category.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Categories;
