import {addToWishlist as addToWishlistService, getWishlist as getWishlistService,
  removeFromWishlist as removeFromWishlistService,} from "./wishlist.service.js";

export const addToWishlist = async (req, res, next) => {
  try {
    const product = await addToWishlistService(
      req.user.userId,
      Number(req.params.productId)
    );

    res.status(201).json({
      message: "Product added to wishlist",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await getWishlistService(req.user.userId);

    res.status(200).json({
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const result = await removeFromWishlistService(
      req.user.userId,
      Number(req.params.productId)
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};