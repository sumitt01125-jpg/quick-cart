import { api } from "./api";

export const getProducts = async (params = {}) => {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.set("page", params.page);
  }

  if (params.limit) {
    searchParams.set("limit", params.limit);
  }

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.categoryId) {
    searchParams.set("categoryId", params.categoryId);
  }

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  const query = searchParams.toString();

  return api(`/products${query ? `?${query}` : ""}`);
};

export const getProductById = async (productId) => {
  return api(`/products/${productId}`);
};

export const getProductInventory = async (productId) => {
  return api(`/inventory/${productId}`);
};