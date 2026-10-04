import { checkout as checkoutService,getOrders as getOrdersService,
  getOrderById as getOrderByIdService, updateOrderStatus as updateOrderStatusService, cancelOrder as cancelOrderService,
} from "./order.service.js";

export const checkout = async (req, res, next) => {
  try {
    const result = await checkoutService(
      req.user.userId,
      req.body
    );

    res.status(201).json({
      message: "Order placed successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await getOrdersService(req.user.userId);

    res.status(200).json({
      orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const result = await getOrderByIdService(
      req.user.userId,
      Number(req.params.id)
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await updateOrderStatusService(
      Number(req.params.id),
      req.body.status
    );

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await cancelOrderService(
      req.user.userId,
      Number(req.params.id)
    );

    res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};