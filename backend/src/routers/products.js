const {
  getproController,
  addproController,
  addcatController,
  getcatController,
  getprobycateController,
  addorderController,
  getorderController,
  getAllProController,
  getcatebynameController,
  getlistcatController,
  addCartController,

  removeCartController,
  addToWishList,
  removeWishList,
  getWishList,
  getCartController,
  updateCartController,
  updateOrderController,
} = require("../controllers/products.controller");

const express = require("express");
const router = express.Router();

router.post("/addproducts", addproController);
router.post("/product/list", getproController);
router.get("/get-all-products", getAllProController);
router.get("/getprobycate/:categoryId", getprobycateController);

// -------------------categoris----------------

router.post("/addcategoris", addcatController);
router.get("/getcategoris", getcatController);
router.get("/category", getcatebynameController);
router.get("/category/list", getlistcatController);

// -------------------------orders-------------------

router.post("/cart/add", addCartController);
router.post("/cart/remove-item", removeCartController);
router.get("/cart/:user_id", getCartController);
router.post("/cart/update", updateCartController);

router.get("/order/:user_id", getorderController);
router.post("/order/add", addorderController);
router.post("/order/update", updateOrderController);

router.post("/product/wishlist", addToWishList);
router.post("/product/remove-wishlist", removeWishList);
router.get("/product/wishlist/:user_id", getWishList);

module.exports = router;
