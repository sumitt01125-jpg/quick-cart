export const errorMiddleware = (err, req, res, next) => {
    req.log?.error(err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message:
            process.env.NODE_ENV === "production" && statusCode === 500
                ? "Internal Server Error"
                : err.message || "Internal Server Error",
    });
};