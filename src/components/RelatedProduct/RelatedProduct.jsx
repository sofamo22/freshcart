import React, { useEffect, useState, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { getRelatedProducts } from "../../utils/api";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingCart, Check, Loader2, AlertCircle } from "lucide-react";
import { Rating, Skeleton } from "@mui/material";
import { CartContext } from "../../Context/CartContext";
import { WishlistContext } from "../../Context/WishlistContext";

export default function RelatedProduct({ categoryType }) {
  const { addProductToCart, setCartItemsNo, setCartItemsTotal } = useContext(CartContext);
  const { addProductToWishlist, removeProductFromWishlist, getWishlistItems } = useContext(WishlistContext);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [addedToCart, setAddedToCart] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const relatedProductData = await getRelatedProducts(categoryType);
        setRelatedProducts(relatedProductData);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [categoryType]);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          throw new Error("User not authenticated");
        }
        const wishlistData = await getWishlistItems();
        setWishlistItems(wishlistData.data);
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
      }
    };

    fetchWishlistItems();
  }, [getWishlistItems]);

  const toggleWishlist = useCallback(async (productId) => {
    const isInWishlist = wishlistItems.some(item => item.id === productId);
    try {
      if (isInWishlist) {
        await removeProductFromWishlist(productId);
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
      } else {
        await addProductToWishlist(productId);
        const product = relatedProducts.find(p => p.id === productId);
        setWishlistItems(prev => [...prev, product]);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  }, [wishlistItems, removeProductFromWishlist, addProductToWishlist, relatedProducts]);

  const handleAddToCart = useCallback(
    async (productId) => {
      setAddingToCart((prev) => ({ ...prev, [productId]: true }));
      try {
        const response = await addProductToCart(productId);
        setAddedToCart((prev) => ({
          ...prev,
          [productId]: true,
        }));
        setCartItemsNo(response.numOfCartItems);
        setCartItemsTotal(response.data.totalCartPrice);
        setTimeout(() => {
          setAddedToCart((prev) => ({
            ...prev,
            [productId]: false,
          }));
        }, 2000);
      } catch (error) {
        console.error("Error adding product to cart:", error);
      } finally {
        setAddingToCart((prev) => ({ ...prev, [productId]: false }));
      }
    },
    [addProductToCart, setCartItemsNo, setCartItemsTotal]
  );

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "bg-green-100 text-green-800";
    if (rating >= 4) return "bg-lime-100 text-lime-800";
    if (rating >= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (error) {
    return (
      <div className="container mx-auto text-center py-10">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">
        Related Products to {categoryType}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 16 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          : relatedProducts.map((product) => (
              <div
                key={product.id}
                className="w-full flex flex-col justify-between max-w-sm bg-white border border-gray-200 rounded-lg shadow-xl"
              >
                <div className="relative">
                  <Link
                    to={`/productdetails/${product.category.name}/${product.id}`}
                  >
                    <img
                      className="p-3 rounded-t-lg image-full"
                      src={product.imageCover}
                      alt={product.title}
                    />
                  </Link>
                  <motion.button
                    className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleWishlist(product.id)}
                    aria-label={
                      wishlistItems.some(item => item.id === product.id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    <motion.div
                      animate={{
                        scale: wishlistItems.some(item => item.id === product.id) ? [1, 1.2, 1] : 1,
                        color: wishlistItems.some(item => item.id === product.id) ? "#ef4444" : "#000000",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart className="w-6 h-6" />
                    </motion.div>
                  </motion.button>
                </div>
                <div className="px-5 pb-5">
                  <h5 className="text-md font-thin tracking-tight text-dark-green">
                    {product.category.name}
                  </h5>
                  <h5 className="text-xl font-semibold tracking-tight text-gray-900">
                    {product.title.length > 30
                      ? `${product.title.slice(0, 30)}...`
                      : product.title}
                  </h5>
                  <div className="flex items-center mt-2.5 mb-5">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <Rating
                        name="read-only"
                        precision={0.5}
                        value={product.ratingsAverage}
                        readOnly
                      />
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded ${getRatingColor(
                          product.ratingsAverage
                        )}`}
                      >
                        {product.ratingsAverage}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900">
                      {product.price} <span className="text-2xl">EGP</span>
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.button
                        className="relative flex items-center justify-center w-36 h-10 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addedToCart[product.id] || addingToCart[product.id]}
                        aria-label={
                          addedToCart[product.id]
                            ? "Added to cart"
                            : addingToCart[product.id]
                              ? "Adding to cart"
                              : "Add to cart"
                        }
                      >
                        <AnimatePresence mode="wait">
                          {addingToCart[product.id] ? (
                            <motion.div
                              key="loading"
                              className="flex items-center"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Adding...
                            </motion.div>
                          ) : addedToCart[product.id] ? (
                            <motion.div
                              key="added"
                              className="flex items-center"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Check className="w-5 h-5 mr-2" />
                              Added!
                            </motion.div>
                          ) : (
                            <motion.div
                              key="add"
                              className="flex items-center"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ShoppingCart className="w-5 h-5 mr-2" />
                              Add to cart
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </>
  );
}

const ProductSkeleton = () => (
  <div className="w-full flex flex-col justify-between max-w-sm bg-white border border-gray-200 rounded-lg shadow-xl">
    <div className="relative p-3">
      <Skeleton variant="rectangular" width="100%" height={200} className="rounded-lg" />
      <Skeleton variant="circular" width={40} height={40} className="absolute top-5 right-5" />
    </div>
    <div className="px-5 pb-5">
      <Skeleton variant="text" width="30%" height={20} className="mb-2" />
      <Skeleton variant="text" width="100%" height={24} className="mb-2" />
      <div className="flex items-center mt-2.5 mb-5">
        <Skeleton variant="rectangular" width={120} height={24} className="rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width="40%" height={32} />
        <Skeleton variant="rectangular" width={120} height={40} className="rounded-lg" />
      </div>
    </div>
  </div>
);