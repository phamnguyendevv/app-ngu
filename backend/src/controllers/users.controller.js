const UserService = require("../services/users.services");
require("dotenv").config();

const loginController = async (req, res) => {
  const result = await UserService.login(req.body);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

const registerController = async (req, res) => {
  const result = await UserService.register(req.body);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

const addressesController = async (req, res) => {
  const result = await UserService.addAddress(req.body);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};
const getAdressController = async (req, res) => {
  const userId = req.params.id;
  const result = await UserService.getAdress(userId);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

const updateAddressesController = async (req, res) => {
  const result = await UserService.updateAddress(req.body);
  return res.json({
    message: "update successful",
    result,
  });
};

const deleteAddressController = async (req, res) => {
  const result = await UserService.deleteAddress(req.body);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

const meController = async (req, res) => {
  const { id } = req.params;
  const result = await UserService.getme(id);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

const updateMeController = async (req, res) => {
  const result = await UserService.updateMe(req.body);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

const forgotPassController = async (req, res) => {
  const result = await UserService.forgotPass(req.body);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};
const resetPassController = async (req, res) => {
  const result = await UserService.resetPass(req.body);
  return res.json({
    message: "reset password",
    result,
  });
};

const changePasswordController = async (req, res) => {
  const result = await UserService.changePassword(req.body);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

const verifyCodeController = async (req, res) => {
  const result = await UserService.verifyCode(req.body);
  return res.status(result.status || HTTP_STATUS.OK).json(result);
};

module.exports = {
  loginController,
  registerController,
  addressesController,
  meController,
  getAdressController,
  updateAddressesController,
  deleteAddressController,
  updateMeController,
  forgotPassController,
  resetPassController,
  changePasswordController,
  verifyCodeController,
};
