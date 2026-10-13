import { useEffect, useState } from "react";

import CouponForm from "../../components/admin/CouponForm";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
} from "../../services/admin.service";
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCoupons = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCoupons();

      setCoupons(data.coupons || []);
    } catch (error) {
      console.error("Failed to load coupons:", error);
      setError(error.message || "Unable to load coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleAdd = () => {
    setEditingCoupon(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCoupon(null);
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError("");
      setSuccess("");

      if (editingCoupon) {
        await updateCoupon(editingCoupon.id, formData);
        setSuccess("Coupon updated successfully.");
      } else {
        await createCoupon(formData);
        setSuccess("Coupon created successfully.");
      }

      setShowForm(false);
      setEditingCoupon(null);

      await loadCoupons();
    } catch (error) {
      console.error("Failed to save coupon:", error);
      setError(error.message || "Unable to save coupon.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (coupon) => {
    const confirmed = window.confirm(
      `Delete coupon "${coupon.code}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteCoupon(coupon.id);

      setCoupons((previous) =>
        previous.filter((item) => item.id !== coupon.id)
      );

      setSuccess("Coupon deleted successfully.");
    } catch (error) {
      console.error("Failed to delete coupon:", error);
      setError(error.message || "Unable to delete coupon.");
    }
  };

  const getDiscountLabel = (coupon) => {
    if (coupon.discountType === "PERCENTAGE") {
      return `${coupon.discountValue}%`;
    }

    return formatPrice(coupon.discountValue);
  };

  const getStatus = (coupon) => {
    if (!coupon.isActive) {
      return {
        label: "Inactive",
        className: "bg-slate-100 text-slate-600",
      };
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return {
        label: "Expired",
        className: "bg-red-50 text-red-600",
      };
    }

    return {
      label: "Active",
      className: "bg-emerald-50 text-emerald-600",
    };
  };

  return (
    <div className="min-h-screen bg-[#f7f8f5]">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-5 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-700">
              Admin Panel
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Coupons
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create and manage promotional discount codes.
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={handleAdd}
              className="w-fit rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
            >
              + Create Coupon
            </button>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <section className="mt-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-700">
                {editingCoupon ? "Edit Coupon" : "New Coupon"}
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                {editingCoupon
                  ? `Update ${editingCoupon.code}`
                  : "Create a promotional coupon"}
              </h2>
            </div>

            <CouponForm
              initialData={editingCoupon}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={formLoading}
            />
          </section>
        )}

        {/* Coupon List */}
        <section className="mt-7">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-slate-900">
              All Coupons
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {coupons.length} coupon
              {coupons.length !== 1 ? "s" : ""} configured.
            </p>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-2xl bg-slate-200/80"
                />
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
                🎟️
              </div>

              <h2 className="mt-5 text-lg font-semibold text-slate-900">
                No coupons yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Create your first discount coupon to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {coupons.map((coupon) => {
                const status = getStatus(coupon);

                return (
                  <article
                    key={coupon.id}
                    className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      {/* Coupon Info */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
                          🎟️
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold tracking-wide text-slate-900">
                              {coupon.code}
                            </h3>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            {coupon.discountType === "PERCENTAGE"
                              ? "Percentage discount"
                              : "Fixed discount"}
                          </p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm sm:grid-cols-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Discount
                          </p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {getDiscountLabel(coupon)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Min Order
                          </p>
                          <p className="mt-1 font-medium text-slate-800">
                            {formatPrice(coupon.minOrderAmount || 0)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Usage
                          </p>
                          <p className="mt-1 font-medium text-slate-800">
                            {coupon.usedCount || 0}
                            {coupon.usageLimit
                              ? ` / ${coupon.usageLimit}`
                              : " / ∞"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Expires
                          </p>
                          <p className="mt-1 font-medium text-slate-800">
                            {formatDate(coupon.expiresAt)}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 lg:shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEdit(coupon)}
                          className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:flex-none"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(coupon)}
                          className="flex-1 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 sm:flex-none"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Coupons;