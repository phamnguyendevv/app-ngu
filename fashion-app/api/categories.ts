import axios from "axios";
import { API_BASE_URL } from "../config/congif";

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category/list`);
    return response;
  } catch (error) {
    throw error;
  }
};
