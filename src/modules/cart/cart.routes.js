import express from "express";

import { addToCart, getCart, updateCartItem, removeCartItem, clearCart,} from "./cart.controller.js";

import { addToCartSchema, updateCartItemSchema,} from "./cart.schema.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get(
  "/",
  getCart
);

router.post(
  "/items",
  validate(addToCartSchema),
  addToCart
);

router.patch(
  "/items/:id",
  validate(updateCartItemSchema),
  updateCartItem
);

router.delete(
  "/items/:id",
  removeCartItem
);

router.delete(
  "/",
  clearCart
);

export default router;