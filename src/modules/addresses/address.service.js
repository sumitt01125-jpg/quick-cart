import { db } from "../../prisma/db.js";

export const createAddress = async (userId, addressData) => {
  if (addressData.isDefault) {
    await db.orm.public.Address
      .where({
        userId,
      })
      .update({
        isDefault: false,
      });
  }

  const existingAddresses = await db.orm.public.Address
    .where({
      userId,
    })
    .all();

  const shouldBeDefault =
    addressData.isDefault || existingAddresses.length === 0;

  return await db.orm.public.Address.create({
    userId,
    label: addressData.label,
    fullAddress: addressData.fullAddress,
    city: addressData.city,
    state: addressData.state,
    pincode: addressData.pincode,
    isDefault: shouldBeDefault,
  });
};

export const getAddresses = async (userId) => {
  return await db.orm.public.Address
    .where({
      userId,
    })
    .all();
};

export const updateAddress = async (
  userId,
  addressId,
  addressData
) => {
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

  if (addressData.isDefault) {
    await db.orm.public.Address
      .where({
        userId,
      })
      .update({
        isDefault: false,
      });
  }

  return await db.orm.public.Address
    .where({
      id: addressId,
    })
    .update(addressData);
};

export const deleteAddress = async (
  userId,
  addressId
) => {
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

  await db.orm.public.Address
    .where({
      id: addressId,
    })
    .delete();

  return {
    message: "Address deleted successfully",
  };
};