import React from "react";
import { LargeCarousel } from "../LargeCarousel/LargeCarousel";
import { CategorySlider } from "../CategorySlider/CategorySlider";
import RecentProducts from "../RecentProducts/RecentProducts";

export default function Home() {
  return (
    <>
      <div className="container mx-auto">
        <LargeCarousel />
        <CategorySlider />
        <RecentProducts />
      </div>
    </>
  );
}
