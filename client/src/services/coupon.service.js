import { api } from "./api";

export const validateCoupon = async (code, orderAmount) => {
  return api("/coupons/validate", {
    method: "POST",
    body: JSON.stringify({
      code: code.trim().toUpperCase(),
      orderAmount,
    }),
  });
};