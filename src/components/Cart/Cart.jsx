import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../Context/CartContext';
import { FaTrash, FaPlus, FaMinus, FaHeart, FaShoppingCart } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const {
    cartItemsTotal, setCartItemsTotal,
    cartItemsNo, setCartItemsNo,
    getCartItems, removeProduct,
    updateCartItemQuantity, clearCart,
    setCartId, cartId, loading: contextLoading
  } = useContext(CartContext);

  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);
  const [updatingQuantity, setUpdatingQuantity] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartInfo = async () => {
      if (!contextLoading) {
        try {
          setLoading(true);
          const cartItems = await getCartItems();
          setCartData(cartItems);
        } catch (error) {
          console.error("Error fetching cart info:", error);
          toast.error("Failed to load cart items");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCartInfo();
  }, [getCartItems, contextLoading]);

  const handleRemoveItem = async (productId) => {
    try {
      setRemoving(true);
      toast.loading('Removing item...');
      await removeProduct(productId);
      toast.dismiss();
      toast.success('Item removed from cart');
      const updatedCart = await getCartItems();
      setCartData(updatedCart);
      setCartItemsNo(updatedCart.numOfCartItems);
      setCartItemsTotal(updatedCart.data.totalCartPrice);
    } catch (error) {
      console.error("Error removing item:", error);
      toast.dismiss();
      toast.error('Failed to remove item');
    } finally {
      setRemoving(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      setUpdatingQuantity(prev => ({ ...prev, [productId]: true }));
      await updateCartItemQuantity(productId, newQuantity);
      const updatedCart = await getCartItems();
      setCartData(updatedCart);
      setCartItemsNo(updatedCart.numOfCartItems);
      setCartItemsTotal(updatedCart.data.totalCartPrice);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error('Failed to update quantity');
    } finally {
      setUpdatingQuantity(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setCartData(null);
      setCartItemsNo(0);
      setCartItemsTotal(0);
      toast.success('Cart cleared successfully');
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error('Failed to clear cart');
    }
  };

  if (contextLoading || loading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg text-emerald-600"></span>
        </div>
    );
  }

  if (!cartData || cartData.data.products.length === 0) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-screen bg-emerald-50"
        >
          <FaShoppingCart className="text-6xl text-emerald-300 mb-4" />
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">The Cart is Empty</h2>
          <button
              onClick={() => navigate('/')}
              className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 border-none"
          >
            Go to Home
          </button>
        </motion.div>
    );
  }

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-emerald-50 py-8 antialiased md:py-16"
      >
        <Toaster position="top-center" reverseOrder={false} toastOptions={{ className: 'mt-16' }} />
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-emerald-800 text-center font-Manrope sm:text-3xl mb-8">Shopping Cart</h2>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <div className="space-y-6">
                {cartData?.data?.products.map((item) => (
                    <div key={item._id} className="card bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">
                      <div className="card-body">
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                          <div className="w-full md:w-1/3 mb-4 md:mb-0">
                            <div className="aspect-w-4 aspect-h-3">
                              <img
                                  className="w-full h-full object-cover rounded-lg"
                                  src={item.product.imageCover}
                                  alt={item.product.title}
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="card-title text-emerald-800 text-xl mb-2">{item.product.title}</h3>
                            <p className="text-lg font-semibold text-emerald-600 mb-4">${item.price}</p>
                            <div className="flex items-center space-x-2">
                              <button
                                  className="btn btn-circle btn-sm btn-outline border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white disabled:opacity-50"
                                  onClick={() => handleUpdateQuantity(item.product.id, item.count - 1)}
                                  disabled={item.count <= 1 || updatingQuantity[item.product.id]}
                              >
                                {updatingQuantity[item.product.id] ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <FaMinus className="h-3 w-3" />
                                )}
                              </button>
                              <span className="text-lg font-semibold text-emerald-800">{item.count}</span>
                              <button
                                  className="btn btn-circle btn-sm btn-outline border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white disabled:opacity-50"
                                  onClick={() => handleUpdateQuantity(item.product.id, item.count + 1)}
                                  disabled={updatingQuantity[item.product.id]}
                              >
                                {updatingQuantity[item.product.id] ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <FaPlus className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                            <button className="btn btn-error btn-sm bg-red-500 hover:bg-red-600 border-none" onClick={() => handleRemoveItem(item.product.id)}>
                              <FaTrash className="mr-2" /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/3">
              <div className="card bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] lg:sticky lg:top-8">
                <div className="card-body">
                  <h3 className="card-title text-xl mb-4 text-emerald-800">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Total Items</span>
                      <span className="font-semibold text-emerald-600">{cartData.numOfCartItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Original Price</span>
                      <span className="font-semibold text-emerald-800">${cartData?.data?.totalCartPrice || 0}</span>
                    </div>
                    <div className="divider before:bg-emerald-200 after:bg-emerald-200"></div>
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-emerald-800">Total</span>
                      <span className="text-emerald-600">${cartData?.data?.totalCartPrice || 0}</span>
                    </div>
                  </div>
                  <div className="card-actions mt-6">
                    <Link to={`/checkout/${cartId}`} className="btn btn-primary btn-block bg-emerald-600 hover:bg-emerald-700 border-none">
                      Proceed to Checkout
                    </Link>
                    <button onClick={handleClearCart} className="btn btn-error btn-block bg-red-500 hover:bg-red-600 border-none">
                      Clear All Items
                    </button>
                  </div>
                  <div className="text-center mt-4">
                    <span className="text-sm text-emerald-600">or</span>
                    <Link to="/" className="btn btn-link text-emeral
d-600 hover:text-emerald-700">
                      Continue Shopping
                      <svg className="h-5 w-5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
  );
}