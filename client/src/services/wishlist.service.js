import { api } from "./api";

export const getWishlist = async () => {
  return api("/wishlist");
};

export const addToWishlist = async (productId) => {
  return api(`/wishlist/${productId}`, {
    method: "POST",
  });
};

export const removeFromWishlist = async (productId) => {
  return api(`/wishlist/${productId}`, {
    method: "DELETE",
  });
};