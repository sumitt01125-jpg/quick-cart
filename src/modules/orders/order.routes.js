import { Router } from "express";

import { checkout, getOrders, getOrderById, updateOrderStatus,
  cancelOrder,} from "./order.controller.js";

import { checkoutSchema, updateOrderStatusSchema } from "./order.schema.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();

// Checkout
router.post(
  "/checkout",
  authenticate,
  validate(checkoutSchema),
  checkout
);

// Customer order history
router.get(
  "/",
  authenticate,
  getOrders
);

// Customer order details
router.get(
  "/:id",
  authenticate,
  getOrderById
);

// Admin order status update
router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  validate(updateOrderStatusSchema),
  updateOrderStatus
);

// Customer cancellation
router.post(
  "/:id/cancel",
  authenticate,
  cancelOrder
);

export default router;