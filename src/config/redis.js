import { createClient } from "redis";

export const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    socket: {
        reconnectStrategy: false,
    },
});

redisClient.on("error", (error) => {
    console.error("Redis Client Error:", error.message);
});

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        try {
            await redisClient.connect();
            console.log("Redis connected successfully");
        } catch (error) {
            console.warn(
                "Redis unavailable. Continuing without Redis:",
                error.message
            );
        }
    }
};