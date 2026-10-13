import { api } from "./api";

export const getAddresses = async () => {
  return api("/addresses");
};

export const createAddress = async (addressData) => {
  return api("/addresses", {
    method: "POST",
    body: JSON.stringify(addressData),
  });
};

export const updateAddress = async (addressId, addressData) => {
  return api(`/addresses/${addressId}`, {
    method: "PATCH",
    body: JSON.stringify(addressData),
  });
};

export const deleteAddress = async (addressId) => {
  return api(`/addresses/${addressId}`, {
    method: "DELETE",
  });
};