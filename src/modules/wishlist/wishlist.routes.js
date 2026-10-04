import { Router } from "express";

import { addToWishlist, getWishlist,
  removeFromWishlist, } from "./wishlist.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/:productId", authenticate, addToWishlist);

router.get("/", authenticate, getWishlist);

router.delete("/:productId", authenticate, removeFromWishlist);

export default router;