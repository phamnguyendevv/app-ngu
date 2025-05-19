const mongoose = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
          },
          priceAtOrder: {
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"],
          },
        },
      ],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Order must contain at least one product",
      },
    },
    deliveryFee: {
      type: Number,
      required: true,
      min: [0, "Delivery fee cannot be negative"],
      default: 25.0, // Giá trị mặc định, có thể thay đổi theo logic
    },
    payment: {
      type: String,
      required: true,
      enum: ["Cash", "PayPal"],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative"],
    },
    shippingAddress: {
      name: { type: String, required: true },
      number: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      address: { type: String, required: true },
      type: {
        type: String,
      },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = mongoose.model(DOCUMENT_NAME, orderSchema, COLLECTION_NAME);
