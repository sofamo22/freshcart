import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import image1 from "../../assets/Big/1.jpg";
import image2 from "../../assets/Big/2.jpg";
import image3 from "../../assets/Big/3.jpg";
import image4 from "../../assets/Big/4.jpg";

const offers = [
    { id: 1,  image: image1 },
    { id: 2,  image: image2 },
    { id: 3,  image: image3 },
    { id: 4, image: image4 },
];

export function LargeCarousel() {
    return (
        <div className="relative mb-8">
            <Swiper
                modules={[Navigation, Pagination, A11y, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={{
                    prevEl: '.swiper-button-prev',
                    nextEl: '.swiper-button-next',
                }}
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{ delay: 3000 }}
                className="rounded-lg overflow-hidden"
            >
                {offers.map((offer) => (
                    <SwiperSlide key={offer.id}>
                        <div
                            className="w-full h-96 flex items-center justify-center text-white text-4xl bg-cover bg-center"
                            style={{ backgroundImage: `url(${offer.image})` }}
                        >
                            {offer.title}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <button className="swiper-button-prev absolute top-1/2 left-4 transform -translate-y-1/2 text-green-600  rounded-full p-2 z-10">
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button className="swiper-button-next absolute top-1/2 right-4 transform -translate-y-1/2 text-green-600 rounded-full p-2 z-10">
                <ChevronRight className="h-6 w-6" />
            </button>
        </div>
    );
}