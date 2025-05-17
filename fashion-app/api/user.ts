import axios from "axios";
import { API_BASE_URL } from "../config/congif";
export const register = async (user: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, user);
    console.log("response", response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginApi = async (data: any) => {
  try {
    console.log("user", data);
    const response = await axios.post(`${API_BASE_URL}/login`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const forgetPassword = async (data: any) => {
  const datass = {
    email: data.email,
  };
  const response = await axios.post(`${API_BASE_URL}/forgot-password`, datass);
  return response;
};
export const verifyCode = async (data: any) => {
  const datass = {
    email: data.email,
    code: data.code,
  };
  const response = await axios.post(`${API_BASE_URL}/verify-code`, datass);
  return response;
};

export const rePassword = async (data: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reset-password`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (data: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/change-password`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMe = async (data: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/update-me`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMe = async (userId: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/me/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Failed to fetch user data");
  }
};

export const addAdrress = async (data: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add-address`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAddress = async (userId: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/address/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Failed to fetch user data");
  }
};

export const removeAddress = async (data: any): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/remove-address`, data);
    return response.data;
  } catch (error) {
    console.error("Error removing address:", error);
    throw new Error("Failed to remove address");
  }
};
