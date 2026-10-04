import { addToCart as addToCartService, getCart as getCartService, updateCartItem as updateCartItemService, removeCartItem as removeCartItemService, clearCart as clearCartService,} from "./cart.service.js";

export const addToCart = async (req, res, next) => {
  try {
    const item = await addToCartService(
      req.user.userId,
      req.body
    );

    res.status(201).json({
      message: "Product added to cart",
      item,
    });
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await getCartService(
      req.user.userId
    );

    res.status(200).json({
      cart,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const item = await updateCartItemService(
      req.user.userId,
      Number(req.params.id),
      req.body.quantity
    );

    res.status(200).json({
      message: "Cart item updated",
      item,
    });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const result = await removeCartItemService(
      req.user.userId,
      Number(req.params.id)
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const result = await clearCartService(
      req.user.userId
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};