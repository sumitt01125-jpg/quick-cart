import { createInventory as createInventoryService, getInventory as getInventoryService,
  updateInventory as updateInventoryService,} from "./inventory.service.js";

export const createInventory = async (req, res, next) => {
  try {
    const inventory = await createInventoryService(req.body);

    res.status(201).json({
      message: "Inventory created successfully",
      inventory,
    });
  } catch (error) {
    next(error);
  }
};

export const getInventory = async (req, res, next) => {
  try {
    const inventory = await getInventoryService(
      Number(req.params.productId)
    );

    res.status(200).json({
      inventory,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInventory = async (req, res, next) => {
  try {
    const inventory = await updateInventoryService(
      Number(req.params.productId),
      req.body.quantity
    );

    res.status(200).json({
      message: "Inventory updated successfully",
      inventory,
    });
  } catch (error) {
    next(error);
  }
};