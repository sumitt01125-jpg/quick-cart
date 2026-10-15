import "dotenv/config";
import { db } from "./src/prisma/db.js";

try {
    const result = await db.$queryRaw`SELECT 1`;
    console.log("✅ Database connected successfully:", result);
} catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exitCode = 1;
}