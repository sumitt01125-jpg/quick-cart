import {
    registerUser as registerUserService,
    loginUser as loginUserService,
} from "./auth.service.js";

export const registerUser = async (req, res, next) => {
    try {
        const result = await registerUserService(req.body);

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const result = await loginUserService(req.body);

        res.cookie("accessToken", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful",
            user: result.user,
        });
    } catch (error) {
        next(error);
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });

    res.status(200).json({
        message: "Logout successful",
    });
};

