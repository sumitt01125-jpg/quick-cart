import { api } from "./api";

// =====================================================
// ADMIN TEST
// =====================================================

export const getAdminTest = async () => {
  return api("/admin/test");
};

// =====================================================
// PRODUCTS
// =====================================================

export const createProduct = async (productData) => {
  return api("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
};

export const updateProduct = async (productId, productData) => {
  return api(`/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(productData),
  });
};

export const deleteProduct = async (productId) => {
  return api(`/products/${productId}`, {
    method: "DELETE",
  });
};

// =====================================================
// CATEGORIES
// =====================================================

export const createCategory = async (categoryData) => {
  return api("/categories", {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
};

// =====================================================
// INVENTORY
// =====================================================

export const createInventory = async (inventoryData) => {
  return api("/inventory", {
    method: "POST",
    body: JSON.stringify(inventoryData),
  });
};

export const updateInventory = async (productId, quantity) => {
  return api(`/inventory/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({
      quantity,
    }),
  });
};

// =====================================================
// COUPONS
// =====================================================

export const getCoupons = async () => {
  return api("/coupons");
};

export const createCoupon = async (couponData) => {
  return api("/coupons", {
    method: "POST",
    body: JSON.stringify(couponData),
  });
};

export const updateCoupon = async (couponId, couponData) => {
  return api(`/coupons/${couponId}`, {
    method: "PATCH",
    body: JSON.stringify(couponData),
  });
};

export const deleteCoupon = async (couponId) => {
  return api(`/coupons/${couponId}`, {
    method: "DELETE",
  });
};

// =====================================================
// ORDERS
// =====================================================

export const getAllOrders = async () => {
  return api("/orders/admin");
};

export const updateOrderStatus = async (orderId, status) => {
  return api(`/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
    }),
  });
};