import { db } from "../../prisma/db.js";

export const createCoupon = async (couponData) => {
  const existingCoupon = await db.orm.public.Coupon
    .where({ code: couponData.code })
    .first();

  if (existingCoupon) {
    const error = new Error("Coupon already exists");
    error.statusCode = 409;
    throw error;
  }

  if (
    couponData.discountType === "PERCENTAGE" &&
    couponData.discountValue > 100
  ) {
    const error = new Error("Percentage discount cannot exceed 100");
    error.statusCode = 400;
    throw error;
  }

  if (
    couponData.discountType === "FIXED" &&
    couponData.maxDiscount
  ) {
    const error = new Error("maxDiscount is only valid for percentage coupons");
    error.statusCode = 400;
    throw error;
  }

  const coupon = await db.orm.public.Coupon.create({ code: couponData.code,
    discountType: couponData.discountType, discountValue: couponData.discountValue,
    minOrderAmount: couponData.minOrderAmount ?? 0,maxDiscount: couponData.maxDiscount ?? null, expiresAt: couponData.expiresAt,usageLimit: couponData.usageLimit ?? null,
    isActive: couponData.isActive ?? true,});

  return coupon;
};

export const getCoupons = async () => {
  return await db.orm.public.Coupon
    .orderBy((coupon) => coupon.createdAt.desc())
    .all();
};

export const updateCoupon = async (couponId, couponData) => {
  const coupon = await db.orm.public.Coupon
    .where({ id: couponId })
    .first();

  if (!coupon) {
    const error = new Error("Coupon not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    couponData.discountType === "PERCENTAGE" &&
    couponData.discountValue > 100
  ) {
    const error = new Error("Percentage discount cannot exceed 100");
    error.statusCode = 400;
    throw error;
  }

  if (
    couponData.discountType === "FIXED" &&
    couponData.maxDiscount
  ) {
    const error = new Error("maxDiscount is only valid for percentage coupons");
    error.statusCode = 400;
    throw error;
  }

  return await db.orm.public.Coupon
    .where({ id: couponId })
    .update(couponData);
};

export const deleteCoupon = async (couponId) => {
  const coupon = await db.orm.public.Coupon
    .where({ id: couponId })
    .first();

  if (!coupon) {
    const error = new Error("Coupon not found");
    error.statusCode = 404;
    throw error;
  }

  await db.orm.public.Coupon
    .where({ id: couponId })
    .delete();

  return {
    message: "Coupon deleted successfully",
  };
};

export const validateCoupon = async (code, orderAmount) => {
  const coupon = await db.orm.public.Coupon
    .where({ code: code.toUpperCase() })
    .first();

  if (!coupon) {
    const error = new Error("Invalid coupon");
    error.statusCode = 400;
    throw error;
  }

  if (!coupon.isActive) {
    const error = new Error("Coupon is inactive");
    error.statusCode = 400;
    throw error;
  }

  if (new Date(coupon.expiresAt) <= new Date()) {
    const error = new Error("Coupon has expired");
    error.statusCode = 400;
    throw error;
  }

  if (
    coupon.usageLimit !== null &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    const error = new Error("Coupon usage limit reached");
    error.statusCode = 400;
    throw error;
  }

  if (orderAmount < Number(coupon.minOrderAmount)) {
    const error = new Error(
      `Minimum order amount is ${coupon.minOrderAmount}`
    );
    error.statusCode = 400;
    throw error;
  }

  let discount = 0;

  if (coupon.discountType === "PERCENTAGE") {
    discount =
      (orderAmount * Number(coupon.discountValue)) / 100;

    if (
      coupon.maxDiscount !== null &&
      discount > Number(coupon.maxDiscount)
    ) {
      discount = Number(coupon.maxDiscount);
    }
  } else {
    discount = Number(coupon.discountValue);
  }

  if (discount > orderAmount) {
    discount = orderAmount;
  }

  const finalAmount = orderAmount - discount;

  return {
    couponId: coupon.id,
    code: coupon.code,
    discount,
    finalAmount,
  };
};