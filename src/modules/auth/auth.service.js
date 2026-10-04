import argon2 from "argon2";
import jwt from "jsonwebtoken";

import { db } from "../../prisma/db.js";

export const registerUser = async (userData) => {
  // Check if email already exists
  const existingUser = await db.orm.public.User
    .where({
      email: userData.email,
    })
    .first();

  if (existingUser) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const passwordHash = await argon2.hash(userData.password);

  // Create user
  const user = await db.orm.public.User.create({
    name: userData.name,
    email: userData.email,
    passwordHash,
  });

  // Return safe user data
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const loginUser = async (userData) => {
  // Find user by email
  const user = await db.orm.public.User
    .where({
      email: userData.email,
    })
    .first();

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Verify password
  const isPasswordValid = await argon2.verify(
    user.passwordHash,
    userData.password
  );

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Generate JWT
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  // Return safe data
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};