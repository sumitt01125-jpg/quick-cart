import { reorder as reorderService } from "./reorder.service.js";

export const reorder = async (req, res, next) => {
  try {
    const result = await reorderService(
      req.user.userId,
      Number(req.params.orderId)
    );

    res.status(200).json({
      message: "Order items added to cart successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};