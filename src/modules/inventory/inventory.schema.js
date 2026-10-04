import { z } from "zod";

export const createInventorySchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().nonnegative(),
});

export const updateInventorySchema = z.object({
  quantity: z.number().int().nonnegative(),
});