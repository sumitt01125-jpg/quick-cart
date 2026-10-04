import express from "express";

import {
  createCategory,
  getCategories,
} from "./categories.controller.js";

import { createCategorySchema } from "./categories.schema.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createCategorySchema),
  createCategory
);

router.get(
  "/",
  getCategories
);

export default router;