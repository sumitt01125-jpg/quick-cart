import express from "express";

import { getCurrentUser, updateCurrentUser, } from "./users.controller.js";

import { updateProfileSchema } from "./users.schema.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = express.Router();

router.get(
  "/me",
  authenticate,
  getCurrentUser
);

router.patch(
  "/me",
  authenticate,
  validate(updateProfileSchema),
  updateCurrentUser
);

export default router;