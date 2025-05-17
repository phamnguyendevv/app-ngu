const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

var ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    rating: {
      type: Number,
    },
    price: {
      type: Number,
    },
    image: {
      type: String,
    },
    carouselImages: {
      type: Array,
    },
    isNewProduct: {
      type: Boolean,
    },
    isPopular: {
      type: Boolean,
    },
    isMan: {
      type: Boolean,
    },
    description: {
      type: String,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category ",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, ProductSchema);
