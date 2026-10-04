import { z } from "zod";

export const createCouponSchema = z.object({
  code: z.string().min(3).max(30).toUpperCase(),

  discountType: z.enum(["PERCENTAGE", "FIXED"]),

  discountValue: z.number().positive(),

  minOrderAmount: z.number().nonnegative().optional(),

  maxDiscount: z.number().positive().optional(),

  expiresAt: z.string().datetime(),

  usageLimit: z.number().int().positive().optional(),

  isActive: z.boolean().optional(),
});

export const updateCouponSchema = z.object({
  code: z.string().min(3).max(30).toUpperCase().optional(),

  discountType: z.enum(["PERCENTAGE", "FIXED"]).optional(),

  discountValue: z.number().positive().optional(),

  minOrderAmount: z.number().nonnegative().optional(),

  maxDiscount: z.number().positive().optional(),

  expiresAt: z.string().datetime().optional(),

  usageLimit: z.number().int().positive().optional(),

  isActive: z.boolean().optional(),
});

export const validateCouponSchema = z.object({
  code: z.string().min(3).max(30),

  orderAmount: z.number().positive(),
});