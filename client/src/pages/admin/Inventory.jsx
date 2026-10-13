import { useEffect, useState } from "react";
import InventoryForm from "../../components/admin/InventoryForm";
import {
  createInventory,
  updateInventory,
} from "../../services/admin.service";
import { getProducts } from "../../services/product.service";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProducts({
        page: 1,
        limit: 100,
        sort: "newest",
      });
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to load inventory products:", error);
      setError(error.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError("");
      setSuccess("");

      const quantity = Number(formData.quantity);

      if (editingProduct) {
        await updateInventory(editingProduct.id, quantity);
        setInventory((previous) => ({
          ...previous,
          [editingProduct.id]: quantity,
        }));
        setSuccess("Inventory updated successfully.");
      } else {
        await createInventory({
          productId: Number(formData.productId),
          quantity,
        });
        setInventory((previous) => ({
          ...previous,
          [formData.productId]: quantity,
        }));
        setSuccess("Inventory created successfully.");
      }

      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Failed to save inventory:", error);
      setError(error.message || "Unable to save inventory.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f5]">
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-5 sm:py-9 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
              Admin Panel
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Inventory
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Manage stock quantities for your products.
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={handleAdd}
              className="w-fit rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
            >
              + Add Inventory
            </button>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <section className="mt-7 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-700">
                {editingProduct ? "Update Stock" : "Create Inventory"}
              </p>
              <h2 className="mt-1.5 text-lg font-semibold text-slate-900 sm:text-xl">
                {editingProduct
                  ? `Update stock for ${editingProduct.name}`
                  : "Add inventory for a product"}
              </h2>
            </div>

            <InventoryForm
              products={products}
              initialData={
                editingProduct
                  ? {
                      productId: editingProduct.id,
                      quantity: inventory[editingProduct.id] ?? 0,
                    }
                  : null
              }
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={formLoading}
            />
          </section>
        )}

        {/* Products */}
        {loading ? (
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-2xl border border-slate-100 bg-white"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="mt-7 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
              📦
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No products available
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create products before managing their inventory.
            </p>
          </div>
        ) : (
          <section className="mt-7">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Product Stock
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage inventory product by product.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
                const quantity = inventory[product.id];

                return (
                  <article
                    key={product.id}
                    className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                        📦
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          quantity === undefined
                            ? "bg-slate-100 text-slate-500"
                            : quantity <= 5
                              ? "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {quantity === undefined
                          ? "Not loaded"
                          : quantity <= 5
                            ? "Low stock"
                            : "In stock"}
                      </span>
                    </div>

                    <h3 className="mt-4 truncate text-sm font-semibold text-slate-900">
                      {product.name}
                    </h3>

                    <div className="mt-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Available Stock
                      </p>
                      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                        {quantity === undefined ? "—" : quantity}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      Update Stock
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Inventory;
