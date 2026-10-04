import { redisClient } from "../config/redis.js";

export const getCache = async (key) => {
    const data = await redisClient.get(key);

    if (!data) {
        return null;
    }

    return JSON.parse(data);
};

export const setCache = async (key, data, ttl = 300) => {
    await redisClient.set(key, JSON.stringify(data), {
        EX: ttl,
    });
};

export const deleteCache = async (key) => {
    await redisClient.del(key);
};

export const deleteCachePattern = async (pattern) => {
    for await (const keys of redisClient.scanIterator({
        MATCH: pattern,
        COUNT: 100,
    })) {
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    }
};