import { db } from "../../prisma/db.js";

export const createCategory = async (categoryData) => {
  const existingCategory = await db.orm.public.Category
    .where({
      name: categoryData.name,
    })
    .first();

  if (existingCategory) {
    const error = new Error("Category already exists");
    error.statusCode = 409;
    throw error;
  }

  const category = await db.orm.public.Category.create({
    name: categoryData.name,
  });

  return {
    id: category.id,
    name: category.name,
  };
};

export const getCategories = async () => {
  const categories = await db.orm.public.Category
    .orderBy((category) => category.name.asc())
    .all();

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));
};