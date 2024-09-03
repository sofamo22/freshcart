import { createContext, useState, useEffect } from "react";
import axios from "axios";

export let WishlistContext = createContext();
const API_BASE_URL = "https://ecommerce.routemisr.com";

const getHeaders = () => {
    return { token: localStorage.getItem("userToken") };
};

export default function WishlistContextProvider({ children }) {
    let [wishlistItemsNo, setWishlistItemsNo] = useState(0);

    useEffect(() => {
        // Refresh headers on token change
        axios.defaults.headers.common['token'] = localStorage.getItem("userToken");
    }, [localStorage.getItem("userToken")]);

    const addProductToWishlist = async (productId) => {
        try {
            let response = await axios.post(
                `${API_BASE_URL}/api/v1/wishlist`,
                { productId },
                { headers: getHeaders() }
            );
            setWishlistItemsNo((prev) => prev + 1);
            return response.data;
        } catch (error) {
            console.error("Error during addProductToWishlist API call:", error);
            throw error;
        }
    };

    const getWishlistItems = async () => {
        try {
            let response = await axios.get(`${API_BASE_URL}/api/v1/wishlist`, {
                headers: getHeaders(),
            });
            setWishlistItemsNo(response.data.count);
            return response.data;
        } catch (error) {
            console.error("Error during getWishlistItems API call:", error);
            throw error;
        }
    };

    const removeProductFromWishlist = async (productId) => {
        try {
            let response = await axios.delete(`${API_BASE_URL}/api/v1/wishlist/${productId}`, {
                headers: getHeaders(),
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