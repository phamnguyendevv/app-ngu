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
const paypal = require("paypal-rest-sdk");

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

// const environment = new paypal.core.SandboxEnvironment(
//   "AaNElnE4-lxaR534woRgTLdwbwbEzWiBt_TbcVIjK6refjCgvKN-uJek24RSnSOrV4-eZ_opP-2gMprt",
//   "EMVpAOk9SDTb5l4ktwV3AVUKuTrGgKesovY49wN3kbUjVfy6p6lz1IN3R38e80iu2ZHECrcYDkMOBGxz"
// );

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AaNElnE4-lxaR534woRgTLdwbwbEzWiBt_TbcVIjK6refjCgvKN-uJek24RSnSOrV4-eZ_opP-2gMprt",
  client_secret:
    "EMVpAOk9SDTb5l4ktwV3AVUKuTrGgKesovY49wN3kbUjVfy6p6lz1IN3R38e80iu2ZHECrcYDkMOBGxz",
});

router.post("/order/paypal/create-order/:atm", async (req, res) => {
  try {
    console.log("atm", atm);

    // Create PayPal payment
    const create_payment_json = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url:
          process.env.PAYPAL_RETURN_URL ||
          "http://192.168.1.8:7777/api/v0/order/paypal/success",
        cancel_url:
          process.env.PAYPAL_CANCEL_URL ||
          "http://192.168.1.8:7777/api/v0/order/paypal/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Red Hat",
                sku: "001",
                price: Number(atm).toFixed(2).toString(),
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: Number(atm).toFixed(2).toString(),
          },
          description: "This is the payment description.",
        },
      ],
    };

    console.log(JSON.stringify(create_payment_json, null, 2));

    // Wrap PayPal payment creation in a promise for better error handling
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        console.log("Error creating PayPal payment:", error);
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.redirect(payment.links[i].href);
          }
        }
      }
    });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
});

router.get("/success", (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: amt,
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log("error", error.response);
        throw error;
      } else {
        console.log("Get Payment Response");
        console.log(JSON.stringify(payment));
        res.send("Success");
      }
    }
  );
});

router.get("/order/paypal/cancel", (req, res) => {
  res.send("Cancelled");
});

router.post("/product/wishlist", addToWishList);
router.post("/product/remove-wishlist", removeWishList);
router.get("/product/wishlist/:user_id", getWishList);

module.exports = router;
