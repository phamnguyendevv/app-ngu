const usersModel = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/crypto");
const {
  createTokenPair,
  verifyToken,
  generateTokenToken,
  refreshToken,
} = require("../utils/jwt");
const { checkEmails, sendEmail } = require("../utils/email");
const tokenModel = require("../models/token.model");
require("dotenv").config();
const crypto = require("crypto");
const code = Math.floor(1000 + Math.random() * 9000).toString();
const tempCodes = {};

let UserService = {
  //REGISTER
  register: async (payload) => {
    try {
      const { name, email, password } = payload;
      //check if user already exists
      const hashedPassword = await hashPassword(password);
      const newUser = await usersModel.insertMany({
        name,
        email,
        password: hashedPassword,
      });
      //create token pair
      const user_id = newUser[0]._id.toString();
      const verify = newUser[0].verified;
      const result = await createTokenPair(
        { user_id, verify },
        process.env.JWT_SECRET
      );
      console.log(
        "the userName is",
        newUser[0].name + " and email is",
        email + " registered successfully"
      );
      return {
        message: "User created",
        data: {
          user: newUser[0],
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        status: 200,
      };
    } catch (e) {
      return {
        message: "Email or name already exists",
        status: 400,
      };
    }
  },

  // LOGIN
  login: async (payload) => {
    const { email, password } = payload;

    const user = await usersModel.findOne({ email: email });
    if (!user) {
      console.log("user not found");
      throw new Error("Không tìm thấy user");
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      console.log("password not match");
      return {
        message: "Mật khẩu không chính xác",
        status: 400,
      };
    }
    user_id = user._id.toString();
    verify = user.verified;
    //create token pair
    const token = await createTokenPair(
      { user_id, verify },
      process.env.JWT_SECRET
    );
    console.log("the userName is", user.name + " and email is", email);
    console.log("login successfully");
    return {
      message: "Đăng nhập thành công",
      data: {
        user,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      },
      status: 200,
    };
  },

  //add a address
  addAddress: async (data) => {
    try {
      const { userId, type, address, name, phoneNumber, country, city } = data;
      const user = await usersModel.findById(userId);
      if (!user) {
        throw new Error({ message: "Không tìm thấy người dùng" });
      }

      const addressData = {
        name: name,
        number: phoneNumber,
        address: address,
        city: city,
        country: country,
        type: type,
      };

      user.addresses.push(addressData);
      // Save the updated user document
      await user.save();
      console.log(">>> user.addresses after push:");
      return {
        message: "Thêm địa chỉ thành công",
        status: 200,
      };
    } catch (error) {
      console.error("Error adding address:", error);
      throw new Error("Không thêm được địa chỉ ");
    }
  },

  //get a address
  getAdress: async (userId) => {
    try {
      const user = await usersModel.findOne({ _id: userId });
      const address = user.addresses;
      return {
        message: "Lấy địa chỉ thành công",
        address: address,
        status: 200,
      };
    } catch (err) {
      return {
        message: "Có lỗi xảy ra trong quá trình lấy địa chỉ",
        status: 500,
      };
    }
  },
  updateAddress: async (payload) => {
    try {
      const user_id = payload.userId;
      const address_id = payload.id;
      const { type, address, name, number, country, city } = payload;
      const user = await usersModel.findOne({ _id: user_id });
      if (!user) {
        throw new Error("Không tìm thấy người dùng ");
      }
      const addressData = user.addresses.id(address_id);
      if (!addressData) {
        throw new Error("Không tìm thấy địa chỉ ");
      }
      // Update the address fields
      addressData.set({
        type,
        address,
        name,
        number,
        country,
        city,
      });
      // Save the updated user document
      await user.save();
    } catch (error) {
      console.error("Error updating address:", error);
      throw new Error("Không thể cập nhật địa chỉ ");
    }
  },
  deleteAddress: async (payload) => {
    try {
      const { userId, addressId } = payload;

      const user = await usersModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Lọc bỏ địa chỉ cần xóa
      user.addresses = user.addresses.filter(
        (addr) => addr._id.toString() !== addressId
      );

      await user.save();

      return {
        message: "Địa chỉ đã được xóa",
        status: 200,
      };
    } catch (error) {
      return {
        message: "Có lỗi xảy ra trong quá trình xóa địa chỉ",
        status: 500,
      };
    }
  },

  // get profie
  getme: async (id) => {
    try {
      const user = await usersModel.findOne({ _id: id });
      console.log("get user successfully");
      return {
        message: "Lấy thông tin người dùng thành công",
        data: user,
        status: 200,
      };
    } catch (err) {
      return {
        message: "Có lỗi xảy ra trong quá trình lấy thông tin người dùng",
        status: 500,
      };
    }
  },

  updateMe: async (payload) => {
    try {
      const { name, email, address } = payload;
      const whrere = {};
      if (name) {
        whrere.name = name;
      }
      if (address) {
        whrere.addresses = address;
      }
      console.log(email);
      console.log("whrere", whrere);
      const user = await usersModel.findOneAndUpdate(
        { email },
        { $set: whrere },
        { new: true }
      );
      if (!user) {
        return {
          message: "Không tìm thấy người dùng",
          status: 400,
        };
      }
      return {
        message: "Cập nhật thông tin thành công",
        status: 200,
      };
    } catch (err) {
      return {
        message: "Có lỗi xảy ra trong quá trình cập nhật thông tin",
        status: 500,
      };
    }
  },
  forgotPass: async (payload) => {
    try {
      const { email } = payload;
      const user = await usersModel.findOne({ email });
      if (!user) {
        return {
          message: "Email không tồn tại",
          status: 400,
        };
      }
      const code = Math.floor(1000 + Math.random() * 9000).toString();

      const code_verify = `${code}`;
      tempCodes[email] = code_verify;

      await sendEmail(
        email,
        "Gửi mã Xác nhận",
        "Mã xác nhận của bạn là: " + code_verify + ""
      );
      console.log("Mã xác nhận đã được gửi đến email của bạn");
      return {
        message: "Mã xác nhận đã được gửi đến email của bạn" + code_verify,
        status: 200,
      };
    } catch (error) {
      return {
        message: "Có lỗi xảy ra trong quá trình gửi mã xác nhận",
        status: 500,
      };
    }
  },

  resetPass: async (payload) => {
    try {
      const { password, email } = payload;

      const hashedPassword = await hashPassword(password);
      try {
        const user = await usersModel.findOneAndUpdate(
          { email },
          { password: hashedPassword }
        );
        return {
          message: "Cập nhật mật khẩu thành công",
          status: 200,
        };
      } catch (error) {
        return {
          message: "Cập nhật mật khẩu không thành công",
          status: 500,
        };
      }
    } catch (error) {
      return {
        message: "Có lỗi xảy ra trong quá trình cập nhật mật khẩu",
        status: 500,
      };
    }
  },
  changePassword: async (payload) => {
    try {
      const { email, password, newPassword } = payload;

      const user = await usersModel.findOne({ email });
      if (!user) {
        throw new Error("Không tìm thấy user");
      }
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        throw new Error("Mật khẩu không chính xác");
      }
      const hashedPassword = await hashPassword(newPassword);
      console.log("password", password);
      const updatedUser = await usersModel.findOneAndUpdate(
        { email },
        { password: hashedPassword }
      );
      return {
        message: "Cập nhật mật khẩu thành công",
        status: 200,
      };
    } catch (error) {
      return {
        message: "Mật khẩu không chính xác",
        status: 400,
      };
    }
  },

  verifyCode: async (payload) => {
    try {
      const { email, code } = payload;
      if (tempCodes[email] !== code) {
        throw new Error("Mã xác nhận không chính xác");
      }
      delete tempCodes[email];
      return {
        message: "Mã xác nhận thành công",
        status: 200,
      };
    } catch (error) {
      return {
        message: "Mã xác nhận không chính xác",
        status: 400,
      };
    }
  },
};

module.exports = UserService;
