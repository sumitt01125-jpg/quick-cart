import {createCoupon as createCouponService,getCoupons as getCouponsService,
  updateCoupon as updateCouponService,deleteCoupon as deleteCouponService,
  validateCoupon as validateCouponService,} from "./coupon.service.js";

export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await createCouponService(req.body);

    res.status(201).json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    next(error);
  }
};

export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await getCouponsService();

    res.status(200).json({
      coupons,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await updateCouponService(
      Number(req.params.id),
      req.body
    );

    res.status(200).json({
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const result = await deleteCouponService(
      Number(req.params.id)
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const validateCoupon = async (req, res, next) => {
  try {
    const result = await validateCouponService(
      req.body.code,
      req.body.orderAmount
    );

    res.status(200).json({
      message: "Coupon applied successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};