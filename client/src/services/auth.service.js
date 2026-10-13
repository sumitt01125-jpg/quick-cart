import { api } from "./api";

export const loginUser = async (email, password) => {
  return api("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const registerUser = async (name, email, password) => {
  return api("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
};

export const logoutUser = async () => {
  return api("/auth/logout", {
    method: "POST",
  });
};

export const getCurrentUser = async () => {
  return api("/users/me");
};