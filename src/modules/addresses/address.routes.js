import express from "express";

import { createAddress, getAddresses, updateAddress, deleteAddress,
} from "./address.controller.js";

import { createAddressSchema, updateAddressSchema,} from "./address.schema.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get(
  "/",
  getAddresses
);

router.post(
  "/",
  validate(createAddressSchema),
  createAddress
);

router.patch(
  "/:id",
  validate(updateAddressSchema),
  updateAddress
);

router.delete(
  "/:id",
  deleteAddress
);

export default router;