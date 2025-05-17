const ProductService = require("../services/products.services");
require("dotenv").config();

//get all product

const getproController = async (req, res) => {
  const result = await ProductService.getProducts(req.body);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};
const getAllProController = async (req, res) => {
  const result = await ProductService.getAllProducts();
  return res.json({
    message: "get all products",
    result,
  });
};

// add product
const addproController = async (req, res) => {
  const result = await ProductService.addProducts(req.body);
  return res.json({
    message: "add products",
    result,
  });
};

//get product by category
const getprobycateController = async (req, res) => {
  const { categoryId } = req.params;
  const result = await ProductService.getProductsbycate(categoryId);
  return res.json({
    message: "get products by category",
    result,
  });
};

// -----------------------------category------------------

// add category
const addcatController = async (req, res) => {
  const result = await ProductService.addCategory(req.body);
  return res.json({
    message: "add category",
    result,
  });
};
//get all category
const getcatController = async (req, res) => {
  const result = await ProductService.getCategory();
  return res.json({
    message: "get all category",
    result,
  });
};

const getcatebynameController = async (req, res) => {
  const { name } = req.body;
  const result = await ProductService.getCategoryByName(name);
  return res.json({
    message: "get category by name",
    result,
  });
};

const getlistcatController = async (req, res) => {
  const result = await ProductService.getListCategory();
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

// -----------------------------orders------------------

const addorderController = async (req, res) => {
  const result = await ProductService.addOrder(req.body);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

const updateOrderController = async (req, res) => {
  const result = await ProductService.updateOrder(req.body);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

const getorderController = async (req, res) => {
  const { user_id } = req.params;
  const result = await ProductService.getOrders(user_id);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

const addCartController = async (req, res) => {
  const result = await ProductService.addCart(req.body);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

const removeCartController = async (req, res) => {
  const result = await ProductService.removeCart(req.body);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

const getCartController = async (req, res) => {
  const { user_id } = req.params;
  console.log(user_id);
  const result = await ProductService.getCart(user_id);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

const updateCartController = async (req, res) => {
  const result = await ProductService.updateCart(req.body);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

const addToWishList = async (req, res) => {
  const result = await ProductService.addToWishlist(req.body);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

const removeWishList = async (req, res) => {
  const result = await ProductService.removeFromWishlist(req.body);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

const getWishList = async (req, res) => {
  const { user_id } = req.params;
  const result = await ProductService.getWishlist(user_id);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

//get product by id
module.exports = {
  getproController,
  addproController,
  addcatController,
  getcatController,
  getprobycateController,
  addorderController,
  getorderController,
  getAllProController,
  getcatebynameController,
  getproController,
  getlistcatController,
  addCartController,
  removeCartController,
  addToWishList,
  removeWishList,
  getWishList,
  getCartController,
  updateCartController,
  updateOrderController,
};
