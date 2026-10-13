import { api } from "./api";

export const getCurrentUser = async () => {
  return api("/users/me");
};

export const updateCurrentUser = async (name) => {
  return api("/users/me", {
    method: "PATCH",
    body: JSON.stringify({
      name,
    }),
  });
};