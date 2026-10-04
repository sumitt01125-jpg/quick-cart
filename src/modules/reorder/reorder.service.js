import { db } from "../../prisma/db.js";

export const reorder = async (userId, orderId) => {
  const order = await db.orm.public.Order
    .where({ id: orderId, userId })
    .first();

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.status !== "DELIVERED") {
    const error = new Error("Only delivered orders can be reordered");
    error.statusCode = 400;
    throw error;
  }

  const orderItems = await db.orm.public.OrderItem
    .where({ orderId })
    .all();

  if (orderItems.length === 0) {
    const error = new Error("Order has no items");
    error.statusCode = 400;
    throw error;
  }

  let cart = await db.orm.public.Cart
    .where({ userId })
    .first();

  if (!cart) {
    cart = await db.orm.public.Cart.create({
      userId,
    });
  }

  const addedItems = [];
  const skippedItems = [];

  for (const orderItem of orderItems) {
    const product = await db.orm.public.Product
      .where({ id: orderItem.productId })
      .first();

    if (!product) {
      skippedItems.push({
        productId: orderItem.productId,
        reason: "Product no longer exists",
      });
      continue;
    }

    const inventory = await db.orm.public.Inventory
      .where({ productId: product.id })
      .first();

    if (!inventory || inventory.quantity <= 0) {
      skippedItems.push({
        productId: product.id,
        productName: product.name,
        reason: "Product is out of stock",
      });
      continue;
    }

    const existingItem = await db.orm.public.CartItem
      .where({
        cartId: cart.id,
        productId: product.id,
      })
      .first();

    const quantityToAdd = Math.min(
      orderItem.quantity,
      inventory.quantity
    );

    if (existingItem) {
      const availableQuantity = Math.max(
        0,
        inventory.quantity - existingItem.quantity
      );

      if (availableQuantity === 0) {
        skippedItems.push({
          productId: product.id,
          productName: product.name,
          reason: "Cart already has maximum available quantity",
        });
        continue;
      }

      const quantityToUpdate = Math.min(
        orderItem.quantity,
        availableQuantity
      );

      const updatedItem = await db.orm.public.CartItem
        .where({ id: existingItem.id })
        .update({
          quantity: existingItem.quantity + quantityToUpdate,
        });

      addedItems.push({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
        },
        quantity: quantityToUpdate,
        cartItem: updatedItem,
      });

      continue;
    }

    const cartItem = await db.orm.public.CartItem.create({
      cartId: cart.id,
      productId: product.id,
      quantity: quantityToAdd,
    });

    addedItems.push({
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
      },
      quantity: quantityToAdd,
      cartItem,
    });
  }

  return {
    cartId: cart.id,
    addedItems,
    skippedItems,
  };
};