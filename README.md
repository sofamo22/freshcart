# Fresh Cart | E-commerce Platform

Welcome to our E-commerce Platform! This project is a comprehensive online shopping application built with React, providing users with a seamless and interactive shopping experience. Below, you'll find an overview of the project's features and functionalities.

## Features

### 🛒 Shopping Cart

- **Add to Cart**: Users can add products to their shopping cart with a single click.
- **View Cart**: The cart displays the number of items and the total price.
- **Remove from Cart**: Users can remove items from their cart.

### ❤️ Wishlist

- **Add to Wishlist**: Users can add products to their wishlist for future reference.
- **View Wishlist**: The wishlist displays all saved items.
- **Remove from Wishlist**: Users can remove items from their wishlist.

### 🔍 Product Search and Filtering

- **Search Bar**: Users can search for products by name.
- **Sort Products**: Products can be sorted by price, rating, and other criteria.
- **Filter Products**: Users can filter products based on categories and other attributes.

### 🛍️ Product Details

- **Product Information**: Detailed information about each product, including images, description, price, and ratings.
- **Related Products**: Display related products based on the category.

### 🔐 User Authentication

- **Sign Up**: New users can create an account.
- **Login**: Existing users can log in to access their account.
- **Logout**: Users can log out of their account.

### 🛡️ Secure Checkout

- **Payment Methods**: Users can choose between online payment and cash on delivery.
- **Order Summary**: Display a summary of the order before finalizing the purchase.

### 📦 Order Management

- **View Orders**: Users can view their past orders.
- **Order Details**: Detailed information about each order.

### 📱 Responsive Design

- **Mobile Friendly**: The application is fully responsive and works seamlessly on mobile devices.

## Code Structure

### Context

- **WishlistContext**: Manages the state and actions related to the wishlist.

```1:65:src/Context/WishlistContext.jsx
// In `src/Context/WishlistContext.jsx`
import axios from "axios";
import { createContext, useState } from "react";

export let WishlistContext = createContext();
const API_BASE_URL = "https://ecommerce.routemisr.com";
const headers = { token: localStorage.getItem("userToken") };

export default function WishlistContextProvider({ children }) {
    let [wishlistItemsNo, setWishlistItemsNo] = useState(0);

    // Add a product to the wishlist
    const addProductToWishlist = async (productId) => {
        try {
            let response = await axios.post(
                `${API_BASE_URL}/api/v1/wishlist`,
                { productId },
                { headers }
            );
            setWishlistItemsNo((prev) => prev + 1);
            return response.data;
        } catch (error) {
            console.error("Error during addProductToWishlist API call:", error);
            throw error;
        }
    };

    // Get the wishlist items
    const getWishlistItems = async () => {
        try {
            let response = await axios.get(`${API_BASE_URL}/api/v1/wishlist`, {
                headers,
            });
            setWishlistItemsNo(response.data.count);
            return response.data;
        } catch (error) {
            console.error("Error during getWishlistItems API call:", error);
            throw error;
        }
    };

    // Remove a product from the wishlist
    const removeProductFromWishlist = async (productId) => {
        try {
            let response = await axios.delete(`${API_BASE_URL}/api/v1/wishlist/${productId}`, {
                headers,
            });
            setWishlistItemsNo((prev) => prev - 1);
            return response.data;
        } catch (error) {
            console.error("Error during removeProductFromWishlist API call:", error);
            throw error;
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItemsNo, setWishlistItemsNo,
            addProductToWishlist, getWishlistItems,
            removeProductFromWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
}
```

### Components

- **RelatedProduct**: Displays related products based on the category.

```1:70:src/components/RelatedProduct/RelatedProduct.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRelatedProducts } from "../../utils/api";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { Rating } from "@mui/material";
```

- **RecentProducts**: Displays a list of recent products with search and filter functionalities.

```1:370:src/components/RecentProducts/RecentProducts.jsx
import React, {
    useContext,
    useEffect,
    useState,
    useMemo,
    useCallback,
} from "react";
import { SearchBar } from "../SearchBar/SearchBar";
import { getProducts } from "../../utils/api";
import {
    Rating,
    Skeleton,
    Dialog,
    DialogContent,
    DialogTitle,
    debounce,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    ShoppingCart,
    Check,
    Loader2,
    AlertCircle,
    Search, SlidersHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import { WishlistContext } from "../../Context/WishlistContext";

const ProductCard = React.memo(
```

- **Wishlist**: Displays the user's wishlist and allows for item removal and adding to cart.

```1:143:src/components/WishList/WishList.jsx
import { useContext, useEffect, useState } from 'react';
import { WishlistContext } from '../../Context/WishlistContext';
import { CartContext } from '../../Context/CartContext';
import { FaTrash, FaHeart, FaShoppingCart } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
```

- **ProductDetails**: Displays detailed information about a specific product.

```1:260:src/components/ProductDetails/ProductDetails.jsx
import React, { useState, useEffect, useContext } from "react";

import {
  Heart,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../Card/Card";
import { getProductDetails } from "../../utils/api";
import { useParams } from "react-router-dom";
import RelatedProduct from "../RelatedProduct/RelatedProduct";
import { CartContext } from "../../Context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { WishlistContext } from "../../Context/WishlistContext";
```

- **Navbar**: The navigation bar that includes links to different sections of the application.

