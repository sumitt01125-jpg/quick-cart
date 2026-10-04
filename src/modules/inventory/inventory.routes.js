import express from "express";

import { createInventory, getInventory, updateInventory,} from "./inventory.controller.js";

import {createInventorySchema,updateInventorySchema,} from "./inventory.schema.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createInventorySchema),
  createInventory
);

router.get(
  "/:productId",
  getInventory
);

router.patch(
  "/:productId",
  authenticate,
  authorize("ADMIN"),
  validate(updateInventorySchema),
  updateInventory
);

export default router;