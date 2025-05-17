const mongoose = require("mongoose");

const DOCUMENT_NAME = "Wishlist";
const COLLECTION_NAME = "Wishlists";

const WishlistSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Tham chiếu đến model User
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product", // Tham chiếu đến model Product
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, WishlistSchema);
