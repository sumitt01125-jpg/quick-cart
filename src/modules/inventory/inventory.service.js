import { db } from "../../prisma/db.js";

export const createInventory = async (inventoryData) => {
  const product = await db.orm.public.Product
    .where({
      id: inventoryData.productId,
    })
    .first();

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const existingInventory = await db.orm.public.Inventory
    .where({
      productId: inventoryData.productId,
    })
    .first();

  if (existingInventory) {
    const error = new Error("Inventory already exists");
    error.statusCode = 409;
    throw error;
  }

  return await db.orm.public.Inventory.create({
    productId: inventoryData.productId,
    quantity: inventoryData.quantity,
  });
};

export const getInventory = async (productId) => {
  const inventory = await db.orm.public.Inventory
    .where({
      productId,
    })
    .first();

  if (!inventory) {
    const error = new Error("Inventory not found");
    error.statusCode = 404;
    throw error;
  }

  return inventory;
};

export const updateInventory = async (
  productId,
  quantity
) => {
  const inventory = await db.orm.public.Inventory
    .where({
      productId,
    })
    .first();

  if (!inventory) {
    const error = new Error("Inventory not found");
    error.statusCode = 404;
    throw error;
  }

  return await db.orm.public.Inventory
    .where({
      productId,
    })
    .update({
      quantity,
    });
};