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
import { toast, Toaster } from "react-hot-toast";


const ProductCard = React.memo(
    ({
         product,
         isInWishlist,
         addedToCart,
         addingToCart,
         toggleWishlist,
         handleAddToCart,
         getRatingColor,
     }) => {
        return (
            <div className="w-full flex flex-col justify-between max-w-sm bg-white border border-gray-200 rounded-lg shadow-xl">
                <div className="relative">
                    <Link to={`/productdetails/${product.category.name}/${product.id}`}>
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
                            isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                        }
                    >
                        <motion.div
                            animate={{
                                scale: isInWishlist ? [1, 1.2, 1] : 1,
                                color: isInWishlist ? "#ef4444" : "#000000",
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
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
        );
    }
);
ProductCard.displayName = "ProductCard";
export default function RecentProducts() {
    const { addProductToCart, setCartItemsNo, setCartItemsTotal } = useContext(CartContext);
    const { addProductToWishlist, removeProductFromWishlist, getWishlistItems } = useContext(WishlistContext);

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [addedToCart, setAddedToCart] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [addingToCart, setAddingToCart] = useState({});
    const [sortOption, setSortOption] = useState("default");
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const productsData = await getProducts();
                setProducts(productsData);
                setFilteredProducts(productsData);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to fetch products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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

    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "k") {
                event.preventDefault();
                setIsSearchOpen(true);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const debouncedSearch = useMemo(
        () =>
            debounce((searchTerm) => {
                const filtered = products.filter((product) =>
                    product.title.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilteredProducts(filtered);
            }, 300),
        [products]
    );

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        if (isMobile) {
            setIsFilterOpen(false);
        }
    };

    const getRatingColor = useCallback((rating) => {
        if (rating >= 4.5) {
            return "bg-green-100 text-green-800";
        } else if (rating >= 3.5) {
            return "bg-yellow-100 text-yellow-800";
        } else if (rating >= 2.5) {
            return "bg-orange-100 text-orange-800";
        } else {
            return "bg-red-100 text-red-800";
        }
    }, []);

    const toggleWishlist = useCallback(async (productId) => {
        const isInWishlist = wishlistItems.some(item => item.id === productId);
        try {
            if (isInWishlist) {
                await removeProductFromWishlist(productId);
                setWishlistItems(prev => prev.filter(item => item.id !== productId));
                toast.success("Removed from Wishlist ❤️", {
                    position: "top-right",
                    duration: 3000,
                });
            } else {
                await addProductToWishlist(productId);
                const product = products.find(p => p.id === productId);
                setWishlistItems(prev => [...prev, product]);
                toast.success("Added to Wishlist ❤️", {
                    position: "top-right",
                    duration: 3000,
                });
            }
        } catch (error) {
            console.error("Error toggling wishlist:", error);
        }
    }, [wishlistItems, removeProductFromWishlist, addProductToWishlist, products]);

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
                toast.success("Added to Cart 🛒", {
                    position: "top-right",
                    duration: 3000,
                });
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

    const sortedProducts = useMemo(() => {
        let sorted = [...filteredProducts];
        switch (sortOption) {
            case "price-asc":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                sorted.sort((a, b) => b.price - a.price);
                break;
            case "rating-desc":
                sorted.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
                break;
            default:
                break;
        }
        return sorted;
    }, [filteredProducts, sortOption]);

    const ProductSkeleton = () => (
        <div className="w-full flex flex-col justify-between max-w-sm bg-white border border-gray-200 rounded-lg shadow-xl p-4">
            <Skeleton variant="rectangular" width="100%" height={200} />
            <div className="mt-4">
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="70%" />
                <div className="flex items-center mt-2.5 mb-5">
                    <Skeleton variant="text" width="60%" />
                </div>
                <div className="flex items-center justify-between">
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="rectangular" width={100} height={40} />
                </div>
            </div>
        </div>
    );

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
        <div className="container mx-auto">
            <Toaster />
            <div className="w-full md:w-auto flex items-center justify-center align-middle content-center ">
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    className="flex-grow md:flex-grow-0 mr-2"
                />
                {isMobile && (
                    <button
                        className="p-2 bg-gray-200 rounded-md"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        aria-label="Toggle filters"
                    >
                        <SlidersHorizontal className="w-6 h-6" />
                    </button>
                )}
            </div>
            {(!isMobile || isFilterOpen) && (
                <select
                    className="p-2 border rounded w-full md:w-auto"
                    value={sortOption}
                    onChange={handleSortChange}
                    aria-label="Sort products"
                >
                    <option value="default">Default sorting</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Highest Rated</option>
                </select>
            )}
            <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-7">
                {loading
                    ? Array.from({ length: 16 }).map((_, index) => (
                        <ProductSkeleton key={index} />
                    ))
                    : sortedProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            isInWishlist={wishlistItems.some(item => item.id === product.id)}
                            addedToCart={addedToCart}
                            addingToCart={addingToCart}
                            toggleWishlist={toggleWishlist}
                            handleAddToCart={handleAddToCart}
                            getRatingColor={getRatingColor}
                        />
                    ))}
            </div>
            <Dialog open={isSearchOpen} onClose={() => setIsSearchOpen(false)}>
                <DialogTitle>Search Products</DialogTitle>
                <DialogContent>
                    <div className="flex items-center border-b px-3 mb-4">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Type to search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <ul className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                        {sortedProducts.map((product) => (
                            <li
                                key={product.id}
                                className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    setSearchTerm(product.title);
                                    setIsSearchOpen(false);
                                }}
                            >
                                {product.title}
                            </li>
                        ))}
                    </ul>
                </DialogContent>
            </Dialog>
        </div>
    );
}