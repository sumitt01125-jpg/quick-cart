import { z } from "zod";

export const checkoutSchema = z.object({
  addressId: z.number().int().positive(),

  couponCode: z.string().min(3).max(30).optional(),

  paymentMethod: z.enum(["COD"]),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([ "PLACED", "CONFIRMED", "PACKING", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY",
    "DELIVERED", "CANCELLED",
   ]),
});