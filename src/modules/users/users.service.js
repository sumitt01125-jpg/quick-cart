import { db } from "../../prisma/db.js";

export const getCurrentUser = async (userId) => {
  const user = await db.orm.public.User
    .where({
      id: userId,
    })
    .first();

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const updateCurrentUser = async (userId, userData) => {
  const user = await db.orm.public.User
    .where({
      id: userId,
    })
    .first();

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const updatedUser = await db.orm.public.User
    .where({
      id: userId,
    })
    .update({
      name: userData.name,
    });

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  };
};