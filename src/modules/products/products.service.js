import { db } from "../../prisma/db.js";

import { getCache, setCache, deleteCachePattern, } from "../../utils/cache.js";

export const createProduct = async (productData) => {
    const category = await db.orm.public.Category
        .where({
            id: productData.categoryId,
        })
        .first();

    if (!category) {
        const error = new Error("Category not found");
        error.statusCode = 404;
        throw error;
    }

    const product = await db.orm.public.Product.create({
        name: productData.name,
        price: productData.price,
        description: productData.description,
        categoryId: productData.categoryId,
    });

    // Product list cache is now outdated
    await deleteCachePattern("products:*");

    return product;
};

export const getProducts = async ({
    page = 1,
    limit = 10,
    search,
    categoryId,
    sort = "newest",
}) => {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const cacheKey = `products:${JSON.stringify({
        page,
        limit,
        search: search || null,
        categoryId: categoryId || null,
        sort,
    })}`;

    // 1. Check Redis first
    const cachedProducts = await getCache(cacheKey);

    if (cachedProducts) {
        console.log("Products served from Redis cache");

        return cachedProducts;
    }

    // 2. Cache miss → query PostgreSQL
    let query = db.orm.public.Product;

    if (search) {
        query = query.where((product) =>
            product.name.ilike(`%${search}%`)
        );
    }

    if (categoryId) {
        query = query.where({
            categoryId: Number(categoryId),
        });
    }

    if (sort === "price_asc") {
        query = query.orderBy((product) =>
            product.price.asc()
        );
    } else if (sort === "price_desc") {
        query = query.orderBy((product) =>
            product.price.desc()
        );
    } else {
        query = query.orderBy((product) =>
            product.createdAt.desc()
        );
    }

    const products = await query
        .limit(limit)
        .offset(skip)
        .all();

    const result = {
        page,
        limit,
        products,
    };

    // 3. Save result in Redis for 5 minutes
    await setCache(cacheKey, result, 300);

    console.log("Products fetched from DB and cached in Redis");

    return result;
};

export const getProductById = async (productId) => {
    const product = await db.orm.public.Product
        .where({
            id: productId,
        })
        .first();

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    return product;
};

export const updateProduct = async (productId, productData) => {
    const existingProduct = await db.orm.public.Product
        .where({
            id: productId,
        })
        .first();

    if (!existingProduct) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    if (productData.categoryId) {
        const category = await db.orm.public.Category
            .where({
                id: productData.categoryId,
            })
            .first();

        if (!category) {
            const error = new Error("Category not found");
            error.statusCode = 404;
            throw error;
        }
    }

    const updatedProduct = await db.orm.public.Product
        .where({
            id: productId,
        })
        .update(productData);

    // Product list cache is now outdated
    await deleteCachePattern("products:*");

    return updatedProduct;
};

export const deleteProduct = async (productId) => {
    const product = await db.orm.public.Product
        .where({
            id: productId,
        })
        .first();

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    await db.orm.public.Product
        .where({
            id: productId,
        })
        .delete();

    // Product list cache is now outdated
    await deleteCachePattern("products:*");

    return {
        message: "Product deleted successfully",
    };
};