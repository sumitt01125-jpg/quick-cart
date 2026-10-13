import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import {
  createAddress,
  getAddresses,
} from "../../services/address.service";
import { validateCoupon } from "../../services/coupon.service";
import { checkout } from "../../services/order.service";
import { formatPrice } from "../../utils/formatPrice";

const Checkout = () => {
  const navigate = useNavigate();

  const { cart, loading: cartLoading, fetchCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);

  const [loading, setLoading] = useState(true);
  const [couponLoading, setCouponLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [error, setError] = useState("");
  const [couponError, setCouponError] = useState("");

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [addressForm, setAddressForm] = useState({
    label: "",
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAddresses();
        const userAddresses = data.addresses || [];

        setAddresses(userAddresses);

        const defaultAddress =
          userAddresses.find((address) => address.isDefault) ||
          userAddresses[0];

        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
        }
      } catch (error) {
        console.error("Failed to load addresses:", error);

        setError(
          error.message || "Unable to load your addresses."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, []);

  const subtotal = Number(cart?.total || 0);
  const discount = Number(coupon?.discount || 0);
  const finalAmount = Math.max(0, subtotal - discount);

  const handleAddressChange = (event) => {
    const { name, value, type, checked } = event.target;

    setAddressForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateAddress = async (event) => {
    event.preventDefault();

    try {
      setError("");

      const data = await createAddress({
        ...addressForm,
        pincode: addressForm.pincode.trim(),
      });

      const newAddress = data.address;

      setAddresses((previous) => {
        if (newAddress.isDefault) {
          return [
            newAddress,
            ...previous.map((address) => ({
              ...address,
              isDefault: false,
            })),
          ];
        }

        return [...previous, newAddress];
      });

      setSelectedAddress(newAddress.id);
      setShowAddressForm(false);

      setAddressForm({
        label: "",
        fullAddress: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
    } catch (error) {
      console.error("Failed to create address:", error);

      setError(
        error.message || "Unable to create this address."
      );
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Enter a coupon code first.");
      return;
    }

    try {
      setCouponLoading(true);
      setCouponError("");
      setCoupon(null);

      const data = await validateCoupon(
        couponCode.trim(),
        subtotal
      );

      setCoupon(data);
    } catch (error) {
      console.error("Failed to validate coupon:", error);

      setCouponError(
        error.message || "This coupon could not be applied."
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address.");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const data = await checkout({
        addressId: selectedAddress,
        couponCode: coupon?.code || couponCode,
        paymentMethod: "COD",
      });

      await fetchCart();

      navigate(`/orders/${data.order.id}`, {
        replace: true,
        state: {
          orderPlaced: true,
        },
      });
    } catch (error) {
      console.error("Failed to place order:", error);

      setError(
        error.message ||
          "Unable to place your order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cartLoading || loading) {
    return (
      <div className="min-h-screen bg-[#f7f8f5]">
        <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="animate-pulse">
            <div className="h-9 w-48 rounded-lg bg-slate-200" />

            <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_340px]">
              <div className="space-y-4">
                <div className="h-48 rounded-2xl bg-slate-200" />
                <div className="h-64 rounded-2xl bg-slate-200" />
              </div>

              <div className="h-80 rounded-2xl bg-slate-200" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-[#f7f8f5]">
        <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center justify-center px-5 py-12">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-4xl">
              🛒
            </div>

            <h1 className="mt-6 text-3xl font-semibold text-slate-900">
              Your cart is empty
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Add some products before proceeding to checkout.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-emerald-600"
            >
              Browse Products
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8f5]">
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        {/* Header */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-700">
            Almost there
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Choose your address and confirm your order.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-normal text-red-600">
            {error}
          </div>
        )}

        <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_340px] lg:items-start">
          {/* Left */}
          <div className="space-y-5">
            {/* Address */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-emerald-700">
                    Step 1
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    Delivery Address
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowAddressForm((value) => !value)
                  }
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-[#f7f8f5]"
                >
                  {showAddressForm ? "Cancel" : "+ Add New"}
                </button>
              </div>

              {addresses.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`block cursor-pointer rounded-2xl border p-4 transition ${
                        selectedAddress === address.id
                          ? "border-emerald-500 bg-emerald-50/50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex gap-3">
                        <input
                          type="radio"
                          name="selectedAddress"
                          value={address.id}
                          checked={selectedAddress === address.id}
                          onChange={() =>
                            setSelectedAddress(address.id)
                          }
                          className="mt-1 h-4 w-4 accent-emerald-500"
                        />

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-slate-900">
                              {address.label}
                            </p>

                            {address.isDefault && (
                              <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase text-emerald-700">
                                Default
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {address.fullAddress}
                          </p>

                          <p className="text-sm text-slate-500">
                            {address.city}, {address.state} -{" "}
                            {address.pincode}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl bg-[#f7f8f5] p-6 text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    No saved addresses
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Add a delivery address to continue.
                  </p>
                </div>
              )}

              {showAddressForm && (
                <form
                  onSubmit={handleCreateAddress}
                  className="mt-6 border-t border-slate-100 pt-6"
                >
                  <h3 className="text-base font-semibold text-slate-900">
                    New Address
                  </h3>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <input
                      name="label"
                      value={addressForm.label}
                      onChange={handleAddressChange}
                      required
                      minLength={2}
                      maxLength={30}
                      placeholder="Label (Home, Work)"
                      className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                    />

                    <input
                      name="pincode"
                      value={addressForm.pincode}
                      onChange={handleAddressChange}
                      required
                      pattern="[0-9]{6}"
                      maxLength={6}
                      placeholder="Pincode"
                      className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                    />

                    <textarea
                      name="fullAddress"
                      value={addressForm.fullAddress}
                      onChange={handleAddressChange}
                      required
                      minLength={5}
                      maxLength={200}
                      rows={3}
                      placeholder="Full address"
                      className="resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 sm:col-span-2"
                    />

                    <input
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      required
                      minLength={2}
                      maxLength={50}
                      placeholder="City"
                      className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                    />

                    <input
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressChange}
                      required
                      minLength={2}
                      maxLength={50}
                      placeholder="State"
                      className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                    />
                  </div>

                  <label className="mt-4 flex items-center gap-2 text-sm font-normal text-slate-600">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={addressForm.isDefault}
                      onChange={handleAddressChange}
                      className="h-4 w-4 accent-emerald-500"
                    />
                    Make this my default address
                  </label>

                  <button
                    type="submit"
                    className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    Save Address
                  </button>
                </form>
              )}
            </section>

            {/* Payment */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-emerald-700">
                Step 2
              </p>

              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                Payment Method
              </h2>

              <div className="mt-6 rounded-2xl border border-emerald-500 bg-emerald-50/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl">
                    💵
                  </div>

                  <div>
                    <p className="font-medium text-slate-900">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Pay when your order arrives.
                    </p>
                  </div>

                  <span className="ml-auto h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                </div>
              </div>
            </section>

            {/* Coupon */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-emerald-700">
                Step 3
              </p>

              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                Apply Coupon
              </h2>

              <div className="mt-5 flex gap-3">
                <input
                  value={couponCode}
                  onChange={(event) => {
                    setCouponCode(event.target.value.toUpperCase());
                    setCouponError("");
                  }}
                  placeholder="Enter coupon code"
                  disabled={couponLoading}
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-[#f7f8f5] px-4 py-3 text-sm font-medium uppercase outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                />

                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {couponLoading ? "Checking..." : "Apply"}
                </button>
              </div>

              {couponError && (
                <p className="mt-3 text-sm font-medium text-red-500">
                  {couponError}
                </p>
              )}

              {coupon && (
                <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  Coupon <span className="font-black">{coupon.code}</span>{" "}
                  applied. You saved {formatPrice(discount)}.
                </div>
              )}
            </section>
          </div>

          {/* Summary */}
          <aside className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-semibold text-slate-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold text-slate-800">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Discount</span>
                  <span className="font-bold text-emerald-600">
                    -{formatPrice(discount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Payment</span>
                <span className="font-semibold text-slate-800">
                  COD
                </span>
              </div>

              <div className="h-px bg-slate-200" />

              <div className="flex items-end justify-between">
                <span className="font-medium text-slate-900">
                  Total
                </span>

                <span className="text-2xl font-semibold text-slate-900">
                  {formatPrice(finalAmount)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={
                placingOrder ||
                !selectedAddress ||
                !addresses.length
              }
              className="mt-7 w-full rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {placingOrder
                ? "Placing Order..."
                : "Place Order"}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              By placing your order, you agree to proceed with the
              selected delivery address and Cash on Delivery payment.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Checkout;