import axios from "axios";

const API_BASE_URL = "https://ecommerce.routemisr.com";
const headers = { token: localStorage.getItem("userToken") };
// SignUp API
export const signup = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/auth/signup`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error during signup API call:", error);
    throw error;
  }
};

// Login API
export const login = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/auth/signin`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error during login API call:", error);
    throw error;
  }
};

// Get Products API

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/products`);
    return response.data.data;
  } catch (error) {
    console.error("Error during getProducts API call:", error);
    throw error;
  }
};

// Get Product Details API
export const getProductDetails = async (productId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/products/${productId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error during getProductDetails API call:", error);
    throw error;
  }
};

// Get Related Products API
export const getRelatedProducts = async (category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/products`);

    return response.data.data.filter(
      (product) => product.category.name === category
    );
  } catch (error) {
    console.error("Error during getRelatedProducts API call:", error);
    throw error;
  }
};

// Get Categories Images For Slider
export const getCategoriesImages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/categories`);
    return response.data.data.map((category) => category.image);
  } catch (error) {
    console.error("Error during getCategoriesImages API call:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/categories`);
    return response.data.data;
  } catch (error) {
    console.error("Error during getCategoriesImages API call:", error);
    throw error;
  }
};

// Get Subcategory By Category API
export const getSubcategoriesByCategory = async (categoryID) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/categories/${categoryID}/subcategories`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error during getSubcategoriesByCategory API call:", error);
    throw error;
  }
};

// Get Brands API
export const getBrands = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/brands`);
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error during getSubcategoriesByCategory API call:", error);
    throw error;
  }
};


