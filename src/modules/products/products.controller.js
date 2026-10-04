import { createProduct as createProductService, getProducts as getProductsService,
 getProductById as getProductByIdService,updateProduct as updateProductService,
 deleteProduct as deleteProductService,} from "./products.service.js";

export const createProduct = async (req, res, next) => {
  try {
    const product = await createProductService(req.body);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const result = await getProductsService(req.query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await getProductByIdService(
      Number(req.params.id)
    );

    res.status(200).json({
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await updateProductService(
      Number(req.params.id),
      req.body
    );

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const result = await deleteProductService(
      Number(req.params.id)
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};