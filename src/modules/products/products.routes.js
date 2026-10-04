import express from "express";

import { createProduct, getProducts, getProductById, updateProduct,
  deleteProduct,} from "./products.controller.js";

import { createProductSchema, updateProductSchema,} from "./products.schema.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = express.Router();

// Public
router.get("/", getProducts);

router.get("/:id", getProductById);

// Admin
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createProductSchema),
  createProduct
);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(updateProductSchema),
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteProduct
);

export default router;