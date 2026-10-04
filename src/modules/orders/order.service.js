import { db } from "../../prisma/db.js";

export const checkout = async (userId, checkoutData) => {
  const {
    addressId,
    couponCode,
    paymentMethod,
  } = checkoutData;

  const address = await db.orm.public.Address
    .where({
      id: addressId,
      userId,
    })
    .first();

  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  return await db.transaction(async (tx) => {
    // Get cart
    const cart = await tx.orm.public.Cart
      .where({ userId })
      .first();

    if (!cart) {
      const error = new Error("Cart is empty");
      error.statusCode = 400;
      throw error;
    }

    // Get cart items
    const cartItems = await tx.orm.public.CartItem
      .where({ cartId: cart.id })
      .all();

    if (cartItems.length === 0) {
      const error = new Error("Cart is empty");
      error.statusCode = 400;
      throw error;
    }

    const orderItems = [];
    let subtotal = 0;

    // Validate products and inventory
    for (const cartItem of cartItems) {
      const product = await tx.orm.public.Product
        .where({ id: cartItem.productId })
        .first();

      if (!product) {
        const error = new Error(
          `Product ${cartItem.productId} not found`
        );
        error.statusCode = 404;
        throw error;
      }

      const inventory = await tx.orm.public.Inventory
        .where({ productId: product.id })
        .first();

      if (!inventory) {
        const error = new Error(
          `Inventory not found for ${product.name}`
        );
        error.statusCode = 404;
        throw error;
      }

      if (cartItem.quantity > inventory.quantity) {
        const error = new Error(
          `Insufficient stock for ${product.name}`
        );
        error.statusCode = 400;
        throw error;
      }

      const price = Number(product.price);
      const itemTotal = price * cartItem.quantity;

      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        price,
        quantity: cartItem.quantity,
        itemTotal,
      });
    }

    // Validate coupon
    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      appliedCoupon = await tx.orm.public.Coupon
        .where({
          code: couponCode.toUpperCase(),
        })
        .first();

      if (!appliedCoupon) {
        const error = new Error("Invalid coupon");
        error.statusCode = 400;
        throw error;
      }

      if (!appliedCoupon.isActive) {
        const error = new Error("Coupon is inactive");
        error.statusCode = 400;
        throw error;
      }

      if (new Date(appliedCoupon.expiresAt) <= new Date()) {
        const error = new Error("Coupon has expired");
        error.statusCode = 400;
        throw error;
      }

      if (
        appliedCoupon.usageLimit !== null &&
        appliedCoupon.usedCount >= appliedCoupon.usageLimit
      ) {
        const error = new Error("Coupon usage limit reached");
        error.statusCode = 400;
        throw error;
      }

      if (
        subtotal < Number(appliedCoupon.minOrderAmount)
      ) {
        const error = new Error(
          `Minimum order amount is ${appliedCoupon.minOrderAmount}`
        );
        error.statusCode = 400;
        throw error;
      }

      if (appliedCoupon.discountType === "PERCENTAGE") {
        discount =
          (subtotal * Number(appliedCoupon.discountValue)) / 100;

        if (
          appliedCoupon.maxDiscount !== null &&
          discount > Number(appliedCoupon.maxDiscount)
        ) {
          discount = Number(appliedCoupon.maxDiscount);
        }
      } else {
        discount = Number(appliedCoupon.discountValue);
      }

      if (discount > subtotal) {
        discount = subtotal;
      }
    }

    // Calculate total
    const total = subtotal - discount;

    // Create order
    const order = await tx.orm.public.Order.create({
      userId,
      subtotal,
      discount,
      total,
      addressLabel: address.label,
      fullAddress: address.fullAddress,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      couponCode: appliedCoupon?.code ?? null,
      status: "PLACED",
      paymentStatus: "PENDING",
      paymentMethod,
    });

    // Create order items
    for (const item of orderItems) {
      await tx.orm.public.OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        itemTotal: item.itemTotal,
      });
    }

    // Reduce inventory
    for (const item of orderItems) {
      const inventory = await tx.orm.public.Inventory
        .where({ productId: item.productId })
        .first();

      await tx.orm.public.Inventory
        .where({ productId: item.productId })
        .update({
          quantity: inventory.quantity - item.quantity,
        });
    }

    // Increase coupon usage
    if (appliedCoupon) {
      await tx.orm.public.Coupon
        .where({ id: appliedCoupon.id })
        .update({
          usedCount: appliedCoupon.usedCount + 1,
        });
    }

    // Clear cart
    for (const item of cartItems) {
      await tx.orm.public.CartItem
        .where({ id: item.id })
        .delete();
    }

    return {
      order,
      items: orderItems,
    };
  });
};

export const getOrders = async (userId) => {
  return await db.orm.public.Order
    .where({ userId })
    .orderBy((order) => order.createdAt.desc())
    .all();
};

export const getOrderById = async (userId, orderId) => {
  const order = await db.orm.public.Order
    .where({
      id: orderId,
      userId,
    })
    .first();

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  const items = await db.orm.public.OrderItem
    .where({ orderId })
    .all();

  return {
    order,
    items,
  };
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const order = await db.orm.public.Order
    .where({ id: orderId })
    .first();

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  const allowedTransitions = {
    PLACED: ["CONFIRMED"],
    CONFIRMED: ["PACKING"],
    PACKING: ["READY_FOR_PICKUP"],
    READY_FOR_PICKUP: ["OUT_FOR_DELIVERY"],
    OUT_FOR_DELIVERY: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  if (!allowedTransitions[order.status]?.includes(newStatus)) {
    const error = new Error(
      `Cannot change order status from ${order.status} to ${newStatus}`
    );
    error.statusCode = 400;
    throw error;
  }

  return await db.orm.public.Order
    .where({ id: orderId })
    .update({
      status: newStatus,
    });
};

export const cancelOrder = async (userId, orderId) => {
  return await db.transaction(async (tx) => {
    const order = await tx.orm.public.Order
      .where({
        id: orderId,
        userId,
      })
      .first();

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      throw error;
    }

    const cancellableStatuses = [
      "PLACED",
      "CONFIRMED",
      "PACKING",
    ];

    if (!cancellableStatuses.includes(order.status)) {
      const error = new Error(
        `Order cannot be cancelled when status is ${order.status}`
      );
      error.statusCode = 400;
      throw error;
    }

    // Get ordered items
    const orderItems = await tx.orm.public.OrderItem
      .where({ orderId })
      .all();

    // Restore inventory
    for (const item of orderItems) {
      const inventory = await tx.orm.public.Inventory
        .where({ productId: item.productId })
        .first();

      if (inventory) {
        await tx.orm.public.Inventory
          .where({ productId: item.productId })
          .update({
            quantity: inventory.quantity + item.quantity,
          });
      }
    }

    // Restore coupon usage
    if (order.couponCode) {
      const coupon = await tx.orm.public.Coupon
        .where({ code: order.couponCode })
        .first();

      if (coupon && coupon.usedCount > 0) {
        await tx.orm.public.Coupon
          .where({ id: coupon.id })
          .update({
            usedCount: coupon.usedCount - 1,
          });
      }
    }

    // Cancel order
    const cancelledOrder = await tx.orm.public.Order
      .where({ id: orderId })
      .update({
        status: "CANCELLED",
      });

    return cancelledOrder;
  });
};