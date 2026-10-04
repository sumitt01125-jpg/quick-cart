import { db } from "../../prisma/db.js";

const getOrCreateCart = async (userId) => {
  let cart = await db.orm.public.Cart
    .where({
      userId,
    })
    .first();

  if (!cart) {
    cart = await db.orm.public.Cart.create({
      userId,
    });
  }

  return cart;
};

export const addToCart = async (userId, cartData) => {
  const product = await db.orm.public.Product
    .where({
      id: cartData.productId,
    })
    .first();

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const inventory = await db.orm.public.Inventory
    .where({
      productId: cartData.productId,
    })
    .first();

  if (!inventory) {
    const error = new Error("Inventory not found");
    error.statusCode = 404;
    throw error;
  }

  const cart = await getOrCreateCart(userId);

  const existingItem = await db.orm.public.CartItem
    .where({
      cartId: cart.id,
      productId: cartData.productId,
    })
    .first();

  if (existingItem) {
    const newQuantity =
      existingItem.quantity + cartData.quantity;

    if (newQuantity > inventory.quantity) {
      const error = new Error("Insufficient stock");
      error.statusCode = 400;
      throw error;
    }

    const updatedItem = await db.orm.public.CartItem
      .where({
        id: existingItem.id,
      })
      .update({
        quantity: newQuantity,
      });

    return updatedItem;
  }

  if (cartData.quantity > inventory.quantity) {
    const error = new Error("Insufficient stock");
    error.statusCode = 400;
    throw error;
  }

  const item = await db.orm.public.CartItem.create({
    cartId: cart.id,
    productId: cartData.productId,
    quantity: cartData.quantity,
  });

  return item;
};

export const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);

  const items = await db.orm.public.CartItem
    .where({
      cartId: cart.id,
    })
    .all();

  let total = 0;
  const cartItems = [];

  for (const item of items) {
    const product = await db.orm.public.Product
      .where({
        id: item.productId,
      })
      .first();

    if (!product) continue;

    const itemTotal = Number(product.price) * item.quantity;

    total += itemTotal;

    cartItems.push({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
      },
      itemTotal,
    });
  }

  return {
    cartId: cart.id,
    items: cartItems,
    total,
  };
};

export const updateCartItem = async (
  userId,
  itemId,
  quantity
) => {
  const cart = await getOrCreateCart(userId);

  const item = await db.orm.public.CartItem
    .where({
      id: itemId,
      cartId: cart.id,
    })
    .first();

  if (!item) {
    const error = new Error("Cart item not found");
    error.statusCode = 404;
    throw error;
  }

  const inventory = await db.orm.public.Inventory
    .where({
      productId: item.productId,
    })
    .first();

  if (!inventory) {
    const error = new Error("Inventory not found");
    error.statusCode = 404;
    throw error;
  }

  if (quantity > inventory.quantity) {
    const error = new Error("Insufficient stock");
    error.statusCode = 400;
    throw error;
  }

  return await db.orm.public.CartItem
    .where({
      id: itemId,
    })
    .update({
      quantity,
    });
};

export const removeCartItem = async (
  userId,
  itemId
) => {
  const cart = await getOrCreateCart(userId);

  const item = await db.orm.public.CartItem
    .where({
      id: itemId,
      cartId: cart.id,
    })
    .first();

  if (!item) {
    const error = new Error("Cart item not found");
    error.statusCode = 404;
    throw error;
  }

  await db.orm.public.CartItem
    .where({
      id: itemId,
    })
    .delete();

  return {
    message: "Cart item removed successfully",
  };
};

export const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);

  const items = await db.orm.public.CartItem
    .where({
      cartId: cart.id,
    })
    .all();

  for (const item of items) {
    await db.orm.public.CartItem
      .where({
        id: item.id,
      })
      .delete();
  }

  return {
    message: "Cart cleared successfully",
  };
};