import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2).max(100),
  price: z.number().positive(),
  description: z.string().min(5).max(500),
  categoryId: z.number().int().positive(),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  price: z.number().positive().optional(),
  description: z.string().min(5).max(500).optional(),
  categoryId: z.number().int().positive().optional(),
});