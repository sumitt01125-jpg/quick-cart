import express from "express";

import { registerUser, loginUser, logoutUser, } from "./auth.controller.js";

import { registerSchema, loginSchema, } from "./auth.schema.js";

import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

import { authRateLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = express.Router();

// Register

router.post(
    "/register",
    authRateLimiter,
    validate(registerSchema),
    registerUser
);

// Login

router.post(
    "/login",
    authRateLimiter,
    validate(loginSchema),
    loginUser
);

// Protected user route

router.get(
    "/me",
    authenticate,
    (req, res) => {
        res.status(200).json({
            message: "You are authenticated",
            user: req.user,
        });
    }
);

// Logout

router.post(
    "/logout",
    logoutUser
);

export default router;