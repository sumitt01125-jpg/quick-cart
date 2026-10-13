import { api } from "./api";

export const checkout = async ({
  addressId,
  couponCode,
  paymentMethod = "COD",
}) => {
  const body = {
    addressId,
    paymentMethod,
  };

  if (couponCode?.trim()) {
    body.couponCode = couponCode.trim().toUpperCase();
  }

  return api("/orders/checkout", {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const getOrders = async () => {
  return api("/orders");
};

export const getOrderById = async (orderId) => {
  return api(`/orders/${orderId}`);
};

export const cancelOrder = async (orderId) => {
  return api(`/orders/${orderId}/cancel`, {
    method: "POST",
  });
};

export const reorder = async (orderId) => {
  return api(`/reorder/${orderId}`, {
    method: "POST",
  });
};