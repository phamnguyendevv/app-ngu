import axios from "axios";
import { API_BASE_URL } from "../config/congif";

export const getProducts = async (data: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/product/list`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addWishList = async (data: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/product/wishlist`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeWishList = async (data: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/product/remove-wishlist`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWishList = async (user_id: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/product/wishlist/${user_id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addToCart = async (data: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/add`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeFromCart = async (data: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/remove`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getCart = async (user_id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cart/${user_id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCart = async (data: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/update`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeItemFromCart = async (data: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/remove-item`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addOrder = async (data: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/order/add`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrders = async (user_id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/order/${user_id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
