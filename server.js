import "dotenv/config";

import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";

import { connectRedis } from "./src/config/redis.js";
import { logger } from "./src/utils/logger.js";
import { swaggerSpec } from "./src/config/swagger.js";

import { apiRateLimiter } from "./src/middlewares/rateLimit.middleware.js";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";

import authRoutes from "./src/modules/auth/auth.routes.js";
import usersRoutes from "./src/modules/users/users.routes.js";
import adminRoutes from "./src/modules/admin/admin.routes.js";
import categoriesRoutes from "./src/modules/categories/categories.routes.js";
import productsRoutes from "./src/modules/products/products.routes.js";
import cartRoutes from "./src/modules/cart/cart.routes.js";
import inventoryRoutes from "./src/modules/inventory/inventory.routes.js";
import addressRoutes from "./src/modules/addresses/address.routes.js";
import couponRoutes from "./src/modules/coupons/coupon.routes.js";
import orderRoutes from "./src/modules/orders/order.routes.js";
import wishlistRoutes from "./src/modules/wishlist/wishlist.routes.js";
import reorderRoutes from "./src/modules/reorder/reorder.routes.js";

const app = express();

const PORT = process.env.PORT || 3000;

// Request Logger

app.use(
    pinoHttp({
        logger,
    })
);

// Security Middleware

app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3001",
        credentials: true,
    })
);

// Basic Middleware

app.use(express.json({ limit: "1mb" }));

app.use(cookieParser());

// Global API Rate Limiter

app.use("/api", apiRateLimiter);

// Swagger API Documentation

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reorder", reorderRoutes);

// Health Check

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Quick-Cart API is Healthy",
    });
});

// Root Route

app.get("/", (req, res) => {
    res.end("Quick-Cart API is running on server!!!");
});

// Test Route

app.post("/users", (req, res) => {
    console.log(req.body);

    res.json({
        message: "User Received",
        data: req.body,
    });
});

// Test Error Route

app.get("/test-error", (req, res, next) => {
    const error = new Error("Something went wrong");

    next(error);
});

// Centralized Error Middleware

app.use(errorMiddleware);

// Start Server

const startServer = async () => {
    try {
        await connectRedis();

        app.listen(PORT, () => {
            logger.info(
                `Quick-Cart server is running on port ${PORT}`
            );
        });
    } catch (error) {
        logger.error(error, "Failed to start server");

        process.exit(1);
    }
};

startServer();