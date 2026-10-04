import { createAddress as createAddressService, getAddresses as getAddressesService,
  updateAddress as updateAddressService, deleteAddress as deleteAddressService,
} from "./address.service.js";

export const createAddress = async (req, res, next) => {
  try {
    const address = await createAddressService(
      req.user.userId,
      req.body
    );

    res.status(201).json({
      message: "Address created successfully",
      address,
    });
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await getAddressesService(
      req.user.userId
    );

    res.status(200).json({
      addresses,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const address = await updateAddressService(
      req.user.userId,
      Number(req.params.id),
      req.body
    );

    res.status(200).json({
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const result = await deleteAddressService(
      req.user.userId,
      Number(req.params.id)
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};