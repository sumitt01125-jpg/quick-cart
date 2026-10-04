import express from "express";

import { createCoupon, getCoupons, updateCoupon, deleteCoupon,
 validateCoupon,} from "./coupon.controller.js";

import { createCouponSchema, updateCouponSchema,
 validateCouponSchema,} from "./coupon.schema.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = express.Router();

// Admin routes
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createCouponSchema),
  createCoupon
);

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getCoupons
);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(updateCouponSchema),
  updateCoupon
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteCoupon
);

// Customer route
router.post(
  "/validate",
  authenticate,
  validate(validateCouponSchema),
  validateCoupon
);

export default router;