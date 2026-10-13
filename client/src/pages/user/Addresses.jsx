import { useEffect, useState } from "react";

import AddressCard from "../../components/user/AddressCard";
import AddressForm from "../../components/user/AddressForm";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../../services/address.service";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAddresses();
      setAddresses(data.addresses || []);
    } catch (error) {
      console.error("Failed to load addresses:", error);
      setError(error.message || "Unable to load your addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleAdd = () => {
    setEditingAddress(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (addressData) => {
    try {
      setFormLoading(true);
      setError("");
      setSuccess("");

      if (editingAddress) {
        await updateAddress(editingAddress.id, addressData);
        setSuccess("Address updated successfully.");
      } else {
        await createAddress(addressData);
        setSuccess("Address added successfully.");
      }

      setShowForm(false);
      setEditingAddress(null);
      await loadAddresses();
    } catch (error) {
      console.error("Failed to save address:", error);
      setError(error.message || "Unable to save this address.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (addressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(addressId);
      setError("");
      setSuccess("");
      await deleteAddress(addressId);
      setAddresses((previous) =>
        previous.filter((address) => address.id !== addressId)
      );
      setSuccess("Address deleted successfully.");
    } catch (error) {
      console.error("Failed to delete address:", error);
      setError(error.message || "Unable to delete this address.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8f5]">
        <main className="mx-auto max-w-5xl px-5 py-8 lg:px-8">
          <div className="animate-pulse">
            <div className="h-3 w-24 rounded bg-emerald-100" />
            <div className="mt-3 h-8 w-48 rounded-lg bg-slate-200" />
            <div className="mt-2 h-4 w-64 max-w-full rounded bg-slate-200" />
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-44 rounded-2xl border border-slate-200 bg-white"
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8f5]">
      <main className="mx-auto max-w-5xl px-5 py-8 lg:px-8 lg:py-9">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-emerald-700">
              Delivery preferences
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              My Addresses
            </h1>
            <p className="mt-2 text-sm font-normal leading-6 text-slate-500">
              Manage the places where your QuickCart orders arrive.
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
            >
              <span className="text-base leading-none">+</span>
              Add address
            </button>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-normal text-rose-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-normal text-emerald-800"
          >
            {success}
          </div>
        )}

        {/* Address form */}
        {showForm && (
          <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-5 py-5 sm:px-7">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-700">
                {editingAddress ? "Edit address" : "New address"}
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                {editingAddress
                  ? "Update delivery address"
                  : "Add a delivery address"}
              </h2>
              <p className="mt-1 text-sm font-normal text-slate-500">
                {editingAddress
                  ? "Make sure your delivery details are up to date."
                  : "Save an address to make future checkouts easier."}
              </p>
            </div>
            <div className="p-5 sm:p-7">
              <AddressForm
                initialData={editingAddress}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={formLoading}
              />
            </div>
          </section>
        )}

        {/* Empty state */}
        {!showForm && addresses.length === 0 && (
          <div className="mt-7 rounded-2xl border border-slate-200/80 bg-white px-6 py-12 text-center shadow-sm sm:py-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
              📍
            </div>
            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              No addresses saved
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm font-normal leading-6 text-slate-500">
              Add a delivery address so you can check out faster next time.
            </p>
            <button
              type="button"
              onClick={handleAdd}
              className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Add your first address
            </button>
          </div>
        )}

        {/* Address list */}
        {!showForm && addresses.length > 0 && (
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deleting={deletingId === address.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Addresses;