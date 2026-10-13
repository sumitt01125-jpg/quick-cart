import { redisClient } from "../config/redis.js";

export const getCache = async (key) => {
    try {
        if (!redisClient.isReady) {
            return null;
        }

        const data = await redisClient.get(key);

        if (!data) {
            return null;
        }

        return JSON.parse(data);
    } catch (error) {
        console.warn("Redis cache read failed:", error.message);
        return null;
    }
};

export const setCache = async (key, data, ttl = 300) => {
    try {
        if (!redisClient.isReady) {
            return;
        }

        await redisClient.set(key, JSON.stringify(data), {
            EX: ttl,
        });
    } catch (error) {
        console.warn("Redis cache write failed:", error.message);
    }
};

export const deleteCache = async (key) => {
    try {
        if (!redisClient.isReady) {
            return;
        }

        await redisClient.del(key);
    } catch (error) {
        console.warn("Redis cache deletion failed:", error.message);
    }
};

export const deleteCachePattern = async (pattern) => {
    try {
        if (!redisClient.isReady) {
            return;
        }

        for await (const keys of redisClient.scanIterator({
            MATCH: pattern,
            COUNT: 100,
        })) {
            if (keys.length > 0) {
                await redisClient.del(keys);
            }
        }
    } catch (error) {
        console.warn("Redis cache invalidation failed:", error.message);
    }
};