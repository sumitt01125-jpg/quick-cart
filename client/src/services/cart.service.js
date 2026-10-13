import { api } from "./api";

export const getCart = async () => {
  return api("/cart");
};

export const addToCart = async (productId, quantity = 1) => {
  return api("/cart/items", {
    method: "POST",
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });
};

export const updateCartItem = async (itemId, quantity) => {
  return api(`/cart/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({
      quantity,
    }),
  });
};

export const removeCartItem = async (itemId) => {
  return api(`/cart/items/${itemId}`, {
    method: "DELETE",
  });
};

export const clearCart = async () => {
  return api("/cart", {
    method: "DELETE",
  });
};