```1:250:src/components/Navbar/Navbar.jsx
  const navigate = useNavigate();
  const { userLogin, setuserLogin } = useContext(userContext);
  const { cartItemsNo, cartItemsTotal } = useContext(CartContext);
  const { wishlistItemsNo } = useContext(WishlistContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const dropdownRef = useRef(null);
  const cartRef = useRef(null);

  const handleSignout = () => {
    localStorage.removeItem("userToken");
    setuserLogin(null);
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setCartOpen(false);
  };

  const toggleCart = (e) => {
    e.stopPropagation();
    setCartOpen(!cartOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
    if (cartRef.current && !cartRef.current.contains(event.target)) {
      setCartOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderCartContent = () => (
      <div className="card-body">
        <span className="text-lg font-bold">{cartItemsNo} Items</span>
        <span className="text-green-800">Subtotal: {cartItemsTotal}</span>
        <div className="card-actions">
          <Link
              className="btn bg-emerald-400 btn-block"
              to="/cart"
              onClick={() => {setCartOpen(false); setDropdownOpen(false);}}
          >
            View cart
          </Link>
          <Link
              className="btn bg-light-green btn-block mt-2"
              to="/allorders"
              onClick={() => {setCartOpen(false); setDropdownOpen(false);}}
          >
            My Orders
          </Link>
        </div>
      </div>
  );

  return (
      <div className="container mx-auto">
        <div className="navbar bg-base-100">
```

- **Checkout**: Handles the checkout process, including payment method selection and order submission.

```17:159:src/components/Checkout/Checkout.jsx
export default function Checkout() {
    let { cashOnDelivery } = useContext(CartContext);
    let navigate = useNavigate();
    let { cartId } = useParams();

    const handlePayment = async (values) => {
        console.log(values);
        let url;
        if (values.paymentMethod === 'Online') {
            url = `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=http://localhost:5173`;
            let res = await cashOnDelivery(url, values);
            if (res.status === 'success') {
                window.location.href = res.session.url;
            } else {
                alert('Error in payment');
            }
        } else if (values.paymentMethod === 'COD') {
            url = `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`;
            await cashOnDelivery(url, values);
            navigate('/allorders');
        }
    };

    const myform = useFormik({
        initialValues: { details: '', phone: '', city: '', paymentMethod: '' },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handlePayment(values);
        },
    });

    return (
        <section className="bg-white">
            <div className="h-[70vh] flex justify-center items-center">
                <div className="py-8 px-4 mx-auto max-w-2xl ">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">Checkout</h2>
                    <form onSubmit={myform.handleSubmit}>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="details" className="block mb-2 text-sm font-medium text-gray-900">Enter
                                    Details</label>
                                <input
                                    type="text"
                                    name="details"
                                    id="details"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-600 focus:border-emerald-600 block w-full p-2.5"
                                    placeholder="Type your details"
                                    onChange={myform.handleChange}
                                    onBlur={myform.handleBlur}
                                    value={myform.values.details}
                                />
                                {myform.touched.details && myform.errors.details ? (
                                    <div className="text-red-600 text-sm mt-1">{myform.errors.details}</div>
                                ) : null}
                            </div>
```

### API

- **API Utilities**: Functions for making API calls to the backend.

```1:104:src/utils/api.js
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
```

### Main Application

- **App**: The main application component that sets up the router and context providers.

```1:148:src/App.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Cart from "./components/Cart/Cart";
import Brands from "./components/Brands/Brands";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Categories from "./components/Categories/Categories";
import Products from "./components/Products/Products";
import NotFound from "./components/NotFound/NotFound";
import Home from "./components/Home/Home";
import WishList from "./components/WishList/WishList";
import UserContextProvider from "./Context/userContext";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import CartContextProvider, { CartContext } from "./Context/CartContext";
import Checkout from "./components/Checkout/Checkout.jsx";
import Orders from "./components/Orders/Orders.jsx";
import ForgetPsw from "./components/ForgetPsw/ForgetPsw.jsx";
import VerifyCode from "./components/VerifyCode/VerifyCode.jsx";
import ResetPsw from "./components/ResetPsw/ResetPsw.jsx";
import { useContext, useEffect } from "react";

let Routes = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "/cart",
        element: (
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        ),
      },
      {
        path: "/forget-password",
        element: <ForgetPsw />,
      },
      {
        path: "/verify",
        element: <VerifyCode />,
      },
      {
        path: "/reset-password",
        element: <ResetPsw />,
      },
      {
        path: "/brands",
        element: (
          <PrivateRoute>
            <Brands />
          </PrivateRoute>
        ),
      },
      {
        path: "/register",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/categories",
        element: (
          <PrivateRoute>
            <Categories />
          </PrivateRoute>
        ),
      },
      {
        path: "/products",
        element: (
          <PrivateRoute>
            <Products />
          </PrivateRoute>
        ),
      },
      {
        path: "/allorders",
        element: (
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        ),
      },
      {
        path: "/wishlist",
        element: (
          <PrivateRoute>
            <WishList />
          </PrivateRoute>
        ),
      },
      {
        path: "/checkout/:cartId",
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        ),
      },
      {
        path: "/productdetails/:category/:id",
        element: (
          <PrivateRoute>
            <ProductDetails />
          </PrivateRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
```

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/PEP0X/fresh-cart
   ```

2. **Install dependencies**:

   ```bash
   cd fresh-cart
   bun install
   ```

3. **Run the application**:

   ```bash
   bun run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173` to see the application in action.

## Contributing

We welcome contributions to improve the project. Feel free to open issues or submit pull requests.

---

Thank you for checking out our E-commerce Platform! We hope you enjoy using it as much as we enjoyed building it. Happy shopping! 🛍️✨
