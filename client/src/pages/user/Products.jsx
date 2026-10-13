import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import ProductGrid from "../../components/user/ProductGrid";
import { getCategories } from "../../services/category.service";
import { getProducts } from "../../services/product.service";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState("");

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const sort = searchParams.get("sort") || "newest";

  const limit = 12;

  // Scroll to top whenever the pagination page changes.
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [page]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoryLoading(true);

        const data = await getCategories();

        setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setCategoryLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts({
          page,
          limit,
          search,
          categoryId,
          sort,
        });

        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to load products:", error);

        setProducts([]);
        setError(
          error.message || "Unable to load products right now."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page, search, categoryId, sort]);

  const updateParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    setSearchParams(nextParams);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const value = event.currentTarget.search.value.trim();

    updateParams({
      search: value,
      page: 1,
    });
  };

  const handleCategoryChange = (event) => {
    updateParams({
      categoryId: event.target.value,
      page: 1,
    });
  };

  const handleSortChange = (event) => {
    updateParams({
      sort: event.target.value,
      page: 1,
    });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = search || categoryId || sort !== "newest";
  const canGoNext = products.length === limit;
  const canGoPrevious = page > 1;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-9">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-700">
              QuickCart Store
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Browse Products
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Find groceries and everyday essentials for your cart.
            </p>
          </div>

          <Link
            to="/cart"
            className="inline-flex w-fit rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            View Cart
          </Link>
        </div>

        {/* Filters */}
        <section className="mt-7 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <form
            onSubmit={handleSearch}
            className="grid gap-3 lg:grid-cols-[1fr_200px_200px_auto]"
          >
            {/* Search */}
            <div className="relative">
              <label htmlFor="search" className="sr-only">
                Search products
              </label>

              <input
                id="search"
                name="search"
                type="search"
                defaultValue={search}
                placeholder="Search products..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              />
            </div>

            {/* Category */}
            <select
              value={categoryId}
              onChange={handleCategoryChange}
              disabled={categoryLoading}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">All categories</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={handleSortChange}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>

            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-600"
            >
              Search
            </button>
          </form>

          {hasFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
              <span className="text-xs font-medium text-slate-500">
                Active filters:
              </span>

              {search && (
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                  Search: {search}
                </span>
              )}

              {categoryId && (
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                  Category selected
                </span>
              )}

              {sort !== "newest" && (
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                  {sort === "price_asc"
                    ? "Low to high"
                    : "High to low"}
                </span>
              )}

              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto text-xs font-medium text-red-500 transition hover:text-red-600"
              >
                Clear all
              </button>
            </div>
          )}
        </section>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Result header */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {search ? `Results for "${search}"` : "All Products"}
            </h2>

            {!loading && (
              <p className="mt-1 text-sm text-slate-500">
                {products.length === 0
                  ? "No products found"
                  : `${products.length} products on this page`}
              </p>
            )}
          </div>

          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-200">
            Page {page}
          </span>
        </div>

        {/* Products */}
        <div className="mt-5">
          <ProductGrid products={products} loading={loading} />
        </div>

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
            <button
              type="button"
              disabled={!canGoPrevious}
              onClick={() =>
                updateParams({
                  page: page - 1,
                })
              }
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            <span className="text-sm font-medium text-slate-500">
              Page {page}
            </span>

            <button
              type="button"
              disabled={!canGoNext}
              onClick={() =>
                updateParams({
                  page: page + 1,
                })
              }
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
