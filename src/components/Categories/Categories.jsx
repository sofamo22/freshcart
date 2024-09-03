import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { getCategories, getSubcategoriesByCategory } from "../../utils/api";

export default function Component() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingCategoryId, setLoadingCategoryId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await getCategories();
        console.log("Fetched Categories:", categoriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchSubcategories = async (categoryId) => {
    try {
      setLoadingCategoryId(categoryId);
      const subcategoriesData = await getSubcategoriesByCategory(categoryId);
      setSubcategories(subcategoriesData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoadingCategoryId(null);
    }
  };

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-green-700">
          Categories
        </h1>
        {isLoading ? (
            <div className="flex justify-center h-[63vh]">
              <span className="loading loading-infinity loading-lg text-green-500"></span>
            </div>
        ) : (
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 py-28"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
              {categories.map((category, index) => (
                  <motion.div
                      key={index}
                      className="relative group overflow-hidden rounded-lg shadow-md"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                  >
                    <img
                        src={category.image || "/placeholder.svg?height=200&width=200"}
                        alt={category.name}
                        className="w-full h-48 sm:h-60 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex flex-col items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                      <h3 className="text-white text-lg sm:text-xl font-semibold mb-2 text-center px-2">
                        {category.name}
                      </h3>
                      <button
                          onClick={() => {
                            setSelectedCategory(category.name);
                            fetchSubcategories(category._id);
                          }}
                          disabled={loadingCategoryId === category._id}
                          className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 sm:px-4 rounded transition-colors duration-300 text-sm sm:text-base ${
                              loadingCategoryId === category._id
                                  ? "opacity-75 cursor-not-allowed"
                                  : ""
                          }`}
                      >
                        {loadingCategoryId === category._id ? (
                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        ) : null}
                        See Subcategory
                      </button>
                    </div>
                  </motion.div>
              ))}
            </motion.div>
        )}

        <AnimatePresence>
          {isModalOpen && (
              <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
                <Dialog.Overlay
                    as={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50"
                />
                <Dialog.Content
                    as={motion.div}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-4 sm:p-6 shadow-lg w-[90%] sm:w-[425px] max-h-[80vh] overflow-y-auto"
                >
                  <Dialog.Title className="text-xl sm:text-2xl font-bold text-green-700">
                    {selectedCategory} Subcategories
                  </Dialog.Title>
                  <div className="mt-4">
                    {subcategories.map((subcategory, index) => (
                        <motion.div
                            key={subcategory.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="mb-2 p-2 bg-green-100 rounded text-sm sm:text-base"
                        >
                          {subcategory.name}
                        </motion.div>
                    ))}
                  </div>
                  <button
                      onClick={() => setIsModalOpen(false)}
                      className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-sm sm:text-base w-full sm:w-auto"
                  >
                    Close
                  </button>
                </Dialog.Content>
              </Dialog.Root>
          )}
        </AnimatePresence>
      </div>
  );
}