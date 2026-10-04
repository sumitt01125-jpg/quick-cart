import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "QuickCart API",
            version: "1.0.0",
            description: "QuickCart Quick-Commerce Backend API",
        },

        servers: [
            {
                url: "http://localhost:3000",
            },
        ],

        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "accessToken",
                },
            },
        },

        paths: {
            "/api/auth/register": {
                post: {
                    summary: "Register a new customer",
                    tags: ["Auth"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["name", "email", "password"],
                                    properties: {
                                        name: {
                                            type: "string",
                                            example: "Sumit",
                                        },
                                        email: {
                                            type: "string",
                                            example: "user@example.com",
                                        },
                                        password: {
                                            type: "string",
                                            example: "Password@123",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: "User registered successfully",
                        },
                        409: {
                            description: "Email already exists",
                        },
                    },
                },
            },

            "/api/auth/login": {
                post: {
                    summary: "Login user",
                    tags: ["Auth"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["email", "password"],
                                    properties: {
                                        email: {
                                            type: "string",
                                            example: "user@example.com",
                                        },
                                        password: {
                                            type: "string",
                                            example: "Password@123",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "Login successful",
                        },
                        401: {
                            description: "Invalid credentials",
                        },
                    },
                },
            },

            "/api/products": {
                get: {
                    summary: "Get products",
                    tags: ["Products"],
                    parameters: [
                        {
                            name: "page",
                            in: "query",
                            schema: {
                                type: "integer",
                                default: 1,
                            },
                        },
                        {
                            name: "limit",
                            in: "query",
                            schema: {
                                type: "integer",
                                default: 10,
                            },
                        },
                        {
                            name: "search",
                            in: "query",
                            schema: {
                                type: "string",
                            },
                        },
                        {
                            name: "categoryId",
                            in: "query",
                            schema: {
                                type: "integer",
                            },
                        },
                        {
                            name: "sort",
                            in: "query",
                            schema: {
                                type: "string",
                                enum: [
                                    "newest",
                                    "price_asc",
                                    "price_desc",
                                ],
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: "Products fetched successfully",
                        },
                    },
                },
            },

            "/api/cart": {
                get: {
                    summary: "Get current user's cart",
                    tags: ["Cart"],
                    security: [{ cookieAuth: [] }],
                    responses: {
                        200: {
                            description: "Cart fetched successfully",
                        },
                    },
                },

                delete: {
                    summary: "Clear current user's cart",
                    tags: ["Cart"],
                    security: [{ cookieAuth: [] }],
                    responses: {
                        200: {
                            description: "Cart cleared successfully",
                        },
                    },
                },
            },

            "/api/cart/items": {
                post: {
                    summary: "Add product to cart",
                    tags: ["Cart"],
                    security: [{ cookieAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["productId", "quantity"],
                                    properties: {
                                        productId: {
                                            type: "integer",
                                            example: 2,
                                        },
                                        quantity: {
                                            type: "integer",
                                            example: 2,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: "Product added to cart",
                        },
                    },
                },
            },

            "/api/orders/checkout": {
                post: {
                    summary: "Place an order",
                    tags: ["Orders"],
                    security: [{ cookieAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: [
                                        "addressId",
                                        "paymentMethod",
                                    ],
                                    properties: {
                                        addressId: {
                                            type: "integer",
                                            example: 1,
                                        },
                                        couponCode: {
                                            type: "string",
                                            example: "SAVE10",
                                        },
                                        paymentMethod: {
                                            type: "string",
                                            enum: ["COD"],
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: "Order placed successfully",
                        },
                    },
                },
            },

            "/api/orders": {
                get: {
                    summary: "Get current user's orders",
                    tags: ["Orders"],
                    security: [{ cookieAuth: [] }],
                    responses: {
                        200: {
                            description: "Orders fetched successfully",
                        },
                    },
                },
            },
        },
    },

    apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);