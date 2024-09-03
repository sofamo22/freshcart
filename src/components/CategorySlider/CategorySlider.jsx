import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { getCategoriesImages } from "../../utils/api";

export function CategorySlider() {
  const [categoriesImages, setCategoriesImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesData = await getCategoriesImages();

        setCategoriesImages(imagesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
        Categories
      </h2>
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {categoriesImages.map((categoryImage, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative bg-cover bg-center rounded-lg shadow-md h-72 flex items-center justify-center"
              style={{ backgroundImage: `url(${categoryImage})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
              <div className="relative text-white text-xl font-semibold"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
