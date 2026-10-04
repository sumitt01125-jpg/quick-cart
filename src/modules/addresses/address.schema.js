import { z } from "zod";

export const createAddressSchema = z.object({
  label: z.string().min(2).max(30),
  fullAddress: z.string().min(5).max(200),
  city: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  pincode: z.string().regex(/^\d{6}$/),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = z.object({
  label: z.string().min(2).max(30).optional(),
  fullAddress: z.string().min(5).max(200).optional(),
  city: z.string().min(2).max(50).optional(),
  state: z.string().min(2).max(50).optional(),
  pincode: z.string().regex(/^\d{6}$/).optional(),
  isDefault: z.boolean().optional(),
});