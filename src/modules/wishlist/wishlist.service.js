import { db } from "../../prisma/db.js";

export const addToWishlist = async (userId, productId) => {
  const product = await db.orm.public.Product
    .where({ id: productId })
    .first();

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const existingItem = await db.orm.public.WishlistItem
    .where({ userId, productId })
    .first();

  if (existingItem) {
    const error = new Error("Product already exists in wishlist");
    error.statusCode = 409;
    throw error;
  }

  return await db.orm.public.WishlistItem.create({
    userId,
    productId,
  });
};

export const getWishlist = async (userId) => {
  const wishlistItems = await db.orm.public.WishlistItem
    .where({ userId })
    .all();

  const wishlist = [];

  for (const item of wishlistItems) {
    const product = await db.orm.public.Product
      .where({ id: item.productId })
      .first();

    if (!product) {
      continue;
    }

    wishlist.push({
      id: item.id,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
      },
      createdAt: item.createdAt,
    });
  }

  return wishlist;
};

export const removeFromWishlist = async (userId, productId) => {
  const wishlistItem = await db.orm.public.WishlistItem
    .where({ userId, productId })
    .first();

  if (!wishlistItem) {
    const error = new Error("Product not found in wishlist");
    error.statusCode = 404;
    throw error;
  }

  await db.orm.public.WishlistItem
    .where({ id: wishlistItem.id })
    .delete();

  return {
    message: "Product removed from wishlist",
  };
};