import { useContext, useEffect, useState } from 'react';
import { WishlistContext } from '../../Context/WishlistContext';
import { CartContext } from '../../Context/CartContext';
import { FaTrash, FaHeart, FaShoppingCart } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const { getWishlistItems, removeProductFromWishlist, setWishlistItemsNo } = useContext(WishlistContext);
  const { addProductToCart } = useContext(CartContext);
  const [wishlistData, setWishlistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlistInfo = async () => {
      try {
        setLoading(true);
        const wishlistItems = await getWishlistItems();
        setWishlistData(wishlistItems);
        setWishlistItemsNo(wishlistItems.count);
      } catch (error) {
        console.error("Error fetching wishlist info:", error);
        toast.error("Failed to load wishlist items");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistInfo();
  }, [getWishlistItems]);

  const handleRemoveItem = async (productId) => {
    try {
      setRemoving(true);
      toast.loading('Removing item...');
      await removeProductFromWishlist(productId);
      toast.dismiss();
      toast.success('Item removed from wishlist');
      const updatedWishlist = await getWishlistItems();
      setWishlistData(updatedWishlist);
      setWishlistItemsNo(updatedWishlist.count);
    } catch (error) {
      console.error("Error removing item:", error);
      toast.dismiss();
      toast.error('Failed to remove item');
    } finally {
      setRemoving(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      toast.loading('Adding to cart...');
      await addProductToCart(productId);
      toast.dismiss();
      toast.success('Item added to cart');
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.dismiss();
      toast.error('Failed to add item to cart');
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg text-emerald-600"></span>
        </div>
    );
  }

  if (!wishlistData || wishlistData.data.length === 0) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-screen bg-emerald-50"
        >
          <FaHeart className="text-6xl text-emerald-300 mb-4" />
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">Your Wishlist is Empty</h2>
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
          className=" py-8 antialiased md:py-16"
      >
        <Toaster position="top-center" reverseOrder={false} toastOptions={{ className: 'mt-16' }} />
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-emerald-800 text-center font-Manrope sm:text-3xl mb-8">Your Wishlist</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistData.data.map((item) => (
                <div key={item.id} className="card bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">
                  <div className="card-body">
                    <div className="aspect-w-4 aspect-h-3 mb-4">
                      <img
                          className="w-full h-full object-cover rounded-lg"
                          src={item.imageCover}
                          alt={item.title}
                      />
                    </div>
                    <h3 className="card-title text-emerald-800 text-xl mb-2">{item.title}</h3>
                    <p className="text-lg font-semibold text-emerald-600 mb-4">${item.price}</p>
                    <div className="flex justify-between">
                      <button
                          className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 border-none"
                          onClick={() => handleAddToCart(item.id)}
                      >
                        <FaShoppingCart className="mr-2" /> Add to Cart
                      </button>
                      <button
                          className="btn btn-error bg-red-500 hover:bg-red-600 border-none"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removing}
                      >
                        <FaTrash className="mr-2" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </motion.div>
  );
}