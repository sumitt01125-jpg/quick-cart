import { useEffect, useState } from "react";

import ProductForm from "../../components/admin/ProductForm";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../services/admin.service";
import { getCategories } from "../../services/category.service";
import { getProducts } from "../../services/product.service";
import { formatPrice } from "../../utils/formatPrice";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [productData, categoryData] = await Promise.all([
        getProducts({
          page: 1,
          limit: 100,
          sort: "newest",
        }),
        getCategories(),
      ]);

      setProducts(productData.products || []);
      setCategories(categoryData.categories || []);
    } catch (error) {
      console.error("Failed to load admin products:", error);

      setError(
        error.message || "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (productData) => {
    try {
      setFormLoading(true);
      setError("");
      setSuccess("");

      if (editingProduct) {
        await updateProduct(
          editingProduct.id,
          productData
        );

        setSuccess("Product updated successfully.");
      } else {
        await createProduct(productData);

        setSuccess("Product created successfully.");
      }

      setShowForm(false);
      setEditingProduct(null);

      await loadData();
    } catch (error) {
      console.error("Failed to save product:", error);

      setError(
        error.message || "Unable to save this product."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(productId);
      setError("");
      setSuccess("");

      await deleteProduct(productId);

      setProducts((previous) =>
        previous.filter((product) => product.id !== productId)
      );

      setSuccess("Product deleted successfully.");
    } catch (error) {
      console.error("Failed to delete product:", error);

      setError(
        error.message || "Unable to delete this product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f5]">
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-5 lg:px-8 lg:py-9">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
              Admin Panel
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Products
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage the products available in your QuickCart store.
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={handleAdd}
              className="w-fit rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600"
            >
              + Add Product
            </button>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* Product form */}
        {showForm && (
          <section className="mt-7 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-7">
            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-700">
                {editingProduct
                  ? "Edit Product"
                  : "New Product"}
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                {editingProduct
                  ? "Update product details"
                  : "Create a new product"}
              </h2>
            </div>

            <ProductForm
              initialData={editingProduct}
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={formLoading}
            />
          </section>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && products.length === 0 && (
          <div className="mt-7 rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
              🛍️
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No products found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Create your first product to start building the catalog.
            </p>

            {!showForm && (
              <button
                type="button"
                onClick={handleAdd}
                className="mt-6 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-600"
              >
                Create Product
              </button>
            )}
          </div>
        )}

        {/* Product list */}
        {!loading && products.length > 0 && (
          <section className="mt-7">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Product Catalog
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {products.length} products
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] bg-slate-50">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-6xl">
                        🛍️
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="truncate text-sm font-medium text-slate-800">
                      {product.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 min-h-10 text-sm text-slate-500">
                      {product.description}
                    </p>

                    <p className="mt-3 text-base font-semibold text-slate-900">
                      {formatPrice(product.price)}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-[#f7f8f5]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="flex-1 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === product.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Products;