const ProductModel = require("../models/product.model");
const CategoriesModel = require("../models/category.model");
const usersModel = require("../models/user.model");
const OrderModel = require("../models/order.model");
const WishlistModel = require("../models/wishlist.model");
const CartModel = require("../models/cart.model");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const ProductService = {
  //GET ALL PRODUCTS
  async getProducts(data) {
    const { keyword, isMan, isNewProduct, isPopular, category_id } = data;

    try {
      let query = {};
      if (keyword) {
        query.name = { $regex: keyword, $options: "i" };
      }
      if (isMan) {
        query.isMan = isMan;
      }
      if (isNewProduct) {
        query.isNewProduct = isNewProduct;
      }
      if (isPopular) {
        query.isPopular = isPopular;
      }
      if (category_id) {
        query.category_id = new ObjectId(category_id);
      }

      const products = await ProductModel.find(query);
      console.log("get product success");
      return {
        message: "Lấy sản phẩm thành công",
        data: products,
        status: 200,
      };
    } catch (error) {
      return {
        message: "Lỗi khi lấy sản phẩm",
        status: 500,
      };
    }
  },

  //GET ALL PRODUCTS
  async getAllProducts() {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error) {
      throw new Error("Không lấy được sản phẩm");
    }
  },

  //ADD PRODUCT
  async addProducts(payload) {
    const {
      name,
      price,
      image,
      carouselImages,
      isNewProduct,
      isPopular,
      isMan,
      rating,
      category_id,
      description,
    } = payload;

    console.log("Input category_id:", category_id); // Log the input

    try {
      const newProduct = await ProductModel.create({
        name,
        price,
        isNewProduct,
        isPopular,
        isMan,
        image,
        rating,
        description,
        carouselImages,
        category_id: new ObjectId(category_id),
      });
      return newProduct;
    } catch (error) {
      console.log("error adding product", error);
      throw new Error("Không thêm được sản phẩm");
    }
  },

  // ------------------category----------------------

  //ADD CATEGORY
  async addCategory(payload) {
    const { name, image } = payload;
    try {
      const newCategory = await CategoriesModel.create({
        name,
        image,
      });
      console.log("newCategory add success");
    } catch (error) {
      console.log("error adding category", error);
      throw new Error("Không thêm được danh mục");
    }
  },
  async getCategory() {
    try {
      const category = await CategoriesModel.find();
      return category;
    } catch (error) {
      throw new Error("Không lấy được danh mục");
    }
  },
  async getCategoryByName(name) {
    try {
      const category = await CategoriesModel.findOne({ name });
      return category;
    } catch (error) {
      throw new Error("Không lấy được danh mục");
    }
  },

  async getListCategory() {
    try {
      const categories = await CategoriesModel.find();
      console.log(" List categories");
      return {
        message: "Lấy danh sách danh mục thành công",
        data: categories,
        status: 200,
      };
    } catch (error) {
      return {
        message: "Không lấy được danh mục sản phẩm",
        status: 500,
      };
    }
  },

  addCart: async (payload) => {
    const { user_id, product_id, quantity } = payload;
    try {
      const user = await usersModel.findById(user_id);
      if (!user) {
        return {
          message: "User not found",
          status: 404,
        };
      }

      const product = await ProductModel.findById(product_id);
      if (!product) {
        return {
          message: "Product not found",
          status: 404,
        };
      }
      let cart = await CartModel.findOne({ user: user_id });

      if (!cart) {
        // Nếu chưa có giỏ hàng, tạo mới
        cart = new CartModel({
          user: user_id,
          products: [{ productId: product_id, quantity }],
        });
      } else {
        // Nếu có rồi, kiểm tra xem sản phẩm đã có chưa
        const existingProduct = cart.products.find(
          (item) => item.productId.toString() === product_id
        );
        if (existingProduct) {
          // Nếu có rồi thì cập nhật số lượng
          existingProduct.quantity += quantity;
        } else {
          // Nếu chưa có thì thêm mới
          cart.products.push({ productId: product_id, quantity });
        }
      }
      await cart.save();
      return {
        message: "Thêm sản phẩm vào giỏ hàng thành công",
        data: cart,
        status: 200,
      };
    } catch (err) {
      console.error("Error adding to cart:", err);
      return {
        message: "Lỗi khi thêm sản phẩm vào giỏ hàng",
        status: 500,
      };
    }
  },

  removeCart: async (payload) => {
    const { user_id, product_id } = payload;
    try {
      const user = await usersModel.findById(user_id);
      if (!user) {
        return {
          message: "User not found",
          status: 404,
        };
      }

      let cart = await CartModel.findOne({ user: user_id });
      if (!cart) {
        return {
          message: "Cart not found",
          status: 404,
        };
      }

      // Tìm sản phẩm trong giỏ hàng
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === product_id
      );
      if (productIndex === -1) {
        return {
          message: "Product not found in cart",
          status: 404,
        };
      }

      // Xóa sản phẩm khỏi giỏ hàng
      cart.products.splice(productIndex, 1);

      await cart.save();
      cart = await CartModel.findOne({ user: user_id });
      if (!cart) {
        return {
          message: "Cart not found",
          status: 404,
        };
      }
      cart = await CartModel.findById(cart._id).populate("products.productId");
      return {
        message: "Xóa sản phẩm khỏi giỏ hàng thành công",
        data: cart,
        status: 200,
      };
    } catch (err) {
      console.error("Error removing from cart:", err);
      return {
        message: "Lỗi khi xóa sản phẩm khỏi giỏ hàng",
        status: 500,
      };
    }
  },

  getCart: async (user_id) => {
    try {
      const user = await usersModel.findById(user_id);
      if (!user) {
        return {
          message: "User not found",
          status: 404,
        };
      }

      const cart = await CartModel.findOne({ user: user_id }).populate(
        "products.productId"
      );
      if (!cart || cart.products.length === 0) {
        return {
          message: "Giỏ hàng trống",
          status: 200,
          data: {},
        };
      }

      return {
        message: "Lấy giỏ hàng thành công",
        status: 200,
        data: cart,
      };
    } catch (err) {
      console.error("Error getting cart:", err);
      return {
        message: "Lỗi khi lấy giỏ hàng",
        status: 500,
      };
    }
  },

  updateCart: async (payload) => {
    try {
      const { user_id, product_id, quantity } = payload;
      const user = await usersModel.findById(user_id);
      if (!user) {
        return {
          message: "User not found",
          status: 404,
        };
      }

      let cart = await CartModel.findOne({ user: user_id });

      if (!cart) {
        return {
          message: "Cart not found",
          status: 404,
        };
      }

      const existingProduct = cart.products.find(
        (item) => (item) => item.productId.toString() === product_id
      );

      if (!existingProduct) {
        return {
          message: "Product not found in cart",
          status: 404,
        };
      }
      existingProduct.quantity = quantity;

      await CartModel.updateOne(
        { user: user_id, "products.productId": product_id },
        { $set: { "products.$.quantity": quantity } }
      );

      // Tìm lại giỏ hàng sau khi cập nhật
      cart = await CartModel.findOne({ user: user_id });
      if (!cart) {
        return {
          message: "Cart not found",
          status: 404,
        };
      }

      // Kiểm tra xem giỏ hàng có sản phẩm nào không

      // Populate thông tin sản phẩm
      cart = await CartModel.findById(cart._id).populate("products.productId");
      console.log("quantity", quantity);
      return {
        message: "Lấy giỏ hàng thành công",
        status: 200,
        data: cart,
      };
    } catch (err) {
      return {
        message: "Lỗi khi lấy giỏ hàng",
        status: 500,
      };
    }
  },

  // Get orders
  async getOrders(user_id) {
    try {
      // 1. Lấy đơn hàng với populate sâu
      const orders = await OrderModel.find({ user: user_id })
        .populate({
          path: "products.productId",
          select: "name image price",
          model: "Product",
        })
        .lean();

      // 2. Format lại dữ liệu
      const formattedOrders = orders.map((order) => ({
        ...order,
        id: order._id.toString(),
        products: order.products.map((item) => {
          // Đảm bảo có giá trị mặc định nếu populate không thành công
          const product = item.productId || {};

          return {
            id: item._id.toString(),
            quantity: item.quantity,
            priceAtOrder: item.priceAtOrder,
            product: {
              id: product._id?.toString() || "unknown",
              name: product.name || "Unknown Product",
              image: product.image || "default-image-url.jpg",
              price: product.price || 0,
            },
          };
        }),
      }));
      console.log("formattedOrders", formattedOrders[0].products);

      return {
        message: "Lấy đơn hàng thành công",
        data: formattedOrders,
        status: 200,
      };
    } catch (err) {
      console.error("Error getting orders:", err);
      return {
        message: "Lỗi khi lấy đơn hàng",
        status: 500,
      };
    }
  },

  //UPDATE PRODUCT
  async addOrder(payload) {
    const {
      userId,
      cartItems,
      subtotal,
      payment,
      deliveryFee,
      shippingAddress,
      paymentMethod,
    } = payload;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Kiểm tra người dùng
      const user = await usersModel.findById(userId).session(session);
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      // 2. Kiểm tra giỏ hàng
      if (!cartItems || cartItems.length === 0) {
        throw new Error("Giỏ hàng trống");
      }
      console.log("cartItems", cartItems);

      // 3. Tạo danh sách sản phẩm cho đơn hàng (FIXED)
      const orderProducts = cartItems.map((item) => ({
        productId: item.productId?._id || item.productId, // Xử lý cả 2 trường hợp
        quantity: item.quantity,
        priceAtOrder: item.productId?.price || item.price, // Lưu giá từng sản phẩm
      }));

      // 4. Tạo đơn hàng (FIXED)
      const order = await OrderModel.create(
        [
          {
            user: userId,
            products: orderProducts,
            deliveryFee,
            payment,
            totalPrice: subtotal + deliveryFee,
            shippingAddress,
            paymentMethod,
            status: "Pending",
          },
        ],
        { session }
      );

      // 5. Cập nhật user và giỏ hàng
      await usersModel.findByIdAndUpdate(
        userId,
        { $push: { orders: order[0]._id } },
        { session }
      );

      await CartModel.findOneAndUpdate(
        { user: userId },
        { products: [] },
        { session }
      );

      await session.commitTransaction();

      return {
        message: "Tạo đơn hàng thành công",
        data: order[0],
        status: 200,
      };
    } catch (error) {
      await session.abortTransaction();
      console.error("Lỗi khi tạo đơn hàng:", error);
      throw new Error(error.message || "Không thêm được đơn hàng");
    } finally {
      session.endSession();
    }
  },

  async updateOrder(payload) {
    const { orderId, status } = payload;
    try {
      const order = await OrderModel.findById(orderId);
      if (!order) {
        return {
          message: "Order not found",
          status: 404,
        };
      }
      order.status = status;
      await order.save();
      return {
        message: "Order updated successfully",
        status: 200,
      };
    } catch (error) {
      console.log("error updating order", error);
      return {
        message: "Internal server error",
        status: 500,
      };
    }
  },

  async addToWishlist(payload) {
    try {
      const { user_id, product_id } = payload;
      const user = await usersModel.findById(user_id);
      if (!user) {
        return {
          message: "User not found",
          status: 404,
        };
      }
      const product = await ProductModel.findById(product_id);
      if (!product) {
        return {
          message: "Product not found",
          status: 404,
        };
      }
      // Check if the product is already in the user's wishlist
      const existingWishlistItem = await WishlistModel.findOne({
        user_id,
        product_id,
      });
      if (existingWishlistItem) {
        return {
          message: "Product already in wishlist",
          status: 400,
        };
      }

      // Add the product to the user's wishlist
      const wishlistItem = new WishlistModel({ user_id, product_id });
      await wishlistItem.save();
      return {
        message: "Product added to wishlist",
        status: 200,
      };
    } catch (error) {
      return {
        message: "Internal server error",
        status: 500,
      };
    }
  },
  async removeFromWishlist(payload) {
    try {
      const { user_id, product_id } = payload;

      // Kiểm tra xem user có tồn tại không
      const user = await usersModel.findById(user_id);
      if (!user) {
        return {
          message: "User not found",
          status: 404,
        };
      }

      // Kiểm tra xem sản phẩm có tồn tại không
      const product = await ProductModel.findById(product_id);
      if (!product) {
        return {
          message: "Product not found",
          status: 404,
        };
      }

      // Kiểm tra xem sản phẩm có trong wishlist của user không
      const wishlistItem = await WishlistModel.findOne({
        user_id,
        product_id,
      });
      if (!wishlistItem) {
        return {
          message: "Product not found in wishlist",
          status: 404,
        };
      }

      // Xóa sản phẩm khỏi wishlist
      await WishlistModel.deleteOne({ user_id, product_id });
      console.log("remove success");

      return {
        message: "Product removed from wishlist",
        status: 200,
      };
    } catch (error) {
      return {
        message: "Internal server error",
        status: 500,
      };
    }
  },
  async getWishlist(user_id) {
    try {
      // Kiểm tra xem user có tồn tại không
      const user = await usersModel.findById(user_id);
      if (!user) {
        return {
          message: "User not found",
          status: 404,
        };
      }

      // Lấy tất cả sản phẩm trong wishlist của user
      const wishlistItems = await WishlistModel.find({ user_id }).populate(
        "product_id"
      );

      // Kiểm tra xem wishlist có rỗng không
      if (!wishlistItems || wishlistItems.length === 0) {
        return {
          message: "Wishlist is empty",
          status: 200,
          data: {},
        };
      }
      const products = wishlistItems.map((item) => item.product_id);

      // Trả về danh sách sản phẩm trong wishlist
      return {
        message: "Wishlist retrieved successfully",
        status: 200,
        data: products,
      };
    } catch (error) {
      return {
        message: "Internal server error",
        status: 500,
      };
    }
  },
};

module.exports = ProductService;
