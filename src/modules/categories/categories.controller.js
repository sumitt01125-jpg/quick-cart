import {
  createCategory as createCategoryService,
  getCategories as getCategoriesService,
} from "./categories.service.js";

export const createCategory = async (req, res, next) => {
  try {
    const category = await createCategoryService(req.body);

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await getCategoriesService();

    res.status(200).json({
      categories,
    });
  } catch (error) {
    next(error);
  }
};