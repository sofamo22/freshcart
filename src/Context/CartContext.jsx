import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { userContext } from "./userContext.jsx";

export const CartContext = createContext();

const API_BASE_URL = "https://ecommerce.routemisr.com";

export default function CartContextProvider({ children }) {
    const [cartId, setCartId] = useState(null);
    const [cartItemsNo, setCartItemsNo] = useState(0);
    const [cartItemsTotal, setCartItemsTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const { userId } = useContext(userContext);

    const getHeaders = () => {
        return { token: localStorage.getItem("userToken") };
    };

    const getCartItems = async () => {
        try {
            let response = await axios.get(`${API_BASE_URL}/api/v1/cart`, {
                headers: getHeaders(),
            });
            setCartItemsNo(response.data.numOfCartItems);
            setCartItemsTotal(response.data.data.totalCartPrice);
            return response.data;
        } catch (error) {
            console.error("Error during getCartItems API call:", error);
            throw error;
        }
    };

    useEffect(() => {
        const initializeCart = async () => {
            try {
                const cartData = await getCartItems();
                setCartId(cartData.data._id);
            } catch (error) {
                console.error("Error initializing cart:", error);
            } finally {
                setLoading(false);
            }
        };

        initializeCart();
    }, []);

    const addProductToCart = async (productId) => {
        try {
            let response = await axios.post(
                `${API_BASE_URL}/api/v1/cart`,
                { productId },
                { headers: getHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error during addProductToCart API call:", error);
            throw error;
        }
    };

    const removeProduct = async (productId) => {
        try {
            let response = await axios.delete(`${API_BASE_URL}/api/v1/cart/${productId}`, {
                headers: getHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error during removeProduct API call:", error);
            throw error;
        }
    };

    const updateCartItemQuantity = async (productId, count) => {
        try {
            let response = await axios.put(
                `${API_BASE_URL}/api/v1/cart/${productId}`,
                { count },
                { headers: getHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error during updateCartItemQuantity API call:", error);
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            let response = await axios.delete(`${API_BASE_URL}/api/v1/cart`, {
                headers: getHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error during clearCart API call:", error);
            throw error;
        }
    };

    const cashOnDelivery = async (url, shippingAddress) => {
        try {
            let response = await axios.post(url, { shippingAddress }, { headers: getHeaders() });
            return response.data;
        } catch (error) {
            console.error("Error during CashOnDelivery API call:", error);
            throw error;
        }
    };

    const getOrders = async () => {
        try {
            let response = await axios.get(`${API_BASE_URL}/api/v1/orders/user/${userId}`, {
                headers: getHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error during getOrders API call:", error);
            throw error;
        }
    };

    return (
        <CartContext.Provider value={{
            cartItemsTotal, setCartItemsTotal,
            cartItemsNo, setCartItemsNo,
            addProductToCart, getCartItems,
            removeProduct, updateCartItemQuantity,
            clearCart, cartId, setCartId,
            cashOnDelivery, getOrders,
            loading
        }}>
            {children}
        </CartContext.Provider>
    );
}