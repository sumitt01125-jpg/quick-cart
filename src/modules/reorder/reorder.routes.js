import { Router } from "express";

import { reorder } from "./reorder.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/:orderId", authenticate, reorder);

export default router